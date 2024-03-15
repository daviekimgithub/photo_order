export function getScaleDownFactor(original_px, px) {
  if (px == 0 || original_px == 0) return 0;

  var factor = px / original_px;
  return factor;
}

export function getScaleUpFactor(original_px, px) {
  if (px == 0 || original_px == 0) return 0;

  var factor = original_px / px;
  return factor;
}

export function getPointTransformation(x, y, factor) {
  var newPoint = {
    x: Math.round(x * factor),
    y: Math.round(y * factor),
  };
  return newPoint;
}

export function getRectTransformation(x, y, w, h, factor) {
  var newTopLeft = getPointTransformation(x, y, factor);
  var newBottomRight = getPointTransformation(x + w, y + h, factor);

  var newRect = {
    x: newTopLeft.x,
    y: newTopLeft.y,
    w: newBottomRight.x - newTopLeft.x,
    h: newBottomRight.y - newTopLeft.y,
  };
  return newRect;
}

export function getRectOrientTransformation(img, window) {
  let factor = getScaleDownFactor(img.width, window.width);

  let newImg = getRectTransformation(
    img.x,
    img.y,
    img.width,
    img.height,
    factor
  );

  if (newImg.h < window.height) {
    factor = getScaleDownFactor(img.height, window.height);
    newImg = getRectTransformation(img.x, img.y, img.width, img.height, factor);
  }

  newImg.x = window.x;
  newImg.y = window.y;

  var position_delta_x = window.width - newImg.w;

  if (position_delta_x != 0) {
    var correction_x = Math.round(position_delta_x / 2);
    newImg.x = newImg.x + correction_x;
  }

  var position_delta_y = window.height - newImg.h;

  if (position_delta_y != 0) {
    var correction_y = Math.round(position_delta_y / 2);
    newImg.y = newImg.y + correction_y;
  }

  return newImg;
}