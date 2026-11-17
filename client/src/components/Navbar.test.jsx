import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import i18n from "../i18n";
import Navbar from "./Navbar";

beforeEach(async () => {
  window.matchMedia = () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
  await i18n.changeLanguage("fr");
});

afterEach(cleanup);

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );

describe("Navbar", () => {
  it("links to home, projects and about", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: "accueil" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "projets" }).getAttribute("href")).toBe("/projects");
    expect(screen.getByRole("link", { name: "à propos" }).getAttribute("href")).toBe("/about");
  });

  it("links contact to /#contact", () => {
    renderNavbar();
    expect(screen.getByRole("link", { name: "contact" }).getAttribute("href")).toBe("/#contact");
  });

  it("does not link to /achievements", () => {
    const { container } = renderNavbar();
    expect(container.querySelector('a[href="/achievements"]')).toBeNull();
  });

  it("switches language with the FR/EN button", () => {
    renderNavbar();
    fireEvent.click(screen.getByRole("button", { name: "Passer en anglais" }));
    expect(i18n.resolvedLanguage).toBe("en");
    expect(screen.getByRole("link", { name: "home" })).toBeTruthy();
  });
});
