import { afterEach, describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { removeProjectArchive } from "../services/projectArchive.js";

const projectsPath = path.join(import.meta.dirname, "..", "projects");
const slug = `vitest-remove-${process.pid}`;
const projectPath = path.join(projectsPath, slug);

const leftovers = () =>
  fs.readdirSync(projectsPath).filter((entry) => entry.includes(slug));

const createProject = () => {
  fs.mkdirSync(projectPath, { recursive: true });
  fs.writeFileSync(path.join(projectPath, "index.html"), "<h1>test</h1>");
};

afterEach(() => {
  for (const entry of leftovers()) {
    fs.rmSync(path.join(projectsPath, entry), { recursive: true, force: true });
  }
});

describe("removeProjectArchive", () => {
  it("hides the files right away and deletes them on commit", async () => {
    createProject();

    const removal = await removeProjectArchive(slug);
    expect(fs.existsSync(projectPath)).toBe(false);

    await removal.commit();
    expect(leftovers()).toEqual([]);
  });

  it("puts the files back on rollback", async () => {
    createProject();

    const removal = await removeProjectArchive(slug);
    await removal.rollback();

    expect(fs.readFileSync(path.join(projectPath, "index.html"), "utf8")).toBe(
      "<h1>test</h1>",
    );
    expect(leftovers()).toEqual([slug]);
  });

  it("is a no-op when the project has no files", async () => {
    fs.mkdirSync(projectsPath, { recursive: true });

    const removal = await removeProjectArchive(slug);
    await removal.commit();
    await removal.rollback();

    expect(leftovers()).toEqual([]);
  });
});
