<script lang="ts">
    import { selectedLocation } from '$lib/services/reportWizard';
    import { FRANKFURT_CENTER, FRANKFURT_RADIUS_KM, isWithinFrankfurtBoundary, getBoundaryCoordinates } from '$lib/services/frankfurtBoundary';
    import type { MapMouseEvent } from 'maplibre-gl';
    import {
    	FillLayer,
    	GeoJSONSource,
    	GeolocateControl,
    	Map,
    	Marker,
    	NavigationControl,
    	LineLayer,
    } from 'svelte-maplibre-gl';

    let userLocation = $state<{ lng: number; lat: number }>(FRANKFURT_CENTER);
    let markerPosition = $state(FRANKFURT_CENTER);
    let previousValidPosition = $state(FRANKFURT_CENTER);
    let showWarning = $state(false);
    let warningTimer: ReturnType<typeof setTimeout> | null = null;

    const CIRCLE_POINTS = 64;
    const WARNING_DURATION = 3000;

    // Sync marker with selectedLocation
    $effect(() => {
        if ($selectedLocation) {
            markerPosition = $selectedLocation;
            previousValidPosition = $selectedLocation;
        }
    });

    function handleMapLoad(e: any) {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const detectedLocation = {
                        lng: position.coords.longitude,
                        lat: position.coords.latitude
                    };

                    if (isWithinFrankfurtBoundary(detectedLocation)) {
                        userLocation = detectedLocation;
                        if (!$selectedLocation) {
                            markerPosition = detectedLocation;
                            previousValidPosition = detectedLocation;
                            $selectedLocation = detectedLocation;
                        }
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
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

    function handleMapClick(e: MapMouseEvent) {
        const clickedPoint = { lng: e.lngLat.lng, lat: e.lngLat.lat };

        if (isWithinFrankfurtBoundary(clickedPoint)) {
            markerPosition = clickedPoint;
            previousValidPosition = clickedPoint;
            $selectedLocation = clickedPoint;
            showWarning = false;
            if (warningTimer) {
                clearTimeout(warningTimer);
                warningTimer = null;
            }
        } else {
            showWarning = true;
            if (warningTimer) clearTimeout(warningTimer);
            warningTimer = setTimeout(() => {
                showWarning = false;
                warningTimer = null;
            }, WARNING_DURATION);
        }
    }

    function handleMarkerDragEnd() {
        if (!isWithinFrankfurtBoundary(markerPosition)) {
            markerPosition = previousValidPosition;

            showWarning = true;
            if (warningTimer) clearTimeout(warningTimer);
            warningTimer = setTimeout(() => {
                showWarning = false;
                warningTimer = null;
            }, WARNING_DURATION);
        } else {
            previousValidPosition = markerPosition;
            $selectedLocation = markerPosition;
            showWarning = false;
            if (warningTimer) {
                clearTimeout(warningTimer);
                warningTimer = null;
            }
        }
    }

    function handleGeolocate(e: GeolocationPosition) {
        const { longitude, latitude } = e.coords;
        const detectedLocation = { lng: longitude, lat: latitude };

        if (isWithinFrankfurtBoundary(detectedLocation)) {
            userLocation = detectedLocation;

            if (!$selectedLocation) {
                markerPosition = detectedLocation;
                previousValidPosition = detectedLocation;
                $selectedLocation = detectedLocation;
            }
        }
    }


	
    // Cleanup on component destroy
    $effect(() => {
        return () => {
            if (warningTimer) clearTimeout(warningTimer);
        };
    });
</script>

<div class="space-y-2">
    <Map
        style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        class="h-[55vh] min-h-[300px] w-full"
        center={[FRANKFURT_CENTER.lng, FRANKFURT_CENTER.lat]}
        zoom={12}
        onclick={handleMapClick}
        onload={handleMapLoad}
    >
        <GeolocateControl
            position="top-left"
            positionOptions={{ enableHighAccuracy: true }}
            trackUserLocation={true}
            showAccuracyCircle={false}
            ongeolocate={handleGeolocate}
        />
        <NavigationControl position="top-right" />

        {#if boundaryGeoJSON}
            <GeoJSONSource id="boundary-source" data={boundaryGeoJSON}>
                <FillLayer
                    paint={{
                        'fill-color': 'rgba(20,220,60,0.15)',
                        'fill-opacity': 0.3
                    }}
                />
                <LineLayer
                    paint={{
                        'line-color': 'rgba(20,220,60,0.8)',
                        'line-width': 2
                    }}
                />
            </GeoJSONSource>
        {/if}

        {#if markerPosition}
            <Marker bind:lnglat={markerPosition} draggable ondragend={handleMarkerDragEnd} />
        {/if}
    </Map>

    {#if showWarning}
        <div class="toast toast-top toast-center z-50">
            <div role="alert" class="alert alert-warning">
                <span>Der Ursprung des Knalls muss im Frankfurter Stadtgebiet (innerhalb {FRANKFURT_RADIUS_KM}km Radius) liegen!</span>
            </div>
        </div>
    {/if}
</div>