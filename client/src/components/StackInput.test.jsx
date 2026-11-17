import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import StackInput from "./StackInput";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => (options?.tech ? `${key}:${options.tech}` : key),
  }),
}));

afterEach(cleanup);

const Harness = ({ initial = [] }) => {
  const [value, setValue] = useState(initial);
  return <StackInput name="stack" value={value} onChange={setValue} />;
};

const getInput = () => screen.getByLabelText("panel.stackLabel");
const hidden = (container) =>
  JSON.parse(container.querySelector('input[name="stack"]').value);
const type = (text, key = "Enter") => {
  fireEvent.change(getInput(), { target: { value: text } });
  fireEvent.keyDown(getInput(), { key });
};

describe("StackInput", () => {
  it("adds a technology on Enter or comma, keeping spaces", () => {
    const { container } = render(<Harness />);
    type("VS Code");
    type("React", ",");
    expect(hidden(container)).toEqual(["VS Code", "React"]);
  });

  it("does not commit on space", () => {
    const { container } = render(<Harness />);
    type("VS", " ");
    expect(hidden(container)).toEqual([]);
  });

  it("splits pasted lists on commas", () => {
    const { container } = render(<Harness />);
    fireEvent.change(getInput(), { target: { value: "React, Node.js, Git" } });
    fireEvent.blur(getInput());
    expect(hidden(container)).toEqual(["React", "Node.js", "Git"]);
  });

  it("ignores case-insensitive duplicates", () => {
    const { container } = render(<Harness initial={["React"]} />);
    type("react");
    expect(hidden(container)).toEqual(["React"]);
  });

  it("rejects invalid names with a message", () => {
    const { container } = render(<Harness />);
    type("<script>");
    expect(hidden(container)).toEqual([]);
    expect(screen.getByRole("status").textContent).toBe(
      "panel.stackInvalid:<script>",
    );
  });

  it("stops at the limit", () => {
    const initial = Array.from({ length: 12 }, (_, i) => `Tech${i}`);
    const { container } = render(<Harness initial={initial} />);
    type("Extra");
    expect(hidden(container)).toHaveLength(12);
    expect(screen.getByRole("status").textContent).toBe("panel.stackLimit");
  });

  it("suggests catalog entries that are not chosen yet", () => {
    const { container } = render(<Harness initial={["React"]} />);
    const values = [...container.querySelectorAll("datalist option")].map(
      (option) => option.getAttribute("value"),
    );
    expect(values).toContain("NestJS");
    expect(values).not.toContain("React");
    expect(getInput().getAttribute("list")).toBe(
      container.querySelector("datalist").id,
    );
  });

  it("removes a tag", () => {
    const { container } = render(<Harness initial={["React", "Git"]} />);
    fireEvent.click(screen.getByLabelText("panel.removeTech:React"));
    expect(hidden(container)).toEqual(["Git"]);
  });
});
