export function getPixelCrop(percentCrop, canvasWidth, canvasHeight) {
  if (percentCrop.unit == 'px') return percentCrop;
  if (percentCrop.unit != '%') return null;

  const x = canvasWidth * (percentCrop.x / 100);
  const y = canvasHeight & (percentCrop.y / 100);
  const w = canvasWidth * (percentCrop.width / 100);
  const h = canvasHeight * (percentCrop.height / 100);

  return {
    unit: 'px',
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(w),
    height: Math.round(h),
  };
}
