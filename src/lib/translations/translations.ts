import i18n from 'sveltekit-i18n';
import {type Config} from 'sveltekit-i18n';
import lang from './lang.json';

export const defaultLocale = 'de';

const config: Config = {
	fallbackLocale: 'de',
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
		},
		{
			locale: 'de',
			key: 'common',
			loader: async () => (await import('./de/common.json')).default
		},
		{
			locale: 'de',
			key: 'home',
			routes: ['/'],
			loader: async () => (await import('./de/home.json')).default
		},
		{
			locale: 'de',
			key: 'help',
			routes: ['/help'],
			loader: async () => (await import('./de/help.json')).default
		}
	]
};

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);
