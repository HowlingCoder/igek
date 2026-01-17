import { PUBLIC_MAPTILER_API_KEY } from '$env/static/public';

/**
 * Get the map style URL for MapLibre GL
 * 
 * If PUBLIC_MAPTILER_API_KEY is set, uses MapTiler's OpenStreetMap style
 * which includes detailed street names and POI.
 * 
 * Otherwise, falls back to MapLibre demo tiles.
 * 
 * To get a free MapTiler API key:
 * 1. Sign up at https://www.maptiler.com/
 * 2. Get your free API key (100,000 requests/month)
 * 3. Add it to your .env file as: PUBLIC_MAPTILER_API_KEY=your_key_here
 * 4. Restart your dev server
 */
export function getMapStyle(): string {
	const apiKey = PUBLIC_MAPTILER_API_KEY;
	
	if (apiKey && apiKey !== '' && apiKey !== undefined) {
		// Use MapTiler Streets v2 style - includes detailed street names and POI
		const styleUrl = `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`;
		console.log('Using MapTiler Streets v2 style with API key');
		return styleUrl;
	}
	
	// Fallback to MapLibre demo tiles (includes street names but less POI detail)
	console.log('Using MapLibre demo tiles (no API key found)');
	return 'https://demotiles.maplibre.org/style.json';
}
