import type { PointMm, SpatialRect } from "./venue-geometry";

export type RectHandle = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
export type BoundsMm = { left: number; top: number; right: number; bottom: number; width: number; height: number };

const rad = (degrees: number) => degrees * Math.PI / 180;
const rotate = (point: PointMm, center: PointMm, degrees: number): PointMm => {
  const angle = rad(degrees), cos = Math.cos(angle), sin = Math.sin(angle);
  const x = point.x_mm - center.x_mm, y = point.y_mm - center.y_mm;
  return { x_mm: center.x_mm + x * cos - y * sin, y_mm: center.y_mm + x * sin + y * cos };
};
const round = (value: number) => Math.round(value);

export function rectCenter(rect: SpatialRect): PointMm {
  return { x_mm: rect.x_mm + rect.width_mm / 2, y_mm: rect.y_mm + rect.height_mm / 2 };
}

export function rectCorners(rect: SpatialRect): PointMm[] {
  const center = rectCenter(rect);
  return [
    { x_mm: rect.x_mm, y_mm: rect.y_mm },
    { x_mm: rect.x_mm + rect.width_mm, y_mm: rect.y_mm },
    { x_mm: rect.x_mm + rect.width_mm, y_mm: rect.y_mm + rect.height_mm },
    { x_mm: rect.x_mm, y_mm: rect.y_mm + rect.height_mm },
  ].map(point => rotate(point, center, rect.rotation_deg));
}


export function isRotatedRectInsideVenue(rect: SpatialRect, widthMm: number, heightMm: number): boolean {
  const bounds = rectBounds(rect);
  return bounds.left >= 0 && bounds.top >= 0 && bounds.right <= widthMm && bounds.bottom <= heightMm;
}

export function rectHandlePoints(rect: SpatialRect): Record<RectHandle, PointMm> {
  const [nw, ne, se, sw] = rectCorners(rect);
  const midpoint = (a: PointMm, b: PointMm): PointMm => ({x_mm:(a.x_mm+b.x_mm)/2,y_mm:(a.y_mm+b.y_mm)/2});
  return { nw, n:midpoint(nw,ne), ne, e:midpoint(ne,se), se, s:midpoint(sw,se), sw, w:midpoint(nw,sw) };
}

export function rectRotationHandle(rect: SpatialRect, offset = 350): PointMm {
  const points = rectHandlePoints(rect);
  const top = points.n, center = rectCenter(rect);
  const dx = top.x_mm-center.x_mm, dy = top.y_mm-center.y_mm;
  const length = Math.hypot(dx,dy) || 1;
  return {x_mm:top.x_mm+dx/length*offset,y_mm:top.y_mm+dy/length*offset};
}

export function rectBounds(rect: SpatialRect): BoundsMm {
  const corners = rectCorners(rect);
  const xs = corners.map(point => point.x_mm), ys = corners.map(point => point.y_mm);
  const left = Math.min(...xs), right = Math.max(...xs), top = Math.min(...ys), bottom = Math.max(...ys);
  return { left, right, top, bottom, width: right - left, height: bottom - top };
}

function toLocal(point: PointMm, center: PointMm, degrees: number): PointMm {
  return rotate(point, center, -degrees);
}
function toWorld(local: PointMm, center: PointMm, degrees: number): PointMm {
  return rotate(local, center, degrees);
}

export function resizeRotatedRect(rect: SpatialRect, handle: RectHandle, delta: PointMm, minimum = 100): SpatialRect {
  const center = rectCenter(rect);
  const localCorners: Record<RectHandle, [PointMm, PointMm]> = {
    n: [{x_mm:rect.x_mm+rect.width_mm/2,y_mm:rect.y_mm},{x_mm:rect.x_mm+rect.width_mm/2,y_mm:rect.y_mm+rect.height_mm}],
    ne: [{x_mm:rect.x_mm+rect.width_mm,y_mm:rect.y_mm},{x_mm:rect.x_mm,y_mm:rect.y_mm+rect.height_mm}],
    e: [{x_mm:rect.x_mm+rect.width_mm,y_mm:rect.y_mm+rect.height_mm/2},{x_mm:rect.x_mm,y_mm:rect.y_mm+rect.height_mm/2}],
    se: [{x_mm:rect.x_mm+rect.width_mm,y_mm:rect.y_mm+rect.height_mm},{x_mm:rect.x_mm,y_mm:rect.y_mm}],
    s: [{x_mm:rect.x_mm+rect.width_mm/2,y_mm:rect.y_mm+rect.height_mm},{x_mm:rect.x_mm+rect.width_mm/2,y_mm:rect.y_mm}],
    sw: [{x_mm:rect.x_mm,y_mm:rect.y_mm+rect.height_mm},{x_mm:rect.x_mm+rect.width_mm,y_mm:rect.y_mm}],
    w: [{x_mm:rect.x_mm,y_mm:rect.y_mm+rect.height_mm/2},{x_mm:rect.x_mm+rect.width_mm,y_mm:rect.y_mm+rect.height_mm/2}],
    nw: [{x_mm:rect.x_mm,y_mm:rect.y_mm},{x_mm:rect.x_mm+rect.width_mm,y_mm:rect.y_mm+rect.height_mm}],
  };
  const [movingLocal, anchorLocal] = localCorners[handle];
  const movingWorld = toWorld(movingLocal, center, rect.rotation_deg);
  const anchorWorld = toWorld(anchorLocal, center, rect.rotation_deg);
  const movedWorld = { x_mm: movingWorld.x_mm + delta.x_mm, y_mm: movingWorld.y_mm + delta.y_mm };
  const movedLocal = toLocal(movedWorld, center, rect.rotation_deg);
  const anchor = toLocal(anchorWorld, center, rect.rotation_deg);
  const horizontal = handle.includes("e") || handle.includes("w");
  const vertical = handle.includes("n") || handle.includes("s");
  const left = horizontal ? Math.min(anchor.x_mm, movedLocal.x_mm) : rect.x_mm;
  const top = vertical ? Math.min(anchor.y_mm, movedLocal.y_mm) : rect.y_mm;
  const width = horizontal ? Math.max(minimum, Math.abs(movedLocal.x_mm - anchor.x_mm)) : rect.width_mm;
  const height = vertical ? Math.max(minimum, Math.abs(movedLocal.y_mm - anchor.y_mm)) : rect.height_mm;
  const worldTopLeft = toWorld({ x_mm:left, y_mm:top }, center, rect.rotation_deg);
  return { ...rect, x_mm:round(worldTopLeft.x_mm), y_mm:round(worldTopLeft.y_mm), width_mm:round(width), height_mm:round(height) };
}

export function rotatedRectAt(rect: SpatialRect, pointer: PointMm, initialPointer: PointMm, initialRotation: number): SpatialRect {
  const center = rectCenter(rect);
  const before = Math.atan2(initialPointer.y_mm-center.y_mm, initialPointer.x_mm-center.x_mm);
  const after = Math.atan2(pointer.y_mm-center.y_mm, pointer.x_mm-center.x_mm);
  const rotation = ((Math.round(initialRotation + (after-before)*180/Math.PI) % 360) + 360) % 360;
  return { ...rect, rotation_deg: rotation };
}

export function alignBounds(bounds: BoundsMm[], axis: "left"|"center-x"|"right"|"top"|"center-y"|"bottom"): number[] {
  if (bounds.length < 2) return bounds.map(() => 0);
  const target = axis === "left" ? Math.min(...bounds.map(b=>b.left))
    : axis === "right" ? Math.max(...bounds.map(b=>b.right))
    : axis === "top" ? Math.min(...bounds.map(b=>b.top))
    : axis === "bottom" ? Math.max(...bounds.map(b=>b.bottom))
    : axis === "center-x" ? bounds.reduce((sum,b)=>sum+(b.left+b.right)/2,0)/bounds.length
    : bounds.reduce((sum,b)=>sum+(b.top+b.bottom)/2,0)/bounds.length;
  return bounds.map(b => round(axis === "left" ? target-b.left : axis === "right" ? target-b.right : axis === "top" ? target-b.top : axis === "bottom" ? target-b.bottom : axis === "center-x" ? target-(b.left+b.right)/2 : target-(b.top+b.bottom)/2));
}

export function distributeBounds(bounds: BoundsMm[], axis: "horizontal"|"vertical"): number[] {
  if (bounds.length < 3) throw new RangeError("Distribuir exige pelo menos três elementos.");
  const sorted = bounds.map((b,index)=>({b,index,start:axis==="horizontal"?b.left:b.top,size:axis==="horizontal"?b.width:b.height})).sort((a,b)=>a.start-b.start);
  const first=sorted[0], last=sorted[sorted.length-1];
  const total=sorted.reduce((sum,item)=>sum+item.size,0);
  const gap=((last.start+last.size)-first.start-total)/(sorted.length-1);
  const deltas=Array(bounds.length).fill(0) as number[];
  let cursor=first.start;
  for(const item of sorted){deltas[item.index]=round(cursor-item.start);cursor+=item.size+gap;}
  return deltas;
}
