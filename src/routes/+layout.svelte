<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Dock from '$lib/components/layout/dock.svelte';
	import Header from '$lib/components/layout/header.svelte';
	import { loading } from '$lib/translations/translations';

	import '../app.css';

    let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} /><meta
		name="viewport"
		content="width=device-width, initial-scale=1"
	/>
</svelte:head>

{#if $loading}
	<div class="flex items-center justify-center h-screen">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else}
	<div class="flex flex-col h-screen">
		<Header class="flex-none" />

		<main class="flex-1 overflow-y-auto" style="max-height: calc(100vh - 138px);">
			{@render children()}
		</main>

		<Dock class="flex-none" />
	</div>
{/if}
