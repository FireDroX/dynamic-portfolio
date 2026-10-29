import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import usePanelProjects from "./usePanelProjects";

// Stable t: fetchProjects depends on it, a new function per render would loop.
const t = (key) => key;
vi.mock("react-i18next", () => ({ useTranslation: () => ({ t }) }));

const PROJECT = { name: "Twin", fileName: "probe_one", descriptionFr: "fr" };

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

let routes;

beforeEach(() => {
  routes = { "/api/panel": () => json(200, [PROJECT]) };
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url, options) => routes[url](options)),
  );
  vi.spyOn(window, "confirm").mockReturnValue(true);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const renderPanel = async () => {
  const onLogout = vi.fn();
  const hook = renderHook(() => usePanelProjects(onLogout));
  await waitFor(() => expect(fetch).toHaveBeenCalledWith(
    "/api/panel",
    expect.anything(),
  ));
  return { ...hook, onLogout };
};

describe("usePanelProjects", () => {
  it("logs out when the project list answers 401", async () => {
    routes["/api/panel"] = () => json(401, { error: "Session expirée" });
    const { onLogout } = await renderPanel();

    await waitFor(() => expect(onLogout).toHaveBeenCalled());
  });

  it("deletes by fileName, not by display name", async () => {
    routes["/api/panel/delete"] = () => json(200, { success: true });
    const { result } = await renderPanel();

    await act(() => result.current.deleteProject(PROJECT));

    const [, options] = fetch.mock.calls.find(
      ([url]) => url === "/api/panel/delete",
    );
    expect(JSON.parse(options.body)).toEqual({ fileName: "probe_one" });
  });

  it("logs out when a delete answers 401", async () => {
    routes["/api/panel/delete"] = () => json(401, { error: "Session expirée" });
    const { result, onLogout } = await renderPanel();

    await act(() => result.current.deleteProject(PROJECT));

    expect(onLogout).toHaveBeenCalled();
  });

  it("logs out when a save answers 401", async () => {
    routes["/api/panel/modify"] = () => json(401, { error: "Session expirée" });
    const { result, onLogout } = await renderPanel();

    act(() => result.current.changeProject("probe_one", "name", "New"));
    await act(() => result.current.saveProject(PROJECT));

    expect(onLogout).toHaveBeenCalled();
  });

  it("shows the server's message when adding fails", async () => {
    routes["/api/panel/add"] = () =>
      json(409, { error: "Un projet utilisant ce nom de fichier existe déjà." });
    const { result } = await renderPanel();

    let added;
    await act(async () => {
      added = await result.current.addProject(new FormData());
    });

    expect(added).toBe(false);
    expect(result.current.notice).toEqual({
      type: "error",
      text: "Un projet utilisant ce nom de fichier existe déjà.",
    });
  });

  it("falls back to the generic message on a non-JSON error", async () => {
    routes["/api/panel/add"] = () => new Response("Bad gateway", { status: 502 });
    const { result } = await renderPanel();

    await act(() => result.current.addProject(new FormData()));

    expect(result.current.notice).toEqual({
      type: "error",
      text: "panel.addError",
    });
  });
});
