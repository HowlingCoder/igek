<script lang="ts">
    import ReportMap from '$lib/components/report-map/report-map.svelte';
    import { selectedLocation } from '$lib/services/reportWizard';

    let location: { lng: number; lat: number } | null = $state(null);
    let error = $state('');

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

    function validate() {
        if (!$selectedLocation) {
            error = 'Please select a location on the map.';
            return { valid: false, error };
        }
        error = '';
        return { valid: true };
    }
</script>

<div class="flex flex-col min-h-full mx-auto w-full mt-3">
<div class="space-y-3">
  <h2 class="text-lg text-base-content/70">Wo hat es geknallt?</h2>
    <p class="text-sm text-base-content/60">Wähle den Punkt auf der Karte aus, von dem du glaubst, dass der Knall dort seinen Ursprung hat.</p>

    {#if error}
        <div role="alert" class="alert alert-error">
            <div>{error}</div>
        </div>
    {/if}

    <div class="border rounded-md overflow-hidden">
        <ReportMap />
    </div>

  
    {#if !location}
        <p class="text-xs text-base-content/60">No location selected yet — click the map to pick a spot.</p>
    {/if}
</div>
</div>