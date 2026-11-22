"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  base64ToBlob,
  blobToBase64,
  isRecordingSupported,
  speakableText,
  toWav16k,
} from "@/services/audio";
import { VoiceApiResponse, VoiceLanguage, VoiceState } from "@/types/chat";

// A spoken question rarely needs more; also bounds upload size and cost.
const MAX_RECORDING_MS = 30_000;
// Shorter than this is almost always an accidental tap.
const MIN_RECORDING_MS = 400;
const LANGUAGE_STORAGE_KEY = "zia-voice-language";

export const VOICE_LANGUAGES: { code: VoiceLanguage; label: string; short: string }[] = [
  { code: "en-IN", label: "English", short: "EN" },
  { code: "hi-IN", label: "हिन्दी", short: "हि" },
  { code: "ta-IN", label: "தமிழ்", short: "த" },
  { code: "te-IN", label: "తెలుగు", short: "తె" },
  { code: "ml-IN", label: "മലയാളം", short: "മ" },
];

type SendVoice = (
  audio: string,
  mimeType: string,
  language: VoiceLanguage
) => Promise<VoiceApiResponse | null>;

export function useVoice(sendVoice: SendVoice) {
  const [state, setState] = useState<VoiceState>("idle");
  const [language, setLanguageState] = useState<VoiceLanguage>("en-IN");
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const languageRef = useRef<VoiceLanguage>("en-IN");

  // Client-only checks, after hydration.
  useEffect(() => {
    setSupported(isRecordingSupported());
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as VoiceLanguage | null;
      if (saved && VOICE_LANGUAGES.some((l) => l.code === saved)) {
        languageRef.current = saved;
        setLanguageState(saved);
      }
    } catch {
      // Storage blocked - default language is fine.
    }
  }, []);

  const setLanguage = useCallback((code: VoiceLanguage) => {
    languageRef.current = code;
    setLanguageState(code);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    } catch {
      // Not persisted; still applies for this session.
    }
  }, []);

  const releaseMic = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setState("idle");
  }, []);

  // Fallback when the server sent no audio (TTS quota, error): the
  // browser's own voice. Quality varies by device and language.
  const speakWithBrowser = useCallback((text: string, lang: VoiceLanguage) => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    const spoken = speakableText(text);
    if (!synth || !spoken) {
      setState("idle");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(spoken);
    utterance.lang = lang;
    const prefix = lang.split("-")[0];
    const voice = synth
      .getVoices()
      .find((v) => v.lang === lang || v.lang.startsWith(prefix));
    if (voice) utterance.voice = voice;

    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");

    setState("speaking");
    synth.speak(utterance);
  }, []);

  const playReply = useCallback(
    (data: VoiceApiResponse) => {
      if (!data.audio) {
        speakWithBrowser(data.response, data.language || languageRef.current);
        return;
      }

      const url = URL.createObjectURL(
        base64ToBlob(data.audio, data.audio_mime || "audio/wav")
      );
      const audio = new Audio(url);
      audioRef.current = audio;
      audioUrlRef.current = url;

      const finish = () => {
        if (audioRef.current === audio) stopSpeaking();
      };
      audio.onended = finish;
      audio.onerror = finish;

      setState("speaking");
      audio.play().catch(() => {
        // Autoplay refused - fall back to the browser voice.
        finish();
        speakWithBrowser(data.response, data.language || languageRef.current);
      });
    },
    [speakWithBrowser, stopSpeaking]
  );

  const handleRecording = useCallback(
    async (recording: Blob, durationMs: number) => {
      if (durationMs < MIN_RECORDING_MS || recording.size === 0) {
        setState("idle");
        setError("Hold on a little longer - tap the mic, speak, then tap again.");
        return;
      }

      setState("processing");

      try {
        const wav = await toWav16k(recording);
        const audio = await blobToBase64(wav);
        const data = await sendVoice(audio, "audio/wav", languageRef.current);

        if (data?.response) {
          playReply(data);
        } else {
          setState("idle");
        }
      } catch {
        setState("idle");
        setError("Couldn't process that recording. Please try again.");
      }
    },
    [playReply, sendVoice]
  );

  const startRecording = useCallback(async () => {
    setError(null);

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
    } catch {
      setError("Microphone access is blocked. Allow it in your browser to talk to Zia.");
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];

    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const duration = Date.now() - startedAtRef.current;
      releaseMic();
      recorderRef.current = null;
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "audio/webm",
      });
      void handleRecording(blob, duration);
    };

    startedAtRef.current = Date.now();
    recorder.start();
    setState("recording");

    timerRef.current = setTimeout(() => {
      if (recorder.state === "recording") recorder.stop();
    }, MAX_RECORDING_MS);
  }, [handleRecording, releaseMic]);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "recording") recorder.stop();
  }, []);

  // One button: tap to talk, tap to send, tap to interrupt Zia.
  const toggle = useCallback(() => {
    if (state === "idle") void startRecording();
    else if (state === "recording") stopRecording();
    else if (state === "speaking") stopSpeaking();
  }, [state, startRecording, stopRecording, stopSpeaking]);

  // Release the mic and silence playback if the chat window closes.
  useEffect(
    () => () => {
      const recorder = recorderRef.current;
      if (recorder) {
        recorder.onstop = null;
        if (recorder.state === "recording") recorder.stop();
      }
      releaseMic();
      audioRef.current?.pause();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    },
    [releaseMic]
  );

  return {
    state,
    language,
    setLanguage,
    error,
    clearError: () => setError(null),
    supported,
    toggle,
    stopSpeaking,
  };
}
