export const CV_URLS = {
  fr: "https://url.addrien.fr/d/cv-alternance-fr-2027",
  en: "https://url.addrien.fr/d/cv-alternance-en-2027",
};

export const getCvUrl = (language) =>
  language?.toLowerCase().startsWith("en") ? CV_URLS.en : CV_URLS.fr;
