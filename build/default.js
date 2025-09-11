import { series, parallel } from 'gulp';

import { pages } from './pages.js';
import { images } from './images.js';
import { javascripts } from './javascripts.js';
import { stylesheets } from './stylesheets.js';

import bs from 'browser-sync';

const server = () => {
    bs.init({
        server: '../public',
        online: false,
        ui: false,
        notify: false,
        ghostMode: false,
        open: false,
    });

    bs.watch('../app/*.{html,json}').on('change', () => {
        pages().on('finish', () => bs.reload());
    });

    bs.watch('../app/**/*.css').on('change', () =>
        stylesheets().on('finish', () => bs.reload('*.css')),
    );

    bs.watch('../app/**/*.js').on('change', () =>
        javascripts().then(() => bs.reload()),
    );
};

export default series(
    parallel(pages, images, stylesheets, javascripts),
    server,
);
