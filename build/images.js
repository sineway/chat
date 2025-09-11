import { src, dest } from 'gulp';

export const images = () =>
    src('../app/assets/images/**/*', { encoding: false }).pipe(
        dest('../public/assets/images'),
    );
