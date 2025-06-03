import postcssImport from 'postcss-import';
import postcssCustomMedia from 'postcss-custom-media';
import postcssPresetEnv from 'postcss-preset-env';
import type { Plugin } from 'postcss'; // General type for PostCSS plugins

// Define a type for the configuration structure if specific one isn't readily available
interface PostcssConfig {
  plugins: Plugin[];
}

const config: PostcssConfig = {
  plugins: [
    postcssImport(), // postcssImport is a function that returns a plugin
    postcssCustomMedia(),
    postcssPresetEnv({
      stage: 1, // Поддержка черновиков CSS (0-4, где 4 — стабильные)
    })
  ]
};

export default config;
