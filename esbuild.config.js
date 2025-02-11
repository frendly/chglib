import { build } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import { YAMLPlugin } from 'esbuild-yaml';

export default () => {
  const isProduction = process.env.NODE_ENV === 'production';

  return build({
    entryPoints: [
      'src/assets/js/index.js',
      'src/assets/styles/index.scss',
      'src/assets/styles/critical.scss',
    ],
    bundle: true,
    outdir: 'dist/assets',
    minify: isProduction,
    sourcemap: !isProduction,
    target: 'es6',
    plugins: [sassPlugin(), YAMLPlugin()],
  }).catch(() => process.exit(1));
};
