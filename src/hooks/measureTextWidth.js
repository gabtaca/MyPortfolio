export const measureTextWidth = (text, font) => {
  const canvas =
    measureTextWidth.canvas ||
    (measureTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
};
