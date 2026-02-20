type RGB = [number, number, number];

// Gradient stops: dark red -> red -> salmon -> cream -> light green -> green -> dark green
export const NEG_DARK: RGB = [153, 27, 27]; // #991B1B
export const NEG_MID: RGB = [220, 70, 55]; // #DC4637
export const NEG_LIGHT: RGB = [245, 190, 170]; // #F5BEAA
export const NEUTRAL: RGB = [252, 246, 228]; // #FCF6E4
export const POS_LIGHT: RGB = [190, 225, 160]; // #BEE1A0
export const POS_MID: RGB = [80, 180, 60]; // #50B43C
export const POS_DARK: RGB = [22, 101, 52]; // #166534

/** Linearly interpolate between two [r,g,b] colors */
export function lerpColor(a: RGB, b: RGB, t: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}

/**
 * Diverging background color: red <-> cream <-> green.
 * @param value  The cell value
 * @param scale  The absolute max of the range (1 for correlation, 10 for monthly returns)
 */
export function getCellBg(value: number | null, scale: number): string {
  if (value == null) return "#F3F4F6";
  const clamped = Math.max(-scale, Math.min(scale, value));
  const half = scale / 2;
  const tenth = scale / 10;

  if (clamped < -half) {
    const t = (clamped + scale) / half;
    return lerpColor(NEG_DARK, NEG_MID, t);
  }
  if (clamped < -tenth) {
    const t = (clamped + half) / (half - tenth);
    return lerpColor(NEG_MID, NEG_LIGHT, t);
  }
  if (clamped < 0) {
    const t = (clamped + tenth) / tenth;
    return lerpColor(NEG_LIGHT, NEUTRAL, t);
  }
  if (clamped < tenth) {
    const t = clamped / tenth;
    return lerpColor(NEUTRAL, POS_LIGHT, t);
  }
  if (clamped < half) {
    const t = (clamped - tenth) / (half - tenth);
    return lerpColor(POS_LIGHT, POS_MID, t);
  }
  const t = (clamped - half) / half;
  return lerpColor(POS_MID, POS_DARK, t);
}

/**
 * Text color: white on dark backgrounds, dark gray otherwise.
 * @param value  The cell value
 * @param scale  The absolute max of the range (1 for correlation, 10 for monthly returns)
 */
export function getCellText(value: number | null, scale: number): string {
  if (value == null) return "#9CA3AF";
  const threshold = scale * 0.7;
  if (value > threshold || value < -threshold) return "#FFFFFF";
  return "#1F2937";
}
