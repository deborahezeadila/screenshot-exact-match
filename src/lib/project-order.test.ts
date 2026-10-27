import { describe, expect, it } from "vitest";
import { reorderProjects, withProjectPositions } from "./project-order";

describe("portfolio project display order", () => {
  const projects = [{ id: "a", sort_order: 0 }, { id: "b", sort_order: 0 }, { id: "c", sort_order: 9 }];
  it("moves projects up and down without mutating the original list", () => {
    expect(reorderProjects(projects, 2, -1).map(p => p.id)).toEqual(["a", "c", "b"]);
    expect(reorderProjects(projects, 0, 1).map(p => p.id)).toEqual(["b", "a", "c"]);
    expect(projects.map(p => p.id)).toEqual(["a", "b", "c"]);
  });
  it("saves unique ascending positions matching the chosen display order", () => {
    expect(withProjectPositions(reorderProjects(projects, 2, -1))).toEqual([
      { id: "a", sort_order: 0 }, { id: "c", sort_order: 1 }, { id: "b", sort_order: 2 },
    ]);
  });
  it("keeps boundary projects in place", () => {
    expect(reorderProjects(projects, 0, -1)).toEqual(projects);
    expect(reorderProjects(projects, 2, 1)).toEqual(projects);
  });
});