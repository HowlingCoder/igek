<script lang="ts">
	import LocationGuard from '../location-guard/location-guard.svelte';
	import InfoStep from './steps/info-step.svelte';
	import MapStep from './steps/map-step.svelte';
	import TimeStep from './steps/time-step.svelte';

	import {
		openReport as openWizard,
		selectedLocation,
		step,
		nextStep as wizardNext,
		prevStep as wizardPrev,
		submitReport as wizardSubmit
	} from '$lib/services/reportWizard';

	let reportModal: HTMLDialogElement | null = $state(null);

	// preserve previous API: export openReport() will open dialog and reset wizard
	export function openReport() {
		openWizard();
		reportModal?.showModal();
	}

	function nextStep() {
		if ($step === 2) {
			// basic validation: ensure a location is selected
			if (!$selectedLocation) return;
		}
		wizardNext();
	}

	function prevStep() {
		wizardPrev();
	}

	function submitReport(event?: Event) {
		event?.preventDefault?.();
		const payload = wizardSubmit();
		if (!payload) return;
		console.log('Submitting report', payload);
		reportModal?.close();
	}
</script>

<dialog bind:this={reportModal} class="modal" aria-label="Report wizard dialog">
	<form
		class="modal-box w-full h-full max-w-3xl flex flex-col"
		method="dialog"
		onsubmit={submitReport}
	>
		<div class="flex items-start justify-between">
			<h3 class="text-lg font-bold">Knall melden</h3>
			<button type="button" class="btn btn-ghost btn-sm" onclick={() => reportModal?.close()}
				>✕</button
			>
		</div>

		<div class="mt-4 mb-2">
			<ul class="steps w-full">
				<li class={`step ${$step === 1 ? 'step-primary' : $step > 1 ? 'step-success' : ''}`}>Info</li>
				<li class={`step ${$step === 2 ? 'step-primary' : $step > 2 ? 'step-success' : ''}`}>Wo?</li>
				<li class={`step ${$step === 3 ? 'step-primary' : ''}`}>Wann?</li>
			</ul>
		</div>

		<div class="divider my-0"></div>
		<div class="flex flex-1">
			{#if $step === 1}
				<InfoStep />
			{:else if $step === 2}
				<LocationGuard>
					<MapStep />
				</LocationGuard>
			{:else}
				<TimeStep />
			{/if}
		</div>
		<div class="divider my-0"></div>
		<div class="modal-action mt-6">
				{#if $step > 1}
					<button type="button" class="btn" onclick={prevStep}>Zurück</button>
				{/if}

				{#if $step < 3}
					<button type="button" class="btn btn-primary" onclick={nextStep}>Weiter</button>
				{:else}
					<button type="button" class="btn btn-primary" onclick={submitReport}>Abschicken</button>
				{/if}
		</div>
	</form>
</dialog>
