<script lang="ts">
	import { selectedTime, setTime } from '$lib/services/reportWizard';

	let timeOffset = $state(0);
	const options = [
		{ value: 0, label: 'Jetzt' },
		{ value: 1, label: 'Vor 1 Minute' },
		{ value: 5, label: 'Vor 5 Minuten' },
		{ value: 10, label: 'Vor 10 Minuten' }
	];

	// sync store -> local (like in map-step)
	$effect(() => {
		if ($selectedTime !== timeOffset) {
			timeOffset = $selectedTime ?? 0;
		}
	});

</script>

<div class="flex flex-col min-h-full mx-auto mt-3">
	<h2 class="text-lg text-base-content/70">Wann hast du den Knall gehört?</h2>

	<div class="grid grid-cols-1 gap-3 mt-6">
		{#each options as opt}
			<label class={timeOffset === opt.value ? 'btn btn-primary flex items-center justify-center gap-2' : 'btn btn-outline flex items-center justify-center gap-2'}>
				<input type="radio" name="time-step" value={opt.value} class="hidden" bind:group={timeOffset} onchange={() => setTime(opt.value)} />
				{opt.label}
			</label>
		{/each}
	</div>

	<div class="mt-6 max-w-lg p-3 bg-base-200 text-base-content/70 rounded-md">
		<div class="font-semibold">Hinweis</div>
		<div class="mt-1 text-sm text-base-content/60">
			<p class="mt-2">
				Denk bitte daran, dass deine Meldung nicht älter als 15 Minuten sein sollte, um die
				Genauigkeit der Daten zu gewährleisten.
			</p>
		</div>
	</div>
</div>
