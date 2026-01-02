<script lang="ts">
	import { onMount } from 'svelte';
	import { CircleLayer, FillLayer, GeoJSONSource, GeolocateControl, LineLayer, Map, SymbolLayer } from 'svelte-maplibre-gl';
	import { FRANKFURT_CENTER, getBoundaryCoordinates } from '$lib/services/frankfurtBoundary';

	let cluster = true;
	let clusterMaxZoom = 15;
	let clusterRadius = $state(200);

	let geojson = $state<any>(null);
	let center = $state<any>([FRANKFURT_CENTER.lng, FRANKFURT_CENTER.lat]);
	let zoom = $state(12);

	// compute meters per pixel at given zoom and latitude
	function metersPerPixel(zoom: number, lat: number) {
		const R = 6378137; // WebMercator
		return (Math.cos((lat * Math.PI) / 180) * 2 * Math.PI * R) / (256 * Math.pow(2, zoom));
	}

	$effect(() => {
		const lat = Array.isArray(center) ? center[1] : center?.lat ?? 50.11;
		const mpp = metersPerPixel(zoom, lat);
		const pxFor100m = Math.max(6, Math.round(200 / mpp));
		clusterRadius = pxFor100m;
	});

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

	const boundaryGeoJSON = $derived.by(() => {
		const coords = getBoundaryCoordinates();

		return {
			type: 'FeatureCollection' as const,
			features: [
				{
					type: 'Feature' as const,
					geometry: {
						type: 'Polygon' as const,
						coordinates: [coords]
					},
					properties: {}
				}
			]
		};
	});

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

	{#if boundaryGeoJSON}
		<GeoJSONSource id="frankfurt-boundary" data={boundaryGeoJSON}>
			<FillLayer
				paint={{
					'fill-color': 'rgba(20,220,60,0.1)',
					'fill-opacity': 0.3
				}}
			/>
			<LineLayer
				paint={{
					'line-color': 'rgba(20,220,60,0.6)',
					'line-width': 2,
					'line-dasharray': [2, 2]
				}}
			/>
		</GeoJSONSource>
	{/if}

	<GeoJSONSource
		data={geojson ?? { type: 'FeatureCollection', features: [] }}
		{cluster}
		clusterMaxZoom={cluster ? clusterMaxZoom : undefined}
		clusterRadius={cluster ? clusterRadius : undefined}
	>
		<CircleLayer
			filter={['has', 'point_count']}
			paint={{
				'circle-color': 'rgba(220,20,60,0.35)',
				'circle-stroke-color': 'rgba(220,20,60,0.8)',
				'circle-stroke-width': 1,
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
				'circle-color': 'rgba(220,20,60,0.35)',
				'circle-stroke-color': 'rgba(220,20,60,0.8)',
				'circle-stroke-width': 1,
				'circle-radius': clusterRadius,
				'circle-opacity': 1
			}}
		/>
	</GeoJSONSource>
</Map>
