<script lang="ts">
	import { onMount } from 'svelte';
	import { CircleLayer, GeoJSONSource, GeolocateControl, Map, SymbolLayer } from 'svelte-maplibre-gl';

	// default clustering options (kept internal; no UI controls)
	let cluster = true;
	let clusterMaxZoom = 15;
	// `clusterRadius` is in pixels for the GeoJSONSource clustering algorithm.
	// We'll compute it from a fixed real-world radius (100 meters) so that
	// cluster symbols visually represent ~100m on the map.
	let clusterRadius = 200;

	let geojson: any = null;
	// bound map state (use HTML bindings instead of directly accessing the map object)
	let center: any = [8.682, 50.11];
	let zoom = 13;

	// compute meters per pixel at given zoom and latitude
	function metersPerPixel(zoom: number, lat: number) {
		const R = 6378137; // WebMercator
		return (Math.cos((lat * Math.PI) / 180) * 2 * Math.PI * R) / (256 * Math.pow(2, zoom));
	}

	// reactive: recompute pixel radius that corresponds to 100 meters whenever
	// `zoom` or `center` changes.
	$: {
		const lat = Array.isArray(center) ? center[1] : center?.lat ?? 50.11;
		const mpp = metersPerPixel(zoom, lat);
		// pixels = meters / (meters per pixel)
		const pxFor100m = Math.max(6, Math.round(200 / mpp));
		clusterRadius = pxFor100m;
	}

	// debounce
	let fetchTimer: number | null = null;
	function scheduleFetch(delay = 250) {
		if (fetchTimer) clearTimeout(fetchTimer);
		// @ts-ignore
		fetchTimer = setTimeout(() => fetchClusters(), delay);
	}

	async function fetchClusters() {
		if (!center) return;
		try {
			// `center` is bound as [lon, lat] from the Map component.
			const lat = Array.isArray(center) ? center[1] : center.lat;
			const lon = Array.isArray(center) ? center[0] : center.lng;
			const radiusMeters = Math.max(25, Math.round(metersPerPixel(zoom, lat) * 40));
			const params = new URLSearchParams({
				centerLat: String(lat),
				centerLon: String(lon),
				radiusMeters: String(radiusMeters),
				minClusterSize: String(10)
			});

			const res = await fetch(`/api/clusters?${params.toString()}`);
			const json = await res.json();

			geojson = json;
		} catch (err) {
			console.error('Failed to load clusters', err);
			geojson = { type: 'FeatureCollection', features: [] };
		}
	}

	onMount(() => {
		scheduleFetch(0);
	});
</script>

<Map
	style="https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json"
	bind:center={center}
	bind:zoom={zoom}
	class="w-full h-screen"
>
<GeolocateControl
      position="top-left"
      positionOptions={{ enableHighAccuracy: true }}
      trackUserLocation={true}
      showAccuracyCircle={true}
    />
	<GeoJSONSource
		data={geojson ?? { type: 'FeatureCollection', features: [] }}
		{cluster}
		clusterMaxZoom={cluster ? clusterMaxZoom : undefined}
		clusterRadius={cluster ? clusterRadius : undefined}
	>
		<CircleLayer
			filter={['has', 'point_count']}
			paint={{
				// Semi-transparent red to represent the 100m aggregated area
				'circle-color': 'rgba(220,20,60,0.35)',
				'circle-stroke-color': 'rgba(220,20,60,0.8)',
				'circle-stroke-width': 1,
				// Use computed pixel radius so the cluster circle approximates 100 meters
				'circle-radius': clusterRadius,
				'circle-opacity': 1
			}}
		/>

		<SymbolLayer
			filter={['has', 'point_count']}
			layout={{
				'text-field': '{point_count_abbreviated}',
				'text-size': 12
			}}
		/>

		<CircleLayer
			filter={['!', ['has', 'point_count']]}
			paint={{
				// Semi-transparent red to represent the 100m aggregated area
				'circle-color': 'rgba(220,20,60,0.35)',
				'circle-stroke-color': 'rgba(220,20,60,0.8)',
				'circle-stroke-width': 1,
				// Use computed pixel radius so the cluster circle approximates 100 meters
				'circle-radius': clusterRadius,
				'circle-opacity': 1
			}}
		/>
	</GeoJSONSource>


</Map>
