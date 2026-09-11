import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_IMAGE,
  formatSeoTitle,
  PUBLIC_ROUTE_METADATA,
  SITE_URL,
} from "../src/seo/routeMetadata.mjs";

const projectDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(projectDirectory, "dist");
const template = await readFile(path.join(outputDirectory, "index.html"), "utf8");

function escapeAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function replaceMeta(html, attribute, key, content) {
  const tag = `<meta ${attribute}="${key}" content="${escapeAttribute(content)}" />`;
  const expression = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, "i");
  return expression.test(html) ? html.replace(expression, tag) : html.replace("</head>", `  ${tag}\n</head>`);
}

function renderRouteHtml(metadata) {
  const title = formatSeoTitle(metadata.title);
  const canonicalUrl = new URL(metadata.path, SITE_URL).toString();
  const image = metadata.image ?? DEFAULT_IMAGE;
  const imageAlt = metadata.imageAlt ?? "TriPowers LLC";
  const type = metadata.type ?? "website";
  let html = template.replace(/<title>.*?<\/title>/is, `<title>${escapeAttribute(title)}</title>`);

  html = replaceMeta(html, "name", "description", metadata.description);
  html = replaceMeta(html, "name", "robots", "index,follow");
  html = replaceMeta(html, "property", "og:type", type);
  html = replaceMeta(html, "property", "og:site_name", "TriPowers LLC");
  html = replaceMeta(html, "property", "og:title", title);
  html = replaceMeta(html, "property", "og:description", metadata.description);
  html = replaceMeta(html, "property", "og:url", canonicalUrl);
  html = replaceMeta(html, "property", "og:image", image);
  html = replaceMeta(html, "property", "og:image:alt", imageAlt);
  html = replaceMeta(html, "name", "twitter:card", "summary_large_image");
  html = replaceMeta(html, "name", "twitter:title", title);
  html = replaceMeta(html, "name", "twitter:description", metadata.description);
  html = replaceMeta(html, "name", "twitter:image", image);
  html = replaceMeta(html, "name", "twitter:image:alt", imageAlt);

  const canonicalTag = `<link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />`;
  const canonicalExpression = /<link\s+rel=["']canonical["'][^>]*>/i;
  return canonicalExpression.test(html)
    ? html.replace(canonicalExpression, canonicalTag)
    : html.replace("</head>", `  ${canonicalTag}\n</head>`);
}

for (const [route, metadata] of Object.entries(PUBLIC_ROUTE_METADATA)) {
  const outputPath = route === "/"
    ? path.join(outputDirectory, "index.html")
    : path.join(outputDirectory, `${route.slice(1)}.html`);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, renderRouteHtml(metadata), "utf8");
}

console.log(`Generated initial metadata for ${Object.keys(PUBLIC_ROUTE_METADATA).length} public routes.`);
