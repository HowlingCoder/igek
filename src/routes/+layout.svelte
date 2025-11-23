<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header  from '$lib/components/layout/header.svelte'
	import Dock from '$lib/components/layout/dock.svelte'

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} /><meta name="viewport" content="width=device-width, initial-scale=1">

</svelte:head>

<div class="flex flex-col h-screen">
  <Header class="flex-none" />

  <main class="flex-1 overflow-y-auto">
    {@render children()}
  </main>

  <Dock class="flex-none" />
</div>
