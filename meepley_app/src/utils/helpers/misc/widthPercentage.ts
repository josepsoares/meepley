export function widthPer(percentage: number, viewportWidth: number) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}
