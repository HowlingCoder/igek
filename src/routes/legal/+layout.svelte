<script lang="ts">
	let { children } = $props();
</script>

<div class="min-h-screen bg-base-100">
	<div class="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto p-6">
	

		<!-- Main Content -->
		<main class="flex-1 prose prose-sm max-w-none">
			{@render children()}
		</main>
	</div>
</div>

