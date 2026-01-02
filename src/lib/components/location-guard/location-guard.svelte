<script lang="ts">
	import AlertCircle from '@tabler/icons-svelte/icons/alert-circle';
	import ExclamationMark from '@tabler/icons-svelte/icons/exclamation-mark';
	import MapPinOff from '@tabler/icons-svelte/icons/map-pin-off';

	import {
		detectedLocation,
		ensureLocationPermission,
		permissionStatus
	} from '$lib/services/locationService';
	import { selectedLocation, setDetectedLocation } from '$lib/services/reportWizard';
	import { isWithinFrankfurtBoundary, getDistanceFromFrankfurt, FRANKFURT_RADIUS_KM } from '$lib/services/frankfurtBoundary';

	let { children } = $props();

	let showAlerts = $state(false);
	let isOutsideBoundary = $state(false);
	let distanceKm = $state(0);

	$effect(() => {
		showAlerts = false;
		ensureLocationPermission();
		const timer = setTimeout(() => {
			showAlerts = true;
		}, 800);
		return () => clearTimeout(timer);
	});

	$effect(() => {
		if ($detectedLocation) {
			const withinBoundary = isWithinFrankfurtBoundary($detectedLocation);
			isOutsideBoundary = !withinBoundary;

			if (!withinBoundary) {
				distanceKm = Math.round(getDistanceFromFrankfurt($detectedLocation) * 10) / 10;
			}

			if (withinBoundary && !$selectedLocation) {
				setDetectedLocation({ latitude: $detectedLocation.lat, longitude: $detectedLocation.lng });
			}
		}
	});

	function handleRetry() {
		ensureLocationPermission(true);
	}
</script>

{#if $permissionStatus === 'granted' && !isOutsideBoundary}
	{@render children?.()}
{:else if $permissionStatus === 'checking' || !showAlerts}
	<div class="">
		<span class="loading loading-spinner"></span>
	</div>
{:else if isOutsideBoundary}
	<div role="alert" class="alert alert-warning">
		<MapPinOff />
		<div>
			<h3 class="font-bold">Außerhalb des Frankfurter Stadtgebiets</h3>
			<div class="text-xs">
				Ihr Standort liegt {distanceKm}km vom Stadtzentrum entfernt. Diese App ist nur für Meldungen im Frankfurter Stadtgebiet (innerhalb {FRANKFURT_RADIUS_KM}km Radius) verfügbar. Sie können den Ort auf der Karte manuell auswählen.
			</div>
		</div>
	</div>
	{@render children?.()}
{:else if $permissionStatus === 'denied'}
	<div role="alert" class="alert alert-warning">
		<AlertCircle />
		<div>
			<h3 class="font-bold">Standortberechtigung erforderlich</h3>
			<div class="text-xs">
				Standortberechtigung verweigert. Bitte aktivieren Sie den Standortzugriff in Ihren Browsereinstellungen oder wählen Sie den Ort manuell auf der Karte aus.
			</div>
		</div>
		<button class="btn btn-sm btn-ghost" onclick={handleRetry}>Erneut versuchen</button>
	</div>
	{@render children?.()}
{:else}
	<div role="alert" class="alert alert-error">
		<ExclamationMark />
		<div>
			<h3 class="font-bold">Standort kann nicht abgerufen werden</h3>
			<div class="text-xs">
				Standort konnte nicht abgerufen werden. Bitte versuchen Sie es erneut oder überprüfen Sie Ihre Browsereinstellungen. Sie können auch den Ort manuell auf der Karte auswählen.
			</div>
		</div>
		<button class="btn btn-sm btn-ghost" onclick={handleRetry}>Erneut versuchen</button>
	</div>
	{@render children?.()}
{/if}
