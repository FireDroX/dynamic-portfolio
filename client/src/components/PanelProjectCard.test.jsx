import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import PanelProjectCard from "./PanelProjectCard";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { resolvedLanguage: "fr" },
  }),
}));

afterEach(cleanup);

const project = {
  name: "Demo",
  fileName: "demo",
  createdAt: "2024-01-01",
  published: true,
  previewUrl: "/api/projects/demo/",
  descriptionFr: "fr",
  descriptionEn: "en",
};

describe("PanelProjectCard preview", () => {
  it("sandboxes the preview iframe without allow-same-origin", () => {
    const { container } = render(
      <PanelProjectCard
        project={project}
        edited={{}}
        isPreviewOpen
        previewVersion={0}
        isSaving={false}
        onChange={vi.fn()}
        onProjectFile={vi.fn()}
        onTogglePreview={vi.fn()}
        onDelete={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    const sandbox = container.querySelector("iframe").getAttribute("sandbox");
    expect(sandbox).toContain("allow-scripts");
    expect(sandbox).not.toContain("allow-same-origin");
  });
});
