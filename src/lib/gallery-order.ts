/** Move one photo without mutating the saved or current gallery. */
export function moveGalleryPhoto(photos: string[], index: number, direction: -1 | 1): string[] {
  const target = index + direction;
  if (index < 0 || index >= photos.length || target < 0 || target >= photos.length) return photos;
  const next = [...photos];
  const photo = next[index];
  const neighbor = next[target];
  if (photo === undefined || neighbor === undefined) return photos;
  next[index] = neighbor;
  next[target] = photo;
  return next;
}