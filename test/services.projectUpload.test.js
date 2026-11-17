import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { Readable } from "node:stream";
import {
  MAX_FIELDS,
  PROJECT_FIELDS,
  parseProjectUpload,
} from "../services/projectUpload.js";

const BOUNDARY = "----portfolio-test";

const multipartRequest = (fields) => {
  const body =
    Object.entries(fields)
      .map(
        ([name, value]) =>
          `--${BOUNDARY}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
      )
      .join("") + `--${BOUNDARY}--\r\n`;

  const req = Readable.from([Buffer.from(body)]);
  req.headers = { "content-type": `multipart/form-data; boundary=${BOUNDARY}` };
  return req;
};

const allFields = Object.fromEntries(
  PROJECT_FIELDS.map((name) => [name, `value-${name}`]),
);

describe("parseProjectUpload", () => {
  it("keeps a margin above the fields the panel sends", () => {
    expect(MAX_FIELDS).toBeGreaterThan(PROJECT_FIELDS.length);
  });

  it("accepts every project field with room for more", async () => {
    const { fields } = await parseProjectUpload(
      multipartRequest({ ...allFields, extra1: "x", extra2: "y" }),
    );
    expect(fields).toEqual(allFields);
  });

  it("ignores fields it does not know", async () => {
    const { fields } = await parseProjectUpload(
      multipartRequest({ name: "Demo", __proto__field: "x", admin: "1" }),
    );
    expect(fields).toEqual({ name: "Demo" });
  });

  it("rejects a form with far too many fields", async () => {
    const many = Object.fromEntries(
      Array.from({ length: MAX_FIELDS + 1 }, (_, i) => [`f${i}`, "x"]),
    );
    await expect(parseProjectUpload(multipartRequest(many))).rejects.toThrow(
      "Trop de champs",
    );
  });
});

// The panel builds the modify request by hand: every text field it appends
// must be one the server reads, or it would be silently ignored.
describe("panel client fields", () => {
  it("only sends fields listed in PROJECT_FIELDS", () => {
    const source = readFileSync(
      new URL("../client/src/hooks/usePanelProjects.js", import.meta.url),
      "utf8",
    );
    const sent = [...source.matchAll(/formData\.append\(\s*"([^"]+)"/g)]
      .map((match) => match[1])
      .filter((name) => name !== "image" && name !== "zip");

    expect(sent.length).toBeGreaterThan(0);
    for (const name of sent) expect(PROJECT_FIELDS).toContain(name);
  });
});
