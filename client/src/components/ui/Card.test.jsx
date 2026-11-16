import { describe, it, expect, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Card from "./Card";

afterEach(cleanup);

describe("Card", () => {
  it("renders a div with the card class and children by default", () => {
    const { container } = render(<Card className="extra">body</Card>);
    const card = container.firstChild;
    expect(card.tagName).toBe("DIV");
    expect(card.className).toBe("card extra");
    expect(card.textContent).toBe("body");
  });

  it("renders a link when `to` is given", () => {
    render(
      <MemoryRouter>
        <Card to="/projects">go</Card>
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: "go" });
    expect(link.getAttribute("href")).toBe("/projects");
    expect(link.className).toBe("card");
  });

  it("forwards extra props", () => {
    const { container } = render(<Card data-x="1">x</Card>);
    expect(container.firstChild.getAttribute("data-x")).toBe("1");
  });
});
