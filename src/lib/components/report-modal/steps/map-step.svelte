<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { MapLibre, Marker, NavigationControl, ScaleControl } from 'svelte-maplibre-gl';

    interface Props {
        center?: any;
        zoom?: number;
        selectedLocation?: { lng: number; lat: number } | null;
    }

    let { center = { lng: 137, lat: 36 }, zoom = 3.5, selectedLocation = $bindable(null) }: Props = $props();

    const dispatch = createEventDispatcher();
    let error = $state('');

    function onMapClick(e: CustomEvent) {
        const d = e.detail ?? {};
        const lngLat = d.lngLat ?? d.lng_lat ?? d;
        const lng = Array.isArray(lngLat) ? lngLat[0] : lngLat?.lng;
        const lat = Array.isArray(lngLat) ? lngLat[1] : lngLat?.lat;
        if (lng != null && lat != null) {
            selectedLocation = { lng, lat };
            error = '';
            dispatch('change', selectedLocation);
        }
    }

    // Exposed method: parent calls stepRef.validate()
    function validate() {
        if (!selectedLocation) {
            error = 'Please select a location on the map.';
            return { valid: false, error };
        }
        error = '';
        return { valid: true };
    }
</script>

<div class="space-y-3">
    <p class="text-sm text-base-content/80">Click the map to mark the approximate location.</p>

    {#if error}
        <div role="alert" class="alert alert-error">
            <div>{error}</div>
        </div>
    {/if}

    <div class="border rounded-md overflow-hidden">
        <MapLibre
            class="h-[55vh] min-h-[300px] w-full"
            style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            center={center}
            zoom={zoom}
            on:click={onMapClick}
        >
            <NavigationControl />
            <ScaleControl />
            {#if selectedLocation}
                <Marker lnglat={[selectedLocation.lng, selectedLocation.lat]} />
            {/if}
        </MapLibre>
    </div>

    {#if selectedLocation}
        <div class="text-sm">
            <span class="font-medium">Selected:</span>
            <span class="ml-2">{selectedLocation.lng.toFixed(5)}, {selectedLocation.lat.toFixed(5)}</span>
            <button class="btn btn-xs btn-ghost ml-4" onclick={() => { selectedLocation = null; dispatch('change', null); }}>Clear</button>
        </div>
    {:else}
        <p class="text-xs text-base-content/60">No location selected yet — click the map to pick a spot.</p>
    {/if}
</div>