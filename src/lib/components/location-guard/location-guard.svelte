<script lang="ts">
	import AlertCircle from '@tabler/icons-svelte/icons/alert-circle';
	import ExclamationMark from '@tabler/icons-svelte/icons/exclamation-mark';

	type LocationStatus = 'checking' | 'granted' | 'denied' | 'error';

	interface LocationData {
		latitude: number;
		longitude: number;
	}

	import {
		detectedLocation,
		ensureLocationPermission,
		permissionStatus
	} from '$lib/services/locationService';
	import { selectedLocation, setDetectedLocation } from '$lib/services/reportWizard';

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
		if ($detectedLocation && !$selectedLocation) {
			setDetectedLocation({ latitude: $detectedLocation.lat, longitude: $detectedLocation.lng });
		}
	});

	function handleRetry() {
		// force a re-request
		ensureLocationPermission(true);
	}
</script>

{#if $permissionStatus === 'granted'}
	{@render children?.()}
{:else if $permissionStatus === 'checking' || !showAlerts}
	<div class="">
		<span class="loading loading-spinner"></span>
	</div>
{:else if $permissionStatus === 'denied'}
	<div role="alert" class="alert alert-warning">
		<AlertCircle></AlertCircle>
		<div>
			<h3 class="font-bold">Location Permission Required</h3>
			<div class="text-xs">
				Location permission denied. Please enable location access in your browser settings.
			</div>
		</div>
		<button class="btn btn-sm btn-ghost" onclick={handleRetry}>Retry</button>
	</div>
{:else}
	<div role="alert" class="alert alert-error">
		<ExclamationMark></ExclamationMark>
		<div>
			<h3 class="font-bold">Unable to Access Location</h3>
			<div class="text-xs">
				Unable to request location — please try again or check browser settings.
			</div>
		</div>
		<button class="btn btn-sm btn-ghost" onclick={handleRetry}>Retry</button>
	</div>
{/if}
