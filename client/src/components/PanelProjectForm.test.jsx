import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import PanelProjectForm from "./PanelProjectForm";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

afterEach(cleanup);

const renderForm = (onSubmit) =>
  render(
    <MemoryRouter>
      <PanelProjectForm isSaving={false} onSubmit={onSubmit} />
    </MemoryRouter>,
  );

const submitForm = () =>
  fireEvent.submit(screen.getByRole("button", { name: "panel.publish" }).closest("form"));

describe("PanelProjectForm upload status", () => {
  it("shows loading, then success when onSubmit resolves true", async () => {
    let resolve;
    renderForm(() => new Promise((done) => (resolve = done)));

    submitForm();

    const button = await screen.findByRole("button", { name: "panel.publishing" });
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(document.querySelector(".panel-form-status").textContent).toBe("panel.uploadLoading");

    await act(async () => resolve(true));
    expect(document.querySelector(".panel-form-status").textContent).toBe("panel.uploadSuccess");
    expect(screen.getByRole("button", { name: "panel.publish" }).disabled).toBe(false);
  });

  it("shows an error when onSubmit resolves false", async () => {
    renderForm(() => Promise.resolve(false));

    submitForm();

    expect((await screen.findByText("panel.uploadError")).className).toContain(
      "panel-form-status--error",
    );
  });
});
