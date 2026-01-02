import i18n from 'sveltekit-i18n';
import {type Config} from 'sveltekit-i18n';
import lang from './lang.json';

export const defaultLocale = 'en';

const config: Config = {
  translations: {
    en: { lang },
    de: { lang },
  },
	loaders: [
		{
			locale: 'en',
			key: 'common',
			loader: async () => (await import('./en/common.json')).default
		},
		{
			locale: 'en',
			key: 'home',
			routes: ['/'],
			loader: async () => (await import('./en/home.json')).default
		},
		{
			locale: 'en',
			key: 'help',
			routes: ['/help'],
			loader: async () => (await import('./en/help.json')).default
		}
	]
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
