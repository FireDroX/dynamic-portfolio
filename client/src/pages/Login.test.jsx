import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "./Login";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const submit = (password = "secret") => {
  fireEvent.change(screen.getByLabelText("login.password"), {
    target: { value: password },
  });
  fireEvent.click(screen.getByRole("button", { name: "login.submit" }));
};

describe("Login", () => {
  it("shows an error and fires the wrong-password event on a bad password", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    const onWrong = vi.fn();
    window.addEventListener("portfolio:wrong-password", onWrong);
    render(<Login onLogin={vi.fn()} />);

    submit();

    expect((await screen.findByRole("alert")).textContent).toBe(
      "login.wrongPassword",
    );
    expect(onWrong).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText("login.password").getAttribute("aria-invalid")).toBe("true");
    window.removeEventListener("portfolio:wrong-password", onWrong);
  });

  it("calls onLogin when the server accepts the password", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true }));
    const onLogin = vi.fn();
    render(<Login onLogin={onLogin} />);

    submit();

    await waitFor(() => expect(onLogin).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("shows the server error when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    render(<Login onLogin={vi.fn()} />);

    submit();

    expect((await screen.findByRole("alert")).textContent).toBe(
      "login.serverError",
    );
  });
});
