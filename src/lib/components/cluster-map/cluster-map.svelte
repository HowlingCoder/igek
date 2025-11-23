<script lang="ts">
	import { onMount } from 'svelte';
	import { Map, Marker } from 'svelte-maplibre-gl';

	export let detail: number = 2;
	let clusters: any[] = [];

	onMount(async () => {
		const res = await fetch(`/api/reports?detail=${detail}`);
		clusters = await res.json();
	});
</script>

<Map
	style="https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json"
	center={[8.682, 50.11]}
	zoom={13}
	class="w-full h-screen"
>
	{#each clusters as c}
		<Marker lnglat={[c.lon, c.lat]}></Marker>
	{/each}
</Map>
