<script lang="ts">
    import ReportMap from '$lib/components/report-map/report-map.svelte';
    import { selectedLocation, step } from '$lib/services/reportWizard';

    let location: { lng: number; lat: number } | null = $state(null);
    let error = $state('');
    let mapComponent: ReportMap | null = $state(null);

    // sync from shared store into local bind variable
    $effect(() => {
        if ($selectedLocation && $selectedLocation !== location) {
            location = $selectedLocation;
        }
    });

    // whenever local `location` changes (e.g. user clicks map) push into shared store
    $effect(() => {
        if (location !== $selectedLocation) {
            selectedLocation.set(location);
        }
    });

    // Trigger resize when step becomes 2 (map step is visible)
    // The ResizeObserver in ReportMap will handle the actual resizing
    $effect(() => {
        if ($step === 2 && mapComponent) {
            // Trigger resize after container is visible
            requestAnimationFrame(() => {
                mapComponent?.resize();
            });
        }
    });

    function validate() {
        if (!$selectedLocation) {
            error = 'Bitte wähle einen Ort auf der Karte aus.';
            return { valid: false, error };
        }
        error = '';
        return { valid: true };
    }
</script>

<div class="flex flex-col h-full w-full">
<div class="space-y-3 flex flex-col h-full">
  <h2 class="text-lg text-base-content/70">Wo hat es geknallt?</h2>
    <p class="text-sm text-base-content/60">Wähle den Punkt auf der Karte aus, von dem du glaubst, dass der Knall dort seinen Ursprung hat. Halte einen Punkt auf der Karte gedrückt, um den Marker zu setzen.</p>

    {#if error}
        <div role="alert" class="alert alert-error">
            <div>{error}</div>
        </div>
    {/if}

    <div class="rounded-md overflow-hidden flex-1 min-h-0">
        <ReportMap bind:this={mapComponent} />
    </div>

  
    {#if !location}
        <p class="text-xs text-base-content/60">Noch kein Ort ausgewählt — klicke auf die Karte, um einen Punkt zu wählen.</p>
    {/if}
</div>
</div>