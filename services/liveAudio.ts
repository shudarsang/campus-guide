// Audio plumbing for live voice chat with Zia.
//
// MicStreamer  - captures the microphone and emits 100 ms chunks of
//                raw 16-bit PCM at 16 kHz, the format Gemini Live takes.
// PcmPlayer    - plays Zia's streamed 24 kHz PCM back-to-back with no
//                gaps, and can be cut off instantly when the user
//                interrupts.

// Runs on the audio thread. Downsamples whatever rate the device uses
// (usually 44.1 or 48 kHz) to 16 kHz by averaging - enough of an
// anti-alias filter for speech - and converts to 16-bit integers.
// Inlined as a string so no extra static file has to be served.
const RECORDER_WORKLET = `
class PcmRecorder extends AudioWorkletProcessor {
  constructor() {
    super();
    this.ratio = sampleRate / 16000;
    this.out = new Int16Array(1600);
    this.length = 0;
    this.phase = 0;
    this.sum = 0;
    this.count = 0;
    this.energy = 0;
    this.frames = 0;
  }
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (!channel) return true;
    for (let i = 0; i < channel.length; i++) {
      const v = channel[i];
      this.energy += v * v;
      this.frames++;
      this.sum += v;
      this.count++;
      this.phase += 1;
      if (this.phase >= this.ratio) {
        this.phase -= this.ratio;
        const s = Math.max(-1, Math.min(1, this.sum / this.count));
        this.sum = 0;
        this.count = 0;
        this.out[this.length++] = s < 0 ? s * 0x8000 : s * 0x7fff;
        if (this.length === this.out.length) {
          const pcm = this.out.slice().buffer;
          const level = Math.sqrt(this.energy / Math.max(1, this.frames));
          this.energy = 0;
          this.frames = 0;
          this.length = 0;
          this.port.postMessage({ pcm, level }, [pcm]);
        }
      }
    }
    return true;
  }
}
registerProcessor("pcm-recorder", PcmRecorder);
`;

type AudioContextCtor = typeof AudioContext;

function audioContextClass(): AudioContextCtor {
  return (
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: AudioContextCtor })
      .webkitAudioContext
  );
}

export function isLiveVoiceSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof WebSocket !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof window.AudioWorkletNode !== "undefined"
  );
}

export class MicStreamer {
  private ctx: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private node: AudioWorkletNode | null = null;

  async start(onChunk: (pcm: ArrayBuffer, level: number) => void) {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        // Echo cancellation keeps Zia's own voice (from the speakers)
        // from being heard as the user talking and cutting her off.
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    const Ctx = audioContextClass();
    this.ctx = new Ctx();

    const url = URL.createObjectURL(
      new Blob([RECORDER_WORKLET], { type: "application/javascript" })
    );
    try {
      await this.ctx.audioWorklet.addModule(url);
    } finally {
      URL.revokeObjectURL(url);
    }

    const source = this.ctx.createMediaStreamSource(this.stream);
    this.node = new AudioWorkletNode(this.ctx, "pcm-recorder");
    this.node.port.onmessage = (e: MessageEvent<{ pcm: ArrayBuffer; level: number }>) =>
      onChunk(e.data.pcm, e.data.level);

    // Route through a muted gain to the destination: some browsers only
    // run nodes that are connected to the output.
    const mute = this.ctx.createGain();
    mute.gain.value = 0;
    source.connect(this.node);
    this.node.connect(mute);
    mute.connect(this.ctx.destination);

    if (this.ctx.state === "suspended") await this.ctx.resume();
  }

  stop() {
    if (this.node) this.node.port.onmessage = null;
    this.node?.disconnect();
    this.node = null;
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.ctx?.close().catch(() => undefined);
    this.ctx = null;
  }
}

const OUTPUT_SAMPLE_RATE = 24000;

export class PcmPlayer {
  private ctx: AudioContext;
  private nextStart = 0;
  private sources = new Set<AudioBufferSourceNode>();

  // Create during the click that starts the call - browsers only allow
  // audio to start from a user gesture.
  constructor() {
    const Ctx = audioContextClass();
    this.ctx = new Ctx({ sampleRate: OUTPUT_SAMPLE_RATE });
  }

  async resume() {
    if (this.ctx.state === "suspended") await this.ctx.resume();
  }

  play(chunk: ArrayBuffer) {
    const bytes = chunk.byteLength - (chunk.byteLength % 2);
    if (bytes === 0) return;

    const samples = new Int16Array(chunk, 0, bytes / 2);
    const floats = new Float32Array(samples.length);
    for (let i = 0; i < samples.length; i++) floats[i] = samples[i] / 0x8000;

    const buffer = this.ctx.createBuffer(1, floats.length, OUTPUT_SAMPLE_RATE);
    buffer.getChannelData(0).set(floats);

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.ctx.destination);

    // Queue right after the previous chunk so speech is seamless.
    const start = Math.max(this.ctx.currentTime + 0.03, this.nextStart);
    source.start(start);
    this.nextStart = start + buffer.duration;

    this.sources.add(source);
    source.onended = () => this.sources.delete(source);
  }

  // Milliseconds of queued speech still to play.
  remainingMs(): number {
    return Math.max(0, (this.nextStart - this.ctx.currentTime) * 1000);
  }

  // Cut Zia off immediately (the user started talking).
  interrupt() {
    this.sources.forEach((s) => {
      try {
        s.stop();
      } catch {
        // Already finished.
      }
    });
    this.sources.clear();
    this.nextStart = 0;
  }

  close() {
    this.interrupt();
    this.ctx.close().catch(() => undefined);
  }
}
