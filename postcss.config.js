// postcss.config.ts
import postcssImport from "postcss-import";
import postcssCustomMedia from "postcss-custom-media";
import postcssPresetEnv from "postcss-preset-env";
var config = {
  plugins: [
    postcssImport(),
    // postcssImport is a function that returns a plugin
    postcssCustomMedia(),
    postcssPresetEnv({
      stage: 1
      // Поддержка черновиков CSS (0-4, где 4 — стабильные)
    })
  ]
};
var postcss_config_default = config;
export {
  postcss_config_default as default
};
