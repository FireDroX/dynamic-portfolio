import { useEffect } from "react";

const setMeta = (selector, attribute, value) => {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
};

const Seo = ({
  title,
  description,
  path,
  noIndex = false,
  image = "/preview.png",
}) => {
  useEffect(() => {
    const url = new URL(path || window.location.pathname, window.location.origin).href;
    const fullTitle = title;

    document.title = fullTitle;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="robots"]', "content", noIndex ? "noindex, nofollow" : "index, follow");
    setMeta('meta[name="googlebot"]', "content", noIndex ? "noindex, nofollow" : "index, follow");
    setMeta('link[rel="canonical"]', "href", url);

    const imageUrl = new URL(image, window.location.origin).href;
    setMeta('meta[property="og:image"]', "content", imageUrl);
    setMeta('meta[name="twitter:image"]', "content", imageUrl);

    const schema = document.head.querySelector('script[type="application/ld+json"]');
    if (schema) {
      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Adrien",
        url: window.location.origin,
        jobTitle: "Développeur Web",
        sameAs: [
          "https://addrien.fr",
          "https://portfolio.addrien.fr",
          "https://github.com/FireDroX",
          "https://www.linkedin.com/in/adrien-pourlier/",
        ],
      });
    }
  }, [description, image, noIndex, path, title]);

  return null;
};

export default Seo;
