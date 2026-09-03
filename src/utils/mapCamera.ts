export type BBox = [number, number, number, number]; // [minX, minY, maxX, maxY]
export type CameraRect = {x: number; y: number; width: number; height: number};

/**
 * Turns a prefecture's raw bounding box into a "camera" viewBox rect that
 * frames it with some breathing room, while keeping the same aspect ratio
 * as the full map (so zooming in never distorts the shapes) and never
 * zooming in so far that a tiny prefecture loses all surrounding context.
 */
export const cameraRectForBBox = (
  bbox: BBox,
  fullBBox: BBox,
  options?: {paddingFactor?: number; minSizeFraction?: number},
): CameraRect => {
  const paddingFactor = options?.paddingFactor ?? 1.9;
  const minSizeFraction = options?.minSizeFraction ?? 0.32;

  const [minX, minY, maxX, maxY] = bbox;
  const [fullMinX, fullMinY, fullMaxX, fullMaxY] = fullBBox;
  const fullWidth = fullMaxX - fullMinX;
  const fullHeight = fullMaxY - fullMinY;
  const fullAspect = fullWidth / fullHeight;

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  let width = Math.max((maxX - minX) * paddingFactor, fullWidth * minSizeFraction);
  let height = Math.max((maxY - minY) * paddingFactor, fullHeight * minSizeFraction);

  // Fit-contain to the full map's aspect ratio so the SVG viewBox never
  // stretches the geometry.
  if (width / height > fullAspect) {
    height = width / fullAspect;
  } else {
    width = height * fullAspect;
  }

  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
    width,
    height,
  };
};

export const fullMapCameraRect = (fullBBox: BBox): CameraRect => {
  const [minX, minY, maxX, maxY] = fullBBox;
  return {x: minX, y: minY, width: maxX - minX, height: maxY - minY};
};

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const lerpCameraRect = (from: CameraRect, to: CameraRect, t: number): CameraRect => ({
  x: lerp(from.x, to.x, t),
  y: lerp(from.y, to.y, t),
  width: lerp(from.width, to.width, t),
  height: lerp(from.height, to.height, t),
});

export const cameraRectToViewBox = (rect: CameraRect): string =>
  `${rect.x.toFixed(2)} ${rect.y.toFixed(2)} ${rect.width.toFixed(2)} ${rect.height.toFixed(2)}`;
