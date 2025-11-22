<script lang="ts">

	import { MapLibre, ScaleControl, NavigationControl } from 'svelte-maplibre-gl';
</script>

<MapLibre
	class="h-[55vh] min-h-[300px]"
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	zoom={3.5}
	center={{ lng: 137, lat: 36 }}
>
	<NavigationControl />
	<ScaleControl />
</MapLibre>
x
