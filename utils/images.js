const COMPLETE_PNG_END = "0000000049454e44ae426082";

function parseImageDataUrl(dataUrl) {
  if (typeof dataUrl !== "string") return null;

  const separator = dataUrl.indexOf(",");
  if (separator < 0) return null;

  const mimeMatch = dataUrl
    .slice(0, separator)
    .match(/^data:(image\/[a-zA-Z0-9.+-]+);base64$/);
  const encoded = dataUrl.slice(separator + 1);

  if (
    !mimeMatch ||
    !encoded ||
    encoded.length % 4 !== 0 ||
    !/^[a-zA-Z0-9+/]*={0,2}$/.test(encoded)
  ) {
    return null;
  }

  const buffer = Buffer.from(encoded, "base64");
  const mimeType = mimeMatch[1].toLowerCase();
  if (!isCompleteImage(buffer, mimeType)) return null;

  return { buffer, mimeType };
}

function isCompleteImage(buffer, mimeType) {
  if (!buffer.length) return false;

  if (mimeType === "image/png") {
    return (
      buffer.length >= 20 &&
      buffer.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" &&
      buffer.subarray(-12).toString("hex") === COMPLETE_PNG_END
    );
  }

  if (mimeType === "image/jpeg") {
    return (
      buffer.length >= 4 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[buffer.length - 2] === 0xff &&
      buffer[buffer.length - 1] === 0xd9
    );
  }

  if (mimeType === "image/gif") {
    return buffer.length >= 7 && buffer[buffer.length - 1] === 0x3b;
  }

  if (mimeType === "image/webp") {
    return (
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP" &&
      buffer.readUInt32LE(4) + 8 === buffer.length
    );
  }

  return true;
}

module.exports = { parseImageDataUrl };
