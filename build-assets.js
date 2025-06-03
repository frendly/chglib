// build-assets.ts
import { build } from "esbuild";
import { YAMLPlugin } from "esbuild-yaml";
import { exec } from "child_process";
var input = "src/assets";
var output = "dist/assets";
async function buildJavaScript(isProduction) {
  console.log("= 1 = \u0421\u0431\u043E\u0440\u043A\u0430 JS \u0444\u0430\u0439\u043B\u043E\u0432...");
  const options = {
    entryPoints: [`${input}/js/index.js`],
    bundle: true,
    outdir: `${output}/js`,
    minify: isProduction,
    sourcemap: !isProduction,
    target: "es6",
    plugins: [YAMLPlugin()]
  };
  await build(options);
}
async function buildStyles(isProduction) {
  console.log("= 2 = \u0421\u0431\u043E\u0440\u043A\u0430 CSS \u0444\u0430\u0439\u043B\u043E\u0432...");
  const postcssInputs = [
    `${input}/styles/index.css`,
    `${input}/styles/critical.css`
  ].join(" ");
  const noMapOption = isProduction ? "" : "--no-map";
  const postcssCommand = `postcss ${postcssInputs} --dir ${output}/styles --config postcss.config.js ${noMapOption}`;
  return new Promise((resolve, reject) => {
    exec(postcssCommand, (error, stdout, stderr) => {
      if (error) {
        console.error("PostCSS Error:", stderr);
        console.error("PostCSS Stdout:", stdout);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
async function eleventyBuildAssets() {
  const isProduction = process.env.NODE_ENV === "production";
  console.log(`\u041F\u0440\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u043E \u0432 \u043E\u043A\u0440\u0443\u0436\u0435\u043D\u0438\u0438: ${isProduction ? "production" : "development"}`);
  try {
    await buildJavaScript(isProduction);
    await buildStyles(isProduction);
    console.log("\u2705 CSS \u0438 JS \u0444\u0430\u0439\u043B\u044B \u0441\u043E\u0431\u0440\u0430\u043D\u044B \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E.");
  } catch (e) {
    console.error("Overall build failed:", e);
    process.exit(1);
  }
}
export {
  eleventyBuildAssets as default
};
