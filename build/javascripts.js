import * as rollup from 'rollup';
import { babel as rollupBabel } from '@rollup/plugin-babel';
import rollupTerser from '@rollup/plugin-terser';

export const javascripts = () =>
    rollup
        .rollup({
            input: '../app/assets/javascripts/app.js',
            plugins: [
                rollupBabel({
                    presets: ['@babel/preset-env'],
                    babelHelpers: 'bundled',
                }),
                // @ts-ignore
                rollupTerser(),
            ],
        })
        .then((bundle) =>
            bundle.write({
                file: '../public/assets/javascripts/app.js',
                format: 'iife',
                sourcemap: true,
            }),
        )
        .catch((error) => {
            console.log(error.message);
        });
