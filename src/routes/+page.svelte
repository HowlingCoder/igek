<script lang="ts" >
	import LocationGuard from '$lib/components/location-guard/location-guard.svelte';
	import ReportModal from '$lib/components/report-modal/report-modal.svelte';

	let reportModalRef: any = null;

	function openReport() {
    console.warn('Opening report modal', reportModalRef, reportModalRef?.openReport);
		reportModalRef?.openReport?.();
	}
</script>

<div class="w-full h-full flex items-center justify-center p-6 bg-base-200">
<div class="flex flex-col i min-h-full ">
	<h1 class="text-3xl font-bold mb-2">Feuerwerks-Meldung</h1>

	<h2 class="text-lg text-base-content/70 mb-6">Melden Sie Störungen schnell und anonym</h2>

<LocationGuard>
	<button class="btn btn-primary " onclick={openReport}> 🔔 Knall melden </button>
</LocationGuard>

	<!-- Erklärung -->
	<p class="text-sm text-base-content/60 max-w-md mt-6">
		Ihre Meldung wird anonym gespeichert und hilft, Hotspots zu erkennen. Öffentliche Daten sind nur
		aggregiert sichtbar, um Missbrauch zu verhindern.
	</p>
</div>
</div>

<ReportModal  bind:this={reportModalRef}/>
