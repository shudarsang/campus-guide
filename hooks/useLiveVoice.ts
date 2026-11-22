"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { liveVoiceUrl } from "@/services/api";
import { isLiveVoiceSupported, MicStreamer, PcmPlayer } from "@/services/liveAudio";
import { LiveActivity, LiveStatus } from "@/types/chat";

type ServerEvent =
  | { type: "ready" }
  | { type: "user_text"; text: string }
  | { type: "zia_text"; text: string }
  | { type: "searching"; query: string }
  | { type: "interrupted" }
  | { type: "turn_complete" }
  | { type: "error"; message: string };

// Called once per finished exchange, to record it in the chat.
type OnTurn = (userText: string, ziaText: string) => void;

export function useLiveVoice(onTurn: OnTurn) {
  const [status, setStatus] = useState<LiveStatus>("idle");
  const [activity, setActivity] = useState<LiveActivity>("listening");
  const [userCaption, setUserCaption] = useState("");
  const [ziaCaption, setZiaCaption] = useState("");
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const micRef = useRef<MicStreamer | null>(null);
  const playerRef = useRef<PcmPlayer | null>(null);
  const speakingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Text of the exchange in progress; refs because WebSocket handlers
  // outlive renders.
  const userTextRef = useRef("");
  const ziaTextRef = useRef("");
  const turnOpenRef = useRef(false);
  const onTurnRef = useRef(onTurn);
  onTurnRef.current = onTurn;

  useEffect(() => {
    setSupported(isLiveVoiceSupported());
  }, []);

  // Push the finished exchange into the chat and start a fresh one.
  const commitTurn = useCallback(() => {
    if (userTextRef.current.trim() || ziaTextRef.current.trim()) {
      onTurnRef.current(userTextRef.current, ziaTextRef.current);
    }
    userTextRef.current = "";
    ziaTextRef.current = "";
    turnOpenRef.current = false;
  }, []);

  // After Zia's last audio chunk has actually finished playing, go
  // back to "listening".
  const settleWhenQuiet = useCallback(() => {
    if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
    const wait = (playerRef.current?.remainingMs() ?? 0) + 80;
    speakingTimerRef.current = setTimeout(() => {
      if ((playerRef.current?.remainingMs() ?? 0) > 0) settleWhenQuiet();
      else setActivity("listening");
    }, wait);
  }, []);

  const teardown = useCallback(() => {
    if (speakingTimerRef.current) clearTimeout(speakingTimerRef.current);
    speakingTimerRef.current = null;

    const ws = wsRef.current;
    wsRef.current = null;
    if (ws) {
      ws.onmessage = null;
      ws.onclose = null;
      ws.onerror = null;
      if (ws.readyState === WebSocket.OPEN) {
        try {
          ws.send(JSON.stringify({ type: "stop" }));
        } catch {
          // Closing anyway.
        }
      }
      ws.close();
    }

    micRef.current?.stop();
    micRef.current = null;
    playerRef.current?.close();
    playerRef.current = null;

    setLevel(0);
    setStatus("idle");
    setActivity("listening");
  }, []);

  const stop = useCallback(() => {
    commitTurn();
    teardown();
    setUserCaption("");
    setZiaCaption("");
  }, [commitTurn, teardown]);

  const fail = useCallback(
    (message: string) => {
      commitTurn();
      teardown();
      setError(message);
    },
    [commitTurn, teardown]
  );

  const handleEvent = useCallback(
    (event: ServerEvent) => {
      switch (event.type) {
        case "user_text":
          // First words of a new exchange: clear the previous captions.
          if (!turnOpenRef.current) {
            turnOpenRef.current = true;
            setZiaCaption("");
          }
          userTextRef.current += event.text;
          setUserCaption(userTextRef.current);
          break;

        case "searching":
          setActivity("searching");
          break;

        case "zia_text":
          turnOpenRef.current = true;
          ziaTextRef.current += event.text;
          setZiaCaption(ziaTextRef.current);
          break;

        case "interrupted":
          // The user spoke over Zia: silence her at once.
          playerRef.current?.interrupt();
          if (ziaTextRef.current) ziaTextRef.current += " …";
          commitTurn();
          setActivity("listening");
          break;

        case "turn_complete":
          commitTurn();
          settleWhenQuiet();
          break;

        case "error":
          fail(event.message);
          break;
      }
    },
    [commitTurn, fail, settleWhenQuiet]
  );

  const start = useCallback(async () => {
    if (wsRef.current) return;

    setError(null);
    setUserCaption("");
    setZiaCaption("");
    userTextRef.current = "";
    ziaTextRef.current = "";
    turnOpenRef.current = false;
    setStatus("connecting");
    setActivity("listening");

    // Must be created inside the click, or the browser blocks playback.
    const player = new PcmPlayer();
    playerRef.current = player;
    void player.resume();

    const mic = new MicStreamer();
    micRef.current = mic;

    const ws = new WebSocket(liveVoiceUrl());
    ws.binaryType = "arraybuffer";
    wsRef.current = ws;

    let ready = false;

    ws.onmessage = (e: MessageEvent) => {
      if (e.data instanceof ArrayBuffer) {
        playerRef.current?.play(e.data);
        setActivity("speaking");
        return;
      }

      let event: ServerEvent;
      try {
        event = JSON.parse(e.data as string) as ServerEvent;
      } catch {
        return;
      }

      if (event.type === "ready") {
        ready = true;
        setStatus("live");
        // Only stream the mic once Gemini is listening.
        mic
          .start((pcm, rms) => {
            if (wsRef.current === ws && ws.readyState === WebSocket.OPEN) ws.send(pcm);
            setLevel(Math.min(1, rms * 6));
          })
          .catch(() =>
            fail("Microphone access is blocked. Allow it in your browser to talk to Zia.")
          );
        return;
      }

      handleEvent(event);
    };

    ws.onerror = () => {
      // onclose follows with the details.
    };

    ws.onclose = () => {
      if (wsRef.current !== ws) return; // we closed it ourselves
      fail(
        ready
          ? "The voice call ended. Tap the call button to talk again."
          : "Couldn't connect to Zia's voice service. Please try again in a moment."
      );
    };
  }, [fail, handleEvent]);

  // Hang up if the chat window closes mid-call.
  useEffect(() => () => teardown(), [teardown]);

  return {
    supported,
    status,
    activity,
    userCaption,
    ziaCaption,
    level,
    error,
    clearError: () => setError(null),
    start,
    stop,
  };
}
