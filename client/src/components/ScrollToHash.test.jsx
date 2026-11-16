import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { MemoryRouter, Link } from "react-router";
import ScrollToHash from "./ScrollToHash";

const scrollIntoView = vi.fn();

beforeEach(() => {
  scrollIntoView.mockClear();
  Element.prototype.scrollIntoView = scrollIntoView;
  window.scrollTo = vi.fn();
});

afterEach(cleanup);

const renderAt = (entry) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <ScrollToHash />
      <Link to="/#contact">again</Link>
      <Link to="/about">about</Link>
      <div id="contact" />
    </MemoryRouter>,
  );

describe("ScrollToHash", () => {
  it("scrolls to the hash target", () => {
    renderAt("/#contact");
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("scrolls to the top when there is no hash", () => {
    renderAt("/about");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("scrolls again on a repeated navigation to the same hash", () => {
    const { getByText } = renderAt("/#contact");
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    fireEvent.click(getByText("again"));
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it("scrolls to the top when navigating to a page without hash", () => {
    const { getByText } = renderAt("/#contact");
    fireEvent.click(getByText("about"));
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("stays in place when only the query of the same page changes", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/projects"]}>
        <ScrollToHash />
        <Link to="/projects?page=2">page 2</Link>
        <Link to="/about">about</Link>
      </MemoryRouter>,
    );
    window.scrollTo.mockClear();

    fireEvent.click(getByText("page 2"));
    expect(window.scrollTo).not.toHaveBeenCalled();

    fireEvent.click(getByText("about"));
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
