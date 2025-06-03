module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-custom-media')({ preserve: false }),
    require('postcss-preset-env')({
      stage: 1, // Поддержка черновиков CSS (0-4, где 4 — стабильные)
    })
  ]
};
