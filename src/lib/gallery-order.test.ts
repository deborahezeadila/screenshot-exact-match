import { describe, expect, it } from "vitest";
import { moveGalleryPhoto } from "./gallery-order";

describe("portfolio gallery order", () => {
  const photos = ["first.jpg", "second.jpg", "third.jpg"];
  it("moves a photo earlier while preserving all photos", () => {
    expect(moveGalleryPhoto(photos, 2, -1)).toEqual(["first.jpg", "third.jpg", "second.jpg"]);
  });
  it("moves a photo later without changing the original gallery", () => {
    expect(moveGalleryPhoto(photos, 0, 1)).toEqual(["second.jpg", "first.jpg", "third.jpg"]);
    expect(photos).toEqual(["first.jpg", "second.jpg", "third.jpg"]);
  });
  it("keeps the first and last photos within the gallery", () => {
    expect(moveGalleryPhoto(photos, 0, -1)).toEqual(photos);
    expect(moveGalleryPhoto(photos, 2, 1)).toEqual(photos);
  });
});