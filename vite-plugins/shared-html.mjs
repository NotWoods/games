import { insertHtml, h } from "vite-plugin-insert-html";

/**
 * @returns {import('vite').Plugin}
 */
export const sharedHtml = () =>
  insertHtml({
    head: [
      h("script", {
        src: "https://fortunate-twentyseven.tigeroakes.com/script.js",
        "data-site": "FMVLGCSF",
        "data-honor-dnt": "true",
        defer: true,
      }),
    ],
  });
