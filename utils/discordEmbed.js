const ACCENT_COLOR = 0xb29a80;

const truncate = (value, max) => {
  const text = String(value || "").trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
};

const linkButton = (label, url) => ({ type: 2, style: 5, label, url });

// Discord "component embed" (Components V2) injected as a JSON <script> in the
// page head. Discord reads it when the site URL is pasted in a message.
function buildDiscordEmbed({ title, description, image, url, siteUrl, links }) {
  const buttons = links || [
    linkButton("🌐 Portfolio", siteUrl),
    linkButton("🚀 Projets", `${siteUrl}/projects`),
    linkButton("👤 À propos", `${siteUrl}/about`),
  ];

  return {
    component: {
      type: 17,
      accent_color: ACCENT_COLOR,
      components: [
        {
          type: 9,
          components: [
            {
              type: 10,
              content: `## [${truncate(title, 120).replace(/[[\]]/g, "")}](${url})\n${truncate(description, 300)}`,
            },
          ],
          accessory: { type: 11, media: { url: `${siteUrl}/icon.png` } },
        },
        { type: 12, items: [{ media: { url: image } }] },
        { type: 1, components: buttons },
        { type: 10, content: `-# ${siteUrl.replace(/^https?:\/\//, "")}` },
      ],
    },
  };
}

// JSON safe to embed inside a <script> tag (no "</script>" or HTML comments).
const serializeDiscordEmbed = (embed) =>
  JSON.stringify(embed)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

module.exports = { buildDiscordEmbed, serializeDiscordEmbed, linkButton };
