<script lang="ts" >
	import LocationGuard from '$lib/components/location-guard/location-guard.svelte';
	import ReportModal from '$lib/components/report-modal/report-modal.svelte';

	let reportModalRef: any = null;
	let showSuccessMessage = $state(false);

	function openReport() {
    console.warn('Opening report modal', reportModalRef, reportModalRef?.openReport);
		reportModalRef?.openReport?.();
	}

	function handleSuccess() {
		showSuccessMessage = true;
		setTimeout(() => {
			showSuccessMessage = false;
		}, 4000);
	}
</script>

<div class="w-full h-full flex items-center justify-center p-6 bg-base-200">
<div class="flex flex-col i min-h-full ">
	<h1 class="text-3xl font-bold mb-2">Feuerwerks-Meldung</h1>

	<h2 class="text-lg text-base-content/70 mb-6">Melden Sie Störungen schnell und anonym</h2>

	<button class="btn btn-primary " onclick={openReport}> 🔔 Knall melden </button>


	<!-- Erklärung -->
	<p class="text-sm text-base-content/60 max-w-md mt-6">
		Deine Meldung wird anonym gespeichert und hilft, Hotspots zu erkennen. Öffentliche Daten sind nur
		aggregiert sichtbar, um Missbrauch zu verhindern.
	</p>
</div>
</div>

{#if showSuccessMessage}
	<div class="toast toast-top toast-center z-50">
		<div role="alert" class="alert alert-success">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>Meldung erfolgreich abgeschickt! Vielen Dank.</span>
		</div>
	</div>
{/if}

<ReportModal bind:this={reportModalRef} onSuccess={handleSuccess} />
