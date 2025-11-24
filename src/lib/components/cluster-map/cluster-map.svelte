<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, Marker } from 'svelte-maplibre-gl';

	interface Props {
		detail?: number;
	}

	let { detail = 2 }: Props = $props();
	let clusters: { lat: number; lon: number; count: number }[] = $state([]);
	let map: any = $state(null);

	async function fetchClusters() {
		if (!map) return;
		try {
			const bounds = map.getBounds();
			const minLat = bounds.getSouth();
			const maxLat = bounds.getNorth();
			const minLon = bounds.getWest();
			const maxLon = bounds.getEast();

			const params = new URLSearchParams({
				minLat: String(minLat),
				minLon: String(minLon),
				maxLat: String(maxLat),
				maxLon: String(maxLon),
				radius: String(500),
			});

			const res = await fetch(`/api/clusters?${params.toString()}`);
			const data = await res.json();
			clusters = data.clusters ?? [];
		} catch (err) {
			console.error('Failed to load clusters', err);
		}
	}

	onMount(() => {
		// initial fetch after map mounts
		const t = setTimeout(() => fetchClusters(), 200);
		return () => clearTimeout(t);
	});
</script>

<Map
	bind:map={map}
	on:moveend={(e: any) => fetchClusters()}
	style="https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json"
	center={[8.682, 50.11]}
	zoom={13}
	class="w-full h-screen"
>
	{#each clusters as c}
		<Marker lnglat={[c.lon, c.lat]}>
			<div class="bg-red-600 text-white rounded-full flex items-center justify-center" style="width: {Math.min(48, 10 + c.count * 2)}px; height: {Math.min(48, 10 + c.count * 2)}px;">
				{c.count}
			</div>
		</Marker>
	{/each}
</Map>
