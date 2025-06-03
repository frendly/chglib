import postcssImport from 'postcss-import';
import postcssCustomMedia from 'postcss-custom-media';
import postcssPresetEnv from 'postcss-preset-env';

export default {
  plugins: [
    postcssImport,
    postcssCustomMedia(),
    postcssPresetEnv({
      stage: 1, // Поддержка черновиков CSS (0-4, где 4 — стабильные)
    })
  ]
};
