<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header  from '$lib/components/layout/header.svelte'
	import Dock from '$lib/components/layout/dock.svelte'

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="viewport-fit=cover">
</svelte:head>

<Header></Header>
{@render children()}

<Dock></Dock>
