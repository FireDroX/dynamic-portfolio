import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Button from "./Button";

afterEach(cleanup);

const renderButton = (props) =>
  render(
    <MemoryRouter>
      <Button {...props}>label</Button>
    </MemoryRouter>,
  );

describe("Button", () => {
  it("renders a router link with `to`", () => {
    renderButton({ to: "/projects" });
    const link = screen.getByRole("link", { name: "label" });
    expect(link.getAttribute("href")).toBe("/projects");
    expect(link.className).toContain("btn--primary");
  });

  it("opens an external anchor safely", () => {
    renderButton({ href: "https://example.com", external: true });
    const link = screen.getByRole("link", { name: "label" });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders a plain anchor without target when not external", () => {
    renderButton({ href: "mailto:a@b.c" });
    const link = screen.getByRole("link", { name: "label" });
    expect(link.getAttribute("target")).toBeNull();
  });

  it("renders a button with the secondary variant", () => {
    renderButton({ variant: "secondary" });
    const button = screen.getByRole("button", { name: "label" });
    expect(button.getAttribute("type")).toBe("button");
    expect(button.className).toContain("btn--secondary");
  });
});
