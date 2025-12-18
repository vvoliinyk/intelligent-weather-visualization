export function valueToColor(value: number): string {
  const v = Math.max(0, Math.min(1, value));

  if (v === 1) {
   
    return `#00ff00`;
  }

  // 0.9 → 0.8 : помаранчевий → червоний
  if (v > 0.8) {
    const t = (0.9 - v) / 0.1; // 0 → 1
    const r = 255;
    const g = Math.round(153 * (1 - t)); // 153 → 0
    return `rgb(${r}, ${g}, 0)`;
  }

  // 0.8 → 0.3 : червоний (яскравий → темний)
  if (v >= 0.3) {
  const t = (v - 0.3) / 0.5; // 0 → 1
  const r = Math.round(60 + 195 * t); // 80 → 255
  return `rgb(${r}, 0, 0)`;
  }



  // < 0.3 : чорний
  return '#000000';
}