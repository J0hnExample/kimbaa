// webpack.config.js
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    fallback: {
      "path": require.resolve("path-browserify"),
      "fs": false,
      "os": false
    }
  },
  module: {
    rules: [
      // Ihre anderen Regeln hier
    ]
  },
  plugins: [
    new Dotenv({
      path: './.env', // Pfad zu .env-Datei (dies ist der Standardwert)
      safe: true, // Optionale Sicherungsdatei (falls vorhanden)
    })
  ],
  devServer: {
    server: {
      type: 'https',
      options: {
        key: fs.readFileSync('./cert/private.key'),
        cert: fs.readFileSync('./cert/public.crt'),
      },
    },
    setupMiddlewares: (middlewares, devServer) => {
      // Hier können Sie Ihre Middleware-Setup-Funktionen hinzufügen
      // Beispiel:
      // middlewares.push((req, res, next) => {
      //   console.log('Custom middleware');
      //   next();
      // });
      return middlewares;
    },
    static: path.resolve(__dirname, 'dist'),
    port: process.env.REACT_APP_HTTP_PORT || 3000,
    hot: true,
  }
};
