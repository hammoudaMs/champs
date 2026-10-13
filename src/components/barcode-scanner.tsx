"use client";

import { useEffect, useRef } from "react";

type BarcodeScannerProps = {
  active: boolean;
  onDetected: (code: string) => void;
  onError?: (message: string) => void;
};

export function BarcodeScanner({ active, onDetected, onError }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastCode = useRef("");

  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!active) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      return;
    }
    let cancelled = false;
    let timer: number | undefined;

    async function start() {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
        if (cancelled) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = media;
        const video = videoRef.current;
        if (video) {
          video.srcObject = media;
          await video.play();
        }

        const formats = [
          "ean_13",
          "ean_8",
          "code_128",
          "code_39",
          "upc_a",
          "upc_e",
          "qr_code",
        ];
        if ("BarcodeDetector" in window) {
          const detector = new BarcodeDetector({ formats });
          timer = window.setInterval(async () => {
            const el = videoRef.current;
            if (!el || el.readyState < 2) return;
            try {
              const codes = await detector.detect(el);
              const raw = codes[0]?.rawValue?.trim();
              if (!raw || raw === lastCode.current) return;
              lastCode.current = raw;
              onDetected(raw);
            } catch {
              /* ignore frame errors */
            }
          }, 400);
        } else {
          const { BrowserMultiFormatReader } = await import(
            "@zxing/browser/esm/readers/BrowserMultiFormatReader"
          );
          const reader = new BrowserMultiFormatReader();
          reader.decodeFromVideoDevice(undefined, videoRef.current!, (result, err) => {
            if (result) {
              const raw = result.getText().trim();
              if (!raw || raw === lastCode.current) return;
              lastCode.current = raw;
              onDetected(raw);
            }
            if (err && err.name !== "NotFoundException") {
              onError?.(err.message);
            }
          });
        }
      } catch {
        onError?.("camera_unavailable");
      }
    }

    void start();
    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [active, onDetected, onError]);

  if (!active) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-black">
      <video ref={videoRef} className="aspect-[4/3] w-full object-cover" muted playsInline />
    </div>
  );
}
