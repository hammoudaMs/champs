export function playReadyChime(): void {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    osc.stop(ctx.currentTime + 0.4);
    window.setTimeout(() => void ctx.close(), 500);
  } catch {
    /* no audio */
  }
}

export function vibrateReady(): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([120, 60, 120, 60, 200]);
  }
}

export async function notifyOrderReady(title: string, body: string): Promise<void> {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, tag: "champs-order-ready" });
  } catch {
    /* ignored */
  }
}
