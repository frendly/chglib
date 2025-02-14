import { EleventyRenderPlugin } from '@11ty/eleventy';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import esbuild from './esbuild.config.js';

const now = String(Date.now());

export default (eleventyConfig) => {
  // Enable quiet mode to reduce console noise
  eleventyConfig.setQuietMode(true);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // https://www.11ty.dev/docs/plugins/render/#renderfile
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Copy all images directly to dist.
  eleventyConfig.addPassthroughCopy({ 'src/assets/images': '/assets/images' });
  // Copy robots.txt, etc to dist.
  eleventyConfig.addPassthroughCopy({ 'src/assets/static/*': '/' });

  // Add cache busting with {% version %} time string
  eleventyConfig.addShortcode('version', () => now);

  // Build JS and CSS assets
  eleventyConfig.on('beforeBuild', esbuild);

  eleventyConfig.addWatchTarget('./src/assets/');

  return {
    templateFormats: ['md', 'njk', 'html'],
    dir: {
      input: 'pages',
      output: 'dist',
      includes: '../src/_includes',
      data: '../src/_data',
      layouts: '../src/_includes/layouts',
    },
  };
};
