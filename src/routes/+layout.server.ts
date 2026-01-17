import type { LayoutServerLoad } from './$types';
import { verifyDatabaseConnection } from '$lib/services/database-guard';
import { loadTranslations, locale } from '$lib/translations/translations';

export const load: LayoutServerLoad = async ({ url }) => {
    const { pathname } = url;

    // Set locale to German and load translations
    locale.set('de');
    await loadTranslations('de', pathname);

    // Check database connection (cached, only checks if needed)
    // Use a timeout to avoid blocking too long
    const dbConnected = await Promise.race([
        verifyDatabaseConnection(),
        new Promise<boolean>((resolve) => setTimeout(() => resolve(true), 2000)) // Default to true after 2s
    ]).catch(() => true); // Default to true on error

    return {
        pathname,
        dbConnected,
    };
}
