import { parse } from 'node-html-parser';

/**
 * @param {unknown} value
 * @returns {value is object}
 */
function isObject(value) {
  return typeof value === 'object' && value !== null;
}

/**
 * @param {object} options
 * @param {string} options.title
 * @param {string} [options.type]
 * @param {string} [options.url]
 * @param {string} options.description
 * @param {string | {url:string,type?:string,width?:number,height?:number,alt?:string}} options.image
 * @param {string} [options.twitterSite]
 * @returns {import('vite').Plugin}
 */
export function socialMetadata(options) {
  const imageUrl =
    typeof options.image === 'string' ? options.image : options.image.url;

  return {
    name: 'social-metadata',
    transformIndexHtml(html, context) {
      let url = options.url;
      if (!url) {
        const document = parse(html);
        const canonicalUrl = document
          .querySelector('head > link[rel="canonical"]')
          ?.getAttribute('href');

        if (!canonicalUrl) {
          throw new Error(`Could not find canonical URL in ${context.path}`);
        }
        url = canonicalUrl;
      }

      /** @type {import('vite').HtmlTagDescriptor[]} */
      const regularTags = [
        {
          tag: 'meta',
          attrs: { name: 'description', content: options.description },
        },
      ];

      /** @type {import('vite').HtmlTagDescriptor[]} */
      const openGraphTags = [
        {
          tag: 'meta',
          attrs: { property: 'og:title', content: options.title },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:description', content: options.description },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:type', content: options.type ?? 'website' },
        },
        { tag: 'meta', attrs: { property: 'og:url', content: url } },
        { tag: 'meta', attrs: { property: 'og:image', content: imageUrl } },
      ];
      if (typeof options.image === 'object') {
        openGraphTags.concat(
          [
            options.image.type && {
              tag: 'meta',
              attrs: { property: 'og:image:type', content: options.image.type },
            },
            options.image.width && {
              tag: 'meta',
              attrs: {
                property: 'og:image:width',
                content: options.image.width.toString(),
              },
            },
            options.image.height && {
              tag: 'meta',
              attrs: {
                property: 'og:image:height',
                content: options.image.height.toString(),
              },
            },
            options.image.alt && {
              tag: 'meta',
              attrs: { property: 'og:image:alt', content: options.image.alt },
            },
          ].filter(isObject),
        );
      }

      /** @type {import('vite').HtmlTagDescriptor[]} */
      const twitterTags = [
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:title', content: options.title },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:description', content: options.description },
        },
        { tag: 'meta', attrs: { name: 'twitter:image', content: imageUrl } },
      ];
      if (typeof options.image === 'object' && options.image.alt) {
        twitterTags.push({
          tag: 'meta',
          attrs: { name: 'twitter:image:alt', content: options.image.alt },
        });
      }
      if (options.twitterSite) {
        twitterTags.push({
          tag: 'meta',
          attrs: { name: 'twitter:site', content: options.twitterSite },
        });
      }

      return [...regularTags, ...openGraphTags, ...twitterTags].map((tag) => {
        tag.injectTo = 'head';
        return tag;
      });
    },
  };
}
