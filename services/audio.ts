// Browser audio helpers for voice chat.
//
// MediaRecorder produces a different container per browser (WebM in
// Chrome, MP4 in Safari, Ogg in Firefox), and not all of those are
// accepted by the Gemini API. So the recording is decoded and
// re-encoded as 16 kHz mono WAV, which every model accepts and which
// is plenty for speech (~32 KB per second).

const TARGET_SAMPLE_RATE = 16000;

export function isRecordingSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.MediaRecorder !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia
  );
}

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

// Decode whatever MediaRecorder produced and resample to 16 kHz mono.
export async function toWav16k(recording: Blob): Promise<Blob> {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;

  const ctx = new AudioCtx();

  try {
    const decoded = await ctx.decodeAudioData(await recording.arrayBuffer());

    const length = Math.max(
      1,
      Math.ceil(decoded.duration * TARGET_SAMPLE_RATE)
    );
    const offline = new OfflineAudioContext(1, length, TARGET_SAMPLE_RATE);

    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination); // down-mixes to mono
    source.start();

    const rendered = await offline.startRendering();

    return encodeWav(rendered.getChannelData(0), TARGET_SAMPLE_RATE);
  } finally {
    ctx.close().catch(() => undefined);
  }
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      resolve(url.slice(url.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

// Strip markdown before handing text to the browser's own voice, so
// it doesn't read out asterisks and pipes.
export function speakableText(text: string): string {
  return text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[#*_`~>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
