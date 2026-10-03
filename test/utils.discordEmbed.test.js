import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  buildDiscordEmbed,
  serializeDiscordEmbed,
} = require("../utils/discordEmbed");

const base = {
  title: "Portfolio d’Adrien",
  description: "Desc",
  image: "https://x.fr/og-image",
  url: "https://x.fr",
  siteUrl: "https://x.fr",
};

describe("discord embed", () => {
  it("builds a container with image and the 3 default links", () => {
    const [container] = buildDiscordEmbed(base).components;
    expect(container.type).toBe(17);
    const row = container.components.find((c) => c.type === 1);
    expect(row.components.map((b) => b.url)).toEqual([
      "https://x.fr",
      "https://x.fr/projects",
      "https://x.fr/about",
    ]);
    expect(container.components.find((c) => c.type === 12).items[0].media.url).toBe(
      base.image,
    );
  });

  it("serializes without raw < or >", () => {
    const json = serializeDiscordEmbed(
      buildDiscordEmbed({ ...base, description: "</script><b>" }),
    );
    expect(json).not.toMatch(/[<>]/);
    expect(JSON.parse(json).components).toHaveLength(1);
  });
});
