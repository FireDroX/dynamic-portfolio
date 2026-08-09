import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";

const normalizeLanguage = (language) =>
  language?.toLowerCase().startsWith("en") ? "en" : "fr";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    fallbackLng: "fr",
    supportedLngs: ["fr", "en"],
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "portfolio_language",
    },
    interpolation: {
      escapeValue: false,
    },
  });

const updateDocumentLanguage = (language) => {
  document.documentElement.lang = normalizeLanguage(language);
};

updateDocumentLanguage(i18n.resolvedLanguage);
i18n.on("languageChanged", updateDocumentLanguage);

export default i18n;
