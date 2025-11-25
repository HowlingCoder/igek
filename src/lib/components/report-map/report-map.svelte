<script lang="ts">
    import { selectedLocation } from '$lib/services/reportWizard';
    import type { MapMouseEvent } from 'maplibre-gl';
    import { Map, Marker, GeolocateControl, NavigationControl } from 'svelte-maplibre-gl';
    import { onMount, onDestroy } from 'svelte';

    let lnglat = $state({ lng: 139.767052, lat: 35.681167 });
    let map: any = $state(null);

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

     const onGeolocate = (ev: any) => {
            try {
                const c = ev.coords ?? ev.coordinate ?? ev;
                const newLoc = { lng: c.longitude ?? c.lng ?? c[0], lat: c.latitude ?? c.lat ?? c[1] };
                lnglat = newLoc;
                selectedLocation.set(newLoc);
                map.flyTo({ center: [newLoc.lng, newLoc.lat], zoom: 14 });
            } catch (err) {
                // ignore
            }
        };
</script>

<Map
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    class="h-[55vh] min-h-[300px] w-full"
    center={[lnglat.lng, lnglat.lat]}
    zoom={14}
    onclick={setMarker}
>
    <Marker bind:lnglat draggable />
    <NavigationControl></NavigationControl>
<GeolocateControl
      position="top-left"
      positionOptions={{ enableHighAccuracy: true }}
      trackUserLocation={true}
      showAccuracyCircle={true}
      ongeolocate={onGeolocate}
    />
</Map>
