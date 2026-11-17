import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { MemoryRouter, Link, useNavigate } from "react-router";
import ScrollToHash from "./ScrollToHash";

const scrollIntoView = vi.fn();

beforeEach(() => {
  scrollIntoView.mockClear();
  Element.prototype.scrollIntoView = scrollIntoView;
  window.scrollTo = vi.fn();
});

afterEach(cleanup);

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate(-1)}>
      back
    </button>
  );
};

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

  it("leaves the scroll alone on the first load (browser restoration)", () => {
    renderAt("/about");
    expect(window.scrollTo).not.toHaveBeenCalled();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it("leaves the scroll alone on back and forward navigations", () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={["/projects"]}>
        <ScrollToHash />
        <Link to="/about">about</Link>
        <BackButton />
      </MemoryRouter>,
    );
    fireEvent.click(getByText("about"));
    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    fireEvent.click(getByText("back"));
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });

  it("does not crash on a malformed hash", () => {
    expect(() => renderAt("/#100%")).not.toThrow();
    cleanup();
    expect(() => renderAt("/#%E0%A4%A")).not.toThrow();
  });

  it("decodes an encoded hash", () => {
    render(
      <MemoryRouter initialEntries={["/#caf%C3%A9"]}>
        <ScrollToHash />
        <div id="café" />
      </MemoryRouter>,
    );
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
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
