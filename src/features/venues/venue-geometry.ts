/**
 * Geometria canônica inicial dos salões.
 * Coordenadas e dimensões são sempre armazenadas em milímetros,
 * independentemente de qualquer mecanismo de renderização 2D ou 3D.
 */
export type PointMm = Readonly<{ x_mm: number; y_mm: number }>;
export type VenueBoundary = readonly PointMm[];

export function rectangleBoundary(widthMm: number, heightMm: number): VenueBoundary {
  if (!Number.isSafeInteger(widthMm) || !Number.isSafeInteger(heightMm) || widthMm <= 0 || heightMm <= 0) {
    throw new RangeError("As dimensões do salão devem ser inteiros positivos em milímetros.");
  }

  return [
    { x_mm: 0, y_mm: 0 },
    { x_mm: widthMm, y_mm: 0 },
    { x_mm: widthMm, y_mm: heightMm },
    { x_mm: 0, y_mm: heightMm },
  ];
}

export function metersToMillimeters(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError("A medida deve ser um número positivo em metros.");
  }
  const millimeters = Math.round(value * 1000);
  if (!Number.isSafeInteger(millimeters) || millimeters <= 0) {
    throw new RangeError("A medida excede o intervalo suportado.");
  }
  return millimeters;
}
