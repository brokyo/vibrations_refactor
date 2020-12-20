module.exports = {
  module: {
    rules: [
      {
        test: /\.(ttf|otf|eot|woff|woff2)$/,
        use: {
          loader: `file-loader`,
          options: 
          {
            name: `assets/fonts/[name].[ext]`
          }
        }
      }
    ]
  }
};
