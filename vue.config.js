module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/PumpkinTV/'
    : '/',

  // devServer: {
  //   proxy: {
  //     '/github': {
  //       target: 'https://github.com',
  //       changeOrigin: true,
  //       pathRewrite: { '^/github': '/' }
  //     },
  // '/api': {
  //   target: 'https://api.github.com',
  //   changeOrigin: true,
  //   pathRewrite: { '^/api': '/' }
  // },

  //}
  //}
} 
