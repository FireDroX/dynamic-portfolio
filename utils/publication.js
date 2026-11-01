// Parses the `published` field sent by the panel forms.
// Returns 1/0 for the database, undefined when the field is absent and null
// when it is present but invalid.
function parsePublished(value) {
  if (value === undefined) return undefined;

  const normalized = String(value).trim().toLowerCase();
  if (normalized === "1" || normalized === "true") return 1;
  if (normalized === "0" || normalized === "false") return 0;
  return null;
}

module.exports = { parsePublished };
