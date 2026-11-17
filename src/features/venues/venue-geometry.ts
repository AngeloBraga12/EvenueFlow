import type { Json } from "../../../supabase/database.types";

export type PointMm = { x_mm: number; y_mm: number };
export type SpatialRect = {
  schema_version: 1;
  kind: "rectangle";
  x_mm: number;
  y_mm: number;
  width_mm: number;
  height_mm: number;
  rotation_deg: number;
};

export function metersToMillimeters(value: number): number {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError("A medida deve ser positiva.");
  const result = Math.round(value * 1000);
  if (!Number.isSafeInteger(result) || result <= 0) throw new RangeError("Medida fora do intervalo permitido.");
  return result;
}

export function rectangleBoundary(widthMm: number, heightMm: number): PointMm[] {
  if (!Number.isSafeInteger(widthMm) || !Number.isSafeInteger(heightMm) || widthMm <= 0 || heightMm <= 0) {
    throw new RangeError("Dimensões inválidas.");
  }
  return [
    { x_mm: 0, y_mm: 0 },
    { x_mm: widthMm, y_mm: 0 },
    { x_mm: widthMm, y_mm: heightMm },
    { x_mm: 0, y_mm: heightMm },
  ];
}

export function makeSpatialRect(x: number, y: number, width: number, height: number, rotation = 0): SpatialRect {
  const values = [x, y, width, height, rotation];
  if (!values.every(Number.isFinite) || ![x, y, width, height].every(Number.isSafeInteger) || width <= 0 || height <= 0 || rotation < 0 || rotation >= 360) {
    throw new RangeError("Geometria retangular inválida.");
  }
  return { schema_version: 1, kind: "rectangle", x_mm: x, y_mm: y, width_mm: width, height_mm: height, rotation_deg: rotation };
}

export function parseSpatialRect(value: Json): SpatialRect | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as Record<string, Json | undefined>;
  if (candidate.schema_version !== 1 || candidate.kind !== "rectangle") return null;
  const fields = ["x_mm", "y_mm", "width_mm", "height_mm", "rotation_deg"] as const;
  if (!fields.every(key => typeof candidate[key] === "number" && Number.isFinite(candidate[key]))) return null;
  const { x_mm, y_mm, width_mm, height_mm, rotation_deg } = candidate;
  if (!Number.isSafeInteger(x_mm) || !Number.isSafeInteger(y_mm) || !Number.isSafeInteger(width_mm) || !Number.isSafeInteger(height_mm) || (width_mm as number) <= 0 || (height_mm as number) <= 0 || (rotation_deg as number) < 0 || (rotation_deg as number) >= 360) return null;
  return {
    schema_version: 1,
    kind: "rectangle",
    x_mm: x_mm as number,
    y_mm: y_mm as number,
    width_mm: width_mm as number,
    height_mm: height_mm as number,
    rotation_deg: rotation_deg as number,
  };
}

export function isPointInsideVenue(point: PointMm, widthMm: number, heightMm: number): boolean {
  return point.x_mm >= 0 && point.y_mm >= 0 && point.x_mm <= widthMm && point.y_mm <= heightMm;
}

export function isRectInsideVenue(rect: SpatialRect, widthMm: number, heightMm: number): boolean {
  if (rect.rotation_deg !== 0) return false;
  return rect.x_mm >= 0 && rect.y_mm >= 0 && rect.x_mm + rect.width_mm <= widthMm && rect.y_mm + rect.height_mm <= heightMm;
}
