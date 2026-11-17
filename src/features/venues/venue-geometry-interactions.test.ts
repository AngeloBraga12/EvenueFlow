import { describe, expect, it } from "vitest";
import { alignBounds, distributeBounds, rectBounds, rectCorners, resizeRotatedRect, rotatedRectAt } from "./venue-geometry-interactions";
import { makeSpatialRect } from "./venue-geometry";

describe("venue geometry interactions", () => {
  it("keeps a rotated rectangle's center stable while rotating", () => {
    const rect = makeSpatialRect(1000, 1000, 2000, 1000, 0);
    const next = rotatedRectAt(rect, {x_mm:2000,y_mm:500}, {x_mm:2000,y_mm:500}, 0);
    expect(next.rotation_deg).toBe(0);
    const rotated = rotatedRectAt(rect, {x_mm:1500,y_mm:2500}, {x_mm:2000,y_mm:500}, 0);
    expect(rotated.rotation_deg).toBeGreaterThanOrEqual(0);
    expect(rotated.rotation_deg).toBeLessThan(360);
    expect(rectBounds(rotated).width).toBeGreaterThan(1000);
  });

  it("resizes from an east handle and preserves the opposite edge", () => {
    const rect = makeSpatialRect(1000, 1000, 2000, 1000);
    const resized = resizeRotatedRect(rect, "e", {x_mm:500,y_mm:0});
    expect(resized.width_mm).toBe(2500);
    expect(resized.x_mm).toBe(1000);
    expect(resized.height_mm).toBe(1000);
  });

  it("resizes rotated geometry in its local coordinate system", () => {
    const rect = makeSpatialRect(1000, 1000, 2000, 1000, 45);
    const resized = resizeRotatedRect(rect, "se", {x_mm:500,y_mm:500});
    expect(resized.width_mm).toBeGreaterThan(2000);
    expect(resized.height_mm).toBeGreaterThan(1000);
    expect(rectCorners(resized)).toHaveLength(4);
  });

  it("aligns bounding boxes on a shared vertical edge", () => {
    const deltas = alignBounds([
      {left:100,top:0,right:300,bottom:100,width:200,height:100},
      {left:500,top:20,right:700,bottom:120,width:200,height:100},
    ], "left");
    expect(deltas).toEqual([0,-400]);
  });

  it("distributes objects with equal gaps and stable outer bounds", () => {
    const deltas = distributeBounds([
      {left:0,top:0,right:100,bottom:100,width:100,height:100},
      {left:250,top:0,right:350,bottom:100,width:100,height:100},
      {left:700,top:0,right:800,bottom:100,width:100,height:100},
    ], "horizontal");
    expect(deltas).toEqual([0,100,0]);
  });

  it("requires three objects to distribute", () => {
    expect(() => distributeBounds([], "horizontal")).toThrow(RangeError);
  });
});
