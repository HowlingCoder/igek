<script lang="ts">
	import AlertCircle from '@tabler/icons-svelte/icons/alert-circle';
	import ExclamationMark from '@tabler/icons-svelte/icons/exclamation-mark';

	import {
		detectedLocation,
		ensureLocationPermission,
		permissionStatus
	} from '$lib/services/locationService';
	import { selectedLocation, setDetectedLocation } from '$lib/services/reportWizard';
	import { isWithinFrankfurtBoundary } from '$lib/services/frankfurtBoundary';

	let { children } = $props();

	let showAlerts = $state(false);

	$effect(() => {
		showAlerts = false;
		ensureLocationPermission();
		const timer = setTimeout(() => {
			showAlerts = true;
		}, 800);
		return () => clearTimeout(timer);
	});

	$effect(() => {
		if ($detectedLocation && isWithinFrankfurtBoundary($detectedLocation) && !$selectedLocation) {
			setDetectedLocation({ latitude: $detectedLocation.lat, longitude: $detectedLocation.lng });
		}
	});

	function handleRetry() {
		ensureLocationPermission(true);
	}
</script>

{#if $permissionStatus === 'granted'}
	<div class="flex flex-col flex-1 min-h-0 w-full">
		{@render children?.()}
	</div>
{:else if $permissionStatus === 'checking' || !showAlerts}
	<div class="flex items-center justify-center py-4">
		<span class="loading loading-spinner"></span>
	</div>
{:else if $permissionStatus === 'denied'}
	<div role="alert" class="alert alert-warning">
		<AlertCircle />
		<div>
			<h3 class="font-bold">Standortberechtigung erforderlich</h3>
			<div class="text-xs">
				Standortberechtigung verweigert. Bitte aktivieren Sie den Standortzugriff in Ihren Browsereinstellungen, um die Karte zu verwenden.
			</div>
		</div>
		<button class="btn btn-sm btn-ghost" onclick={handleRetry}>Erneut versuchen</button>
	</div>
{:else}
	<div role="alert" class="alert alert-error">
		<ExclamationMark />
		<div>
			<h3 class="font-bold">Standort kann nicht abgerufen werden</h3>
			<div class="text-xs">
				Standort konnte nicht abgerufen werden. Bitte versuchen Sie es erneut oder überprüfen Sie Ihre Browsereinstellungen.
			</div>
		</div>
		<button class="btn btn-sm btn-ghost" onclick={handleRetry}>Erneut versuchen</button>
	</div>
{/if}
