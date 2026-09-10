import { useEffect } from "react";

const SITE_URL = "https://www.tripowersllc.com";
const DEFAULT_IMAGE = `${SITE_URL}/logo.jpg`;

function setMeta(selector, attributes) {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

const Seo = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  imageAlt = "TriPowers LLC",
  type = "website",
  robots = "index,follow",
  structuredData,
}) => {
  useEffect(() => {
    const canonicalUrl = new URL(path, SITE_URL).toString();
    const fullTitle = title.includes("TriPowers")
      ? title
      : `${title} | TriPowers LLC`;

    document.title = fullTitle;
    setMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    setMeta('meta[name="robots"]', { name: "robots", content: robots });
    setMeta('meta[property="og:type"]', { property: "og:type", content: type });
    setMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "TriPowers LLC",
    });
    setMeta('meta[property="og:title"]', {
      property: "og:title",
      content: fullTitle,
    });
    setMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    setMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    setMeta('meta[property="og:image"]', {
      property: "og:image",
      content: image,
    });
    setMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: imageAlt,
    });
    setMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    setMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: fullTitle,
    });
    setMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    setMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: image,
    });
    setMeta('meta[name="twitter:image:alt"]', {
      name: "twitter:image:alt",
      content: imageAlt,
    });

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const schemaId = "page-structured-data";
    document.getElementById(schemaId)?.remove();
    if (structuredData) {
      const script = document.createElement("script");
      script.id = schemaId;
      script.type = "application/ld+json";
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => document.getElementById(schemaId)?.remove();
  }, [description, image, imageAlt, path, robots, structuredData, title, type]);

  return null;
};

export default Seo;
