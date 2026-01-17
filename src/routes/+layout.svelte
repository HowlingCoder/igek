<script lang="ts">
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';
	import Dock from '$lib/components/layout/dock.svelte';
	import Header from '$lib/components/layout/header.svelte';
	import { loading, loadTranslations, locale } from '$lib/translations/translations';

	import '../app.css';

    let { children, data } = $props();
    
    let dbConnected = $derived(data?.dbConnected ?? true);
    let initialLoad = $state(true);
    
    // Ensure locale is always set to German
    $effect(() => {
        if ($page.url.pathname) {
            locale.set('de');
            loadTranslations('de', $page.url.pathname);
        }
    });
    
    $effect(() => {
        if (!$loading && initialLoad) {
            initialLoad = false;
        }
    });
</script>

<svelte:head>
	<link rel="icon" href={favicon} /><meta
		name="viewport"
		content="width=device-width, initial-scale=1"
	/>
</svelte:head>

{#if $loading && initialLoad}
	<div class="flex items-center justify-center h-screen">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else if !dbConnected}
	<div class="flex items-center justify-center h-screen bg-base-200">
		<div role="alert" class="alert alert-error max-w-md mx-4">
			<svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<div>
				<h3 class="font-bold">Datenbankverbindung fehlgeschlagen</h3>
				<div class="text-xs mt-2">
					Die Verbindung zur Datenbank konnte nicht hergestellt werden.
					<br />
					Bitte überprüfen Sie:
					<ul class="list-disc list-inside mt-2 space-y-1">
						<li>Ob der SSH-Tunnel aktiv ist (<code class="bg-base-300 px-1 rounded">npm run tunnel</code>)</li>
						<li>Ob die Datenbank läuft</li>
						<li>Ob die DATABASE_URL korrekt konfiguriert ist</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="flex flex-col h-screen">
		<div class="flex-none">
			<Header />
		</div>

		<main class="flex-1 overflow-y-auto" style="max-height: calc(100vh - 130px);">
			{@render children()}
		</main>

		<div class="flex-none">
			<Dock />
		</div>
	</div>
{/if}
