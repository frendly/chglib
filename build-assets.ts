import { exec } from 'node:child_process';
import { build } from 'esbuild';
import { YAMLPlugin } from 'esbuild-yaml';

const input = 'src/assets';
const output = 'dist/assets';

/**
 * Собираем JS файлы
 */
async function buildJavaScript(isProduction: boolean): Promise<void> {
  console.log('= 1 = Сборка JS файлов...');
  await build({
    entryPoints: [`${input}/js/index.js`],
    bundle: true,
    outdir: `${output}/js`,
    minify: isProduction,
    sourcemap: !isProduction,
    target: 'es6',
    plugins: [YAMLPlugin()],
  });
}

/**
 * Собираем CSS файлы с помощью PostCSS
 */
async function buildStyles(isProduction: boolean): Promise<void> {
  console.log('= 2 = Сборка CSS файлов...');

  const postcssInputs = [`${input}/styles/index.css`, `${input}/styles/critical.css`].join(' ');

  const noMapOption = isProduction ? '' : '--no-map';
  const postcssCommand = `postcss ${postcssInputs} --dir ${output}/styles --config postcss.config.cjs ${noMapOption}`;

  return new Promise<void>((resolve, reject) => {
    exec(postcssCommand, (error, stdout, stderr) => {
      if (error) {
        console.error('PostCSS Error:', stderr);
        console.error('PostCSS Stdout:', stdout); // Also log stdout for more context
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Main build function exported for Eleventy
export default async (): Promise<void> => {
  const isProduction = process.env.NODE_ENV === 'production';
  console.log(`Проложение запущено в окружении: ${isProduction ? 'production' : 'development'}`);

  try {
    await Promise.all([buildJavaScript(isProduction), buildStyles(isProduction)]);
    console.log('✅ CSS и JS файлы собраны корректно.');
  } catch (e) {
    console.error('Overall build failed:', e);
    process.exit(1); // Ensure process exits on failure
  }
};
