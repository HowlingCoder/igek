<script lang="ts">
    import { selectedLocation } from '$lib/services/reportWizard';
    import type { MapMouseEvent } from 'maplibre-gl';
    import {
    	FillLayer,
    	GeoJSONSource,
    	GeolocateControl,
    	Map,
    	Marker,
    	NavigationControl,
    } from 'svelte-maplibre-gl';

    let userLocation = $state<{ lng: number; lat: number }>({ lng: 139.767052, lat: 35.681167 });
    let markerPosition = $state({ lng: 139.767052, lat: 35.681167 });
    let previousValidPosition = $state({ lng: 139.767052, lat: 35.681167 });
    let showWarning = $state(false);
    let warningTimer: ReturnType<typeof setTimeout> | null = null;

    const RADIUS_KM = 0.5;
    const RADIUS_METERS = RADIUS_KM * 1000;
    const EARTH_RADIUS_METERS = 6371000;
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
                    userLocation = {
                        lng: position.coords.longitude,
                        lat: position.coords.latitude
                    };
                },
                (error) => {
                    console.error('Geolocation error:', error);
                }
            );
        }
    }

    // Optimized circle creation with memoized calculations
    function createCircleCoordinates(center: [number, number], radiusInMeters: number): [number, number][] {
        const coords: [number, number][] = [];
        const distanceX = radiusInMeters / (111320 * Math.cos((center[1] * Math.PI) / 180));
        const distanceY = radiusInMeters / 110540;
        const angleStep = (2 * Math.PI) / CIRCLE_POINTS;

        for (let i = 0; i <= CIRCLE_POINTS; i++) {
            const theta = i * angleStep;
            const x = distanceX * Math.cos(theta);
            const y = distanceY * Math.sin(theta);
            coords.push([center[0] + x, center[1] + y]);
        }

        return coords;
    }

    // Haversine formula for distance calculation
    function isWithinRadius(point: [number, number], center: [number, number]): boolean {
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        
        const dLat = toRad(point[1] - center[1]);
        const dLon = toRad(point[0] - center[0]);
        const lat1 = toRad(center[1]);
        const lat2 = toRad(point[1]);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_METERS * c <= RADIUS_METERS;
    }

    // Create GeoJSON for the circle
    let circleGeoJSON = $derived.by(() => {
        if (!userLocation) return null;
        
        const coords = createCircleCoordinates([userLocation.lng, userLocation.lat], RADIUS_METERS);
        
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

        if (userLocation && isWithinRadius([clickedPoint.lng, clickedPoint.lat], [userLocation.lng, userLocation.lat])) {
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
        if (userLocation && !isWithinRadius([markerPosition.lng, markerPosition.lat], [userLocation.lng, userLocation.lat])) {
            // Snap back to previous valid position
            markerPosition = previousValidPosition;
            
            showWarning = true;
            if (warningTimer) clearTimeout(warningTimer);
            warningTimer = setTimeout(() => {
                showWarning = false;
                warningTimer = null;
            }, WARNING_DURATION);
        } else {
            // Update valid position and store
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
        userLocation = { lng: longitude, lat: latitude };
        
        // Only set marker if it hasn't been set yet
        if (!$selectedLocation) {
            markerPosition = userLocation;
            previousValidPosition = userLocation;
            $selectedLocation = userLocation;
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
        center={[userLocation.lng, userLocation.lat]}
        zoom={14}
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

        {#if circleGeoJSON}
            <GeoJSONSource id="circle-source" data={circleGeoJSON}>
                <FillLayer
                    paint={{
                        'fill-color': 'rgba(20,220,60,0.35)',
                        'fill-opacity': 0.3
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
                <span>Der Ursprung des Knalls muss in einem {RADIUS_KM}km Radius liegen!</span>
            </div>
        </div>
    {/if}
</div>