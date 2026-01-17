<script lang="ts">
    import { FRANKFURT_CENTER, FRANKFURT_RADIUS_KM, getBoundaryCoordinates, isWithinFrankfurtBoundary } from '$lib/services/frankfurtBoundary';
    import { selectedLocation } from '$lib/services/reportWizard';
    import { getMapStyle } from '$lib/utils/mapStyle';
    import type { Map as MapLibreMap, MapMouseEvent } from 'maplibre-gl';
    import {
    	FillLayer,
    	GeoJSONSource,
    	GeolocateControl,
    	LineLayer,
    	Map,
    	Marker,
    	NavigationControl,
    } from 'svelte-maplibre-gl';

    let userLocation = $state<{ lng: number; lat: number }>(FRANKFURT_CENTER);
    let markerPosition = $state(FRANKFURT_CENTER);
    let previousValidPosition = $state(FRANKFURT_CENTER);
    let showWarning = $state(false);
    let warningTimer: ReturnType<typeof setTimeout> | null = null;
    let mapInstance: MapLibreMap | null = null;
    let mapCenter = $state<[number, number]>([FRANKFURT_CENTER.lng, FRANKFURT_CENTER.lat]);
    let mapZoom = $state(14);
    let mapReady = $state(false);

    const CIRCLE_POINTS = 64;
    const WARNING_DURATION = 3000;
    const LONG_PRESS_DURATION = 250; // 2 seconds
    const MOVE_THRESHOLD = 10; // pixels
    
    // Long-press handling
    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let pressStartPosition: { x: number; y: number } | null = null;
    let pressStartLngLat: { lng: number; lat: number } | null = null;
    let isLongPress = $state(false);

    // Sync marker with selectedLocation
    $effect(() => {
        if ($selectedLocation) {
            markerPosition = $selectedLocation;
            previousValidPosition = $selectedLocation;
        }
    });

    function handleMapLoad(e: any) {
        // Get map instance
        mapInstance = e.detail || e.target || e;
        
        // Set up long-press event listeners
        if (mapInstance && typeof mapInstance.on === 'function') {
            mapInstance.on('mousedown', handleMapMouseDown);
            mapInstance.on('mousemove', handleMapMouseMove);
            mapInstance.on('mouseup', handleMapMouseUp);
            mapInstance.on('touchstart', handleMapTouchStart);
            mapInstance.on('touchmove', handleMapTouchMove);
            mapInstance.on('touchend', handleMapTouchEnd);
        }
        
        // Wait for map to be fully ready
        if (mapInstance) {
            if (mapInstance.isStyleLoaded()) {
                mapReady = true;
                requestUserLocation();
            } else {
                mapInstance.once('style.load', () => {
                    mapReady = true;
                    requestUserLocation();
                });
            }
        }
    }
    
    function requestUserLocation() {
        if (!mapReady || !mapInstance) return;
        
        // Request geolocation
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    zoomToLocation({
                        lng: position.coords.longitude,
                        lat: position.coords.latitude
                    });
                },
                (error) => {
                    console.error('Geolocation error:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000 // Allow 1 minute old cached position for faster initial load
                }
            );
        }
    }
    
    function zoomToLocation(detectedLocation: { lng: number; lat: number }) {
        if (!mapInstance || !mapReady) return;
        
        if (isWithinFrankfurtBoundary(detectedLocation)) {
            userLocation = detectedLocation;
            // Always place marker at detected location
            markerPosition = detectedLocation;
            previousValidPosition = detectedLocation;
            $selectedLocation = detectedLocation;
            
            // Zoom to user's current position
            mapCenter = [detectedLocation.lng, detectedLocation.lat];
            mapZoom = 16;
            mapInstance.flyTo({
                center: [detectedLocation.lng, detectedLocation.lat],
                zoom: 16,
                duration: 1000
            });
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
        // Ignore all clicks - only long-press sets the marker
        // This prevents accidental marker placement while scrolling
        return;
    }
    
    function startLongPress(lngLat: { lng: number; lat: number }, clientX: number, clientY: number) {
        pressStartPosition = { x: clientX, y: clientY };
        pressStartLngLat = lngLat;
        isLongPress = false;

        // Start long-press timer (2 seconds)
        longPressTimer = setTimeout(() => {
            if (pressStartLngLat) {
                isLongPress = true;
                // Set marker at long-press location
                const point = pressStartLngLat;
                if (isWithinFrankfurtBoundary(point)) {
                    markerPosition = point;
                    previousValidPosition = point;
                    $selectedLocation = point;
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
        }, LONG_PRESS_DURATION);
    }

    function cancelLongPress() {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            longPressTimer = null;
        }
        pressStartPosition = null;
        pressStartLngLat = null;
    }

    function handleMapMouseDown(e: MapMouseEvent) {
        startLongPress(
            { lng: e.lngLat.lng, lat: e.lngLat.lat },
            e.originalEvent.clientX,
            e.originalEvent.clientY
        );
    }

    function handleMapMouseMove(e: MapMouseEvent) {
        // Cancel long-press if user moves too much
        if (pressStartPosition && longPressTimer) {
            const moveDistance = Math.sqrt(
                Math.pow(e.originalEvent.clientX - pressStartPosition.x, 2) +
                Math.pow(e.originalEvent.clientY - pressStartPosition.y, 2)
            );

            if (moveDistance > MOVE_THRESHOLD) {
                cancelLongPress();
            }
        }
    }

    function handleMapMouseUp() {
        cancelLongPress();
    }

    function handleMapTouchStart(e: any) {
        if (e.originalEvent.touches.length === 1) {
            const touch = e.originalEvent.touches[0];
            startLongPress(
                { lng: e.lngLat.lng, lat: e.lngLat.lat },
                touch.clientX,
                touch.clientY
            );
        }
    }

    function handleMapTouchMove(e: any) {
        // Cancel long-press if user moves too much
        if (pressStartPosition && longPressTimer && e.originalEvent.touches.length === 1) {
            const touch = e.originalEvent.touches[0];
            const moveDistance = Math.sqrt(
                Math.pow(touch.clientX - pressStartPosition.x, 2) +
                Math.pow(touch.clientY - pressStartPosition.y, 2)
            );

            if (moveDistance > MOVE_THRESHOLD) {
                cancelLongPress();
            }
        } else if (e.originalEvent.touches.length > 1) {
            // Cancel on multi-touch (pinch zoom)
            cancelLongPress();
        }
    }

    function handleMapTouchEnd() {
        cancelLongPress();
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
        zoomToLocation({ lng: longitude, lat: latitude });
    }


	
    // Cleanup on component destroy
    $effect(() => {
        return () => {
            if (warningTimer) clearTimeout(warningTimer);
            if (longPressTimer) clearTimeout(longPressTimer);
            
            // Remove event listeners from map instance
            if (mapInstance && typeof mapInstance.off === 'function') {
                mapInstance.off('mousedown', handleMapMouseDown);
                mapInstance.off('mousemove', handleMapMouseMove);
                mapInstance.off('mouseup', handleMapMouseUp);
                mapInstance.off('touchstart', handleMapTouchStart);
                mapInstance.off('touchmove', handleMapTouchMove);
                mapInstance.off('touchend', handleMapTouchEnd);
            }
        };
    });
</script>

<div class="space-y-2">
    <Map
        style={getMapStyle()}
        class="h-[55vh] min-h-[300px] w-full"
        bind:center={mapCenter}
        bind:zoom={mapZoom}
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