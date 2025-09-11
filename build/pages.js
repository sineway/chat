import { src, dest } from 'gulp';

export const pages = () => src('../app/*.{html,json}').pipe(dest('../public'));
