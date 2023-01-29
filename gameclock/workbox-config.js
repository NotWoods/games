module.exports = {
  cacheId: 'gameclock',
  globDirectory: '../dist/gameclock',
  globPatterns: ['**/*'],
  swDest: '../dist/gameclock/sw.js',
  ignoreURLParametersMatching: [/fbclid/],
  dontCacheBustURLsMatching: new RegExp('^assets/'),
};
