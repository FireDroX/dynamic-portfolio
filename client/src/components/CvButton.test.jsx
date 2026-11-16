import { describe, it, expect, afterEach } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import CvButton from "./CvButton";
import { CV_URLS } from "../utils/cv";

afterEach(cleanup);

const renderButton = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <CvButton />
    </I18nextProvider>,
  );

describe("CvButton", () => {
  it("links to the French CV when the site is in French", async () => {
    await act(() => i18n.changeLanguage("fr"));
    renderButton();
    expect(screen.getByRole("link").getAttribute("href")).toBe(CV_URLS.fr);
  });

  it("links to the English CV when the site is in English", async () => {
    await act(() => i18n.changeLanguage("en"));
    renderButton();
    expect(screen.getByRole("link").getAttribute("href")).toBe(CV_URLS.en);
  });

  it("opens in a new tab safely", async () => {
    await act(() => i18n.changeLanguage("fr"));
    renderButton();
    const link = screen.getByRole("link");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });
});
