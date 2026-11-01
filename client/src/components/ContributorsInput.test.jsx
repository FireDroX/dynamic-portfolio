import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import ContributorsInput from "./ContributorsInput";
import ContributorAvatars from "./ContributorAvatars";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => (options?.login ? `${key}:${options.login}` : key),
  }),
}));

afterEach(cleanup);

const Harness = ({ initial = [], onSubmit }) => {
  const [value, setValue] = useState(initial);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(new FormData(event.currentTarget));
      }}
    >
      <ContributorsInput name="contributors" value={value} onChange={setValue} />
    </form>
  );
};

const getInput = () => screen.getByLabelText("panel.contributorsLabel");
const hiddenValue = (container) =>
  JSON.parse(container.querySelector('input[name="contributors"]').value);

describe("ContributorsInput", () => {
  it("turns the typed login into a tag on Enter without submitting", () => {
    const onSubmit = vi.fn();
    const { container } = render(<Harness onSubmit={onSubmit} />);

    fireEvent.change(getInput(), { target: { value: "@FireDroX" } });
    fireEvent.keyDown(getInput(), { key: "Enter" });

    expect(screen.getByText("@FireDroX")).toBeTruthy();
    expect(getInput().value).toBe("");
    expect(hiddenValue(container)).toEqual(["FireDroX"]);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("splits pasted lists and ignores duplicates", () => {
    const { container } = render(<Harness initial={["FireDroX"]} />);

    fireEvent.change(getInput(), {
      target: { value: "@firedrox @Claude, octo-cat " },
    });

    expect(hiddenValue(container)).toEqual(["FireDroX", "Claude", "octo-cat"]);
  });

  it("keeps an invalid login in the field and flags it", () => {
    const { container } = render(<Harness />);

    fireEvent.change(getInput(), { target: { value: "-nope" } });
    fireEvent.keyDown(getInput(), { key: "Enter" });

    expect(hiddenValue(container)).toEqual([]);
    expect(getInput().value).toBe("-nope");
    expect(getInput().getAttribute("aria-invalid")).toBe("true");
  });

  it("removes tags with the × button and with Backspace", () => {
    const { container } = render(<Harness initial={["a", "b", "c"]} />);

    fireEvent.click(
      screen.getByRole("button", { name: "panel.removeContributor:b" }),
    );
    expect(hiddenValue(container)).toEqual(["a", "c"]);

    fireEvent.keyDown(getInput(), { key: "Backspace" });
    expect(hiddenValue(container)).toEqual(["a"]);
  });
});

describe("ContributorAvatars", () => {
  it("links each avatar to the GitHub profile in a new tab, first on top", () => {
    render(<ContributorAvatars contributors={["FireDroX", "Claude"]} />);

    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "https://github.com/FireDroX",
      "https://github.com/Claude",
    ]);
    expect(links[0].getAttribute("target")).toBe("_blank");
    expect(links[0].getAttribute("rel")).toContain("noopener");

    const [first, second] = screen.getAllByRole("listitem");
    expect(Number(first.style.zIndex)).toBeGreaterThan(
      Number(second.style.zIndex),
    );
  });

  it("renders nothing without contributors", () => {
    const { container } = render(<ContributorAvatars contributors={[]} />);
    expect(container.innerHTML).toBe("");
  });
});
