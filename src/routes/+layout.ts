import type { LayoutLoad } from './$types';
import { loadTranslations } from '$lib/translations/translations';

export const load: LayoutLoad = async ({ url }) => {
    const { pathname } = url;

    await loadTranslations('de', pathname);

    return {
        pathname,
    };
}