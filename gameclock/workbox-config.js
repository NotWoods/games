module.exports = {
  cacheId: 'gameclock',
  globDirectory: 'dist',
  globPatterns: ['**/*'],
  swDest: 'dist/sw.js',
  ignoreURLParametersMatching: [/fbclid/],
  dontCacheBustURLsMatching: new RegExp('^assets/'),
};
