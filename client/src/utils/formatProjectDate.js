// Shared date formatting for project cards, the home terminal and the detail
// page. Returns null for a missing or invalid date so each caller picks its
// own fallback (a placeholder text, or nothing at all).
export const getDateLocale = (language) =>
  language === "en" ? "en-GB" : "fr-FR";

const formatProjectDate = (value, language, { month = "short" } = {}) => {
  const date = new Date(value);
  if (value == null || Number.isNaN(date.getTime())) return null;

  return (
    new Intl.DateTimeFormat(getDateLocale(language), {
      day: "2-digit",
      month,
      year: "numeric",
    })
      .format(date)
      // "janv. 2025" -> "janv 2025": short French months end with a dot.
      .replace(".", "")
  );
};

export default formatProjectDate;
