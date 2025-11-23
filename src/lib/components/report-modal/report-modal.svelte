<script lang="ts">
    import InfoStep from './steps/info-step.svelte';
    import MapStep from './steps/map-step.svelte';
    import TimeStep from './steps/time-step.svelte';

    let reportModal: HTMLDialogElement | null = null;
    let step = 1;
    let reportNotes = '';
    let selectedLocation: { lng: number; lat: number } | null = null;
    let selectedTime: '-1' | '-5' | '-15' | null = '-1';

    const initialCenter = { lng: 137, lat: 36 };
    const initialZoom = 3.5;

    // refs to call validate()
    let mapStepRef: any = null;
    let timeStepRef: any = null;

    function openReport() {
        step = 1;
        reportNotes = '';
        selectedLocation = null;
        selectedTime = '-1';
        reportModal?.showModal();
    }

    async function nextStep() {
        if (step === 2) {
            const res = mapStepRef?.validate?.();
            if (!res || !res.valid) return;
        }
        step = Math.min(3, step + 1);
    }

    function prevStep() {
        step = Math.max(1, step - 1);
    }

    function submitReport() {
        // final defensive validation
        if (step !== 3) return;
        const timeRes = timeStepRef?.validate?.();
        if (!timeRes || !timeRes.valid) return;

        const payload = {
            notes: reportNotes,
            timeOffsetMinutes: parseInt(String(selectedTime), 10),
            location: selectedLocation,
            timestamp: new Date().toISOString()
        };
        console.log('Submitting report', payload);
        reportModal?.close();
    }
</script>

<dialog bind:this={reportModal} class="modal" aria-label="Report wizard dialog">
    <form class="modal-box w-full max-w-3xl" method="dialog" on:submit|preventDefault>
        <div class="flex items-start justify-between">
            <h3 class="text-lg font-bold">Report a bang</h3>
            <button type="button" class="btn btn-ghost btn-sm" on:click={() => reportModal?.close()}>✕</button>
        </div>

        <div class="mt-4 mb-2">
            <ul class="steps steps-sm">
                <li class={`step ${step === 1 ? 'step-primary' : step > 1 ? 'step-success' : ''}`}>Info</li>
                <li class={`step ${step === 2 ? 'step-primary' : step > 2 ? 'step-success' : ''}`}>Map</li>
                <li class={`step ${step === 3 ? 'step-primary' : ''}`}>When</li>
            </ul>
        </div>

        {#if step === 1}
            <InfoStep />
        {:else if step === 2}
            <MapStep bind:this={mapStepRef} bind:selectedLocation center={initialCenter} zoom={initialZoom} on:change={(e) => selectedLocation = e.detail} />
        {:else}
            <TimeStep bind:this={timeStepRef} bind:selectedTime />
        {/if}

        <div class="modal-action mt-6">
            {#if step > 1}
                <button type="button" class="btn" on:click={prevStep}>Back</button>
            {/if}

            {#if step < 3}
                <button type="button" class="btn btn-primary" on:click={nextStep}>Next</button>
            {:else}
                <button type="button" class="btn btn-primary" on:click={submitReport}>Submit report</button>
            {/if}

            <button type="button" class="btn btn-ghost" on:click={() => reportModal?.close()}>Cancel</button>
        </div>
    </form>
</dialog>