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
  }, [description, image, noIndex, path, title]);

  return null;
};

export default Seo;
