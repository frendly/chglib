const { build } = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const { yamlPlugin } = require("esbuild-plugin-yaml");

module.exports = () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return build({
    entryPoints: ["src/assets/js/index.js", "src/assets/styles/index.scss", "src/assets/styles/critical.scss"],
    bundle: true,
    outdir: "dist/assets",
    minify: isProduction,
    sourcemap: !isProduction,
    target: 'es6',
    plugins: [
      sassPlugin(),
      yamlPlugin(),
    ]
  }).catch(() => process.exit(1));
};

