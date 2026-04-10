import confetti from "canvas-confetti";

const SHARED = {
  particleCount: 70,
  spread: 60,
  startVelocity: 50,
  ticks: 220,
  colors: ["#1a1a1a", "#404040", "#737373", "#a3a3a3", "#d4d4d4"],
} satisfies confetti.Options;

export function fireConfetti() {
  confetti({ ...SHARED, angle: 60, origin: { x: 0, y: 1 } });
  confetti({ ...SHARED, angle: 120, origin: { x: 1, y: 1 } });
}
