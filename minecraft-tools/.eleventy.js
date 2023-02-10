const { EleventyHtmlBasePlugin } = require('@11ty/eleventy');

/** @param {import('../node_modules/@11ty/eleventy/src').UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addGlobalData('siteTitle', 'Minecraft Tools');

  eleventyConfig.ignores.add('README.md');
  eleventyConfig.addPassthroughCopy('**/*.png');
  eleventyConfig.addPassthroughCopy('**/*.svg');
  eleventyConfig.addPassthroughCopy('*.css');
  eleventyConfig.addPassthroughCopy('armorcolor/script.js');
  eleventyConfig.addPassthroughCopy('hideflags/script.js');

  return {
    pathPrefix: '/minecraft-tools/',
    dir: {
      layouts: '_layouts',
      output: '../dist/minecraft-tools',
    },
  };
};
