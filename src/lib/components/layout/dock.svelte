<script lang="ts">
	import { page } from '$app/state';
	import { IconHome, IconMapPin, IconHelpCircle } from '@tabler/icons-svelte';
</script>

<div class="dock">
	<!-- Start (root) -->
	<a href="/" class="dock-btn" class:dock-active={page.url.pathname === '/'}>
		<IconHome class="size-[1.2em]" />
		<span class="dock-label">Start</span>
	</a>

	<!-- Meldungen -->
	<a href="/reports" class="dock-btn" class:dock-active={page.url.pathname === '/reports'}>
		<IconMapPin class="size-[1.2em]" />
		<span class="dock-label">Meldungen</span>
	</a>

	<!-- Hilfe -->
	<a href="/help" class="dock-btn" class:dock-active={page.url.pathname === '/help'}>
		<IconHelpCircle class="size-[1.2em]" />
		<span class="dock-label">Hilfe</span>
	</a>
</div>
