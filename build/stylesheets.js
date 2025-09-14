import { src, dest } from 'gulp';
import postcss from 'gulp-postcss';
import postcssImport from 'postcss-import';
import postcssUrl from 'postcss-url';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';

export const stylesheets = () =>
    src('../app/assets/stylesheets/app.css', {
        sourcemaps: true,
    })
        .pipe(
            postcss([
                postcssImport(),
                postcssUrl({ url: 'inline', optimizeSvgEncode: true }),
                postcssPresetEnv({ preserve: false }),
                cssnano(),
            ]).on('error', (error) => {
                console.log(error.toString());
            }),
        )
        .pipe(
            dest('../docs/assets/stylesheets', {
                sourcemaps: '.',
            }),
        );
