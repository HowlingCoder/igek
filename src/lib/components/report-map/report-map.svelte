<script lang="ts">
    import { selectedLocation } from '$lib/services/reportWizard';
    import type { MapMouseEvent } from 'maplibre-gl';
    import { Map, Marker } from 'svelte-maplibre-gl';

    let lnglat = $state({ lng: 139.767052, lat: 35.681167 });

    // sync store -> local marker
    $effect(() => {
        if ($selectedLocation) {
            lnglat = $selectedLocation;
        }
    });

    function setMarker(e: MapMouseEvent) {
        const newLoc = { lng: e.lngLat.lng, lat: e.lngLat.lat };
        lnglat = newLoc;
        selectedLocation.set(newLoc);
    }
</script>

<Map
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    class="h-[55vh] min-h-[300px] w-full"
    center={[lnglat.lng, lnglat.lat]}
    zoom={14}
    onclick={setMarker}
>
    <Marker bind:lnglat draggable />

</Map>
