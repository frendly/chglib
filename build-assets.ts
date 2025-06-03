import { build, BuildOptions } from 'esbuild';
import { YAMLPlugin } from 'esbuild-yaml';
import { exec, ChildProcess } from 'child_process'; // Import ChildProcess for typing if needed, though exec types from @types/node are usually sufficient

const input: string = 'src/assets';
const output: string = 'dist/assets';

/**
 * Собираем JS файлы
 */
async function buildJavaScript(isProduction: boolean): Promise<void> {
    console.log('= 1 = Сборка JS файлов...');
    const options: BuildOptions = {
        entryPoints: [`${input}/js/index.js`],
        bundle: true,
        outdir: `${output}/js`,
        minify: isProduction,
        sourcemap: !isProduction,
        target: 'es6',
        plugins: [YAMLPlugin()],
    };
    await build(options);
}

/**
 * Собираем CSS файлы с помощью PostCSS
 */
async function buildStyles(isProduction: boolean): Promise<void> {
    console.log('= 2 = Сборка CSS файлов...');

    const postcssInputs: string = [
        `${input}/styles/index.css`,
        `${input}/styles/critical.css`
    ].join(' ');

    const noMapOption: string = isProduction ? '' : '--no-map';
    // IMPORTANT: Update to use postcss.config.js
    const postcssCommand: string = `postcss ${postcssInputs} --dir ${output}/styles --config postcss.config.js ${noMapOption}`;

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
export default async function eleventyBuildAssets(): Promise<void> {
    const isProduction: boolean = process.env.NODE_ENV === 'production';
    console.log(`Проложение запущено в окружении: ${isProduction ? 'production' : 'development'}`);

    try {
        await buildJavaScript(isProduction);
        await buildStyles(isProduction);
        console.log('✅ CSS и JS файлы собраны корректно.');
    } catch (e: any) { // Or unknown, then check type
        console.error('Overall build failed:', e);
        process.exit(1); // Ensure process exits on failure
    }
}
