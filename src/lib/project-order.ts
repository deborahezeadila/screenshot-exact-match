export function reorderProjects<T>(projects: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (index < 0 || index >= projects.length || target < 0 || target >= projects.length) return projects;
  const next = [...projects];
  const [project] = next.splice(index, 1);
  if (project === undefined) return projects;
  next.splice(target, 0, project);
  return next;
}

export function withProjectPositions<T>(projects: T[]): (T & { sort_order: number })[] {
  return projects.map((project, sort_order) => ({ ...project, sort_order }));
}