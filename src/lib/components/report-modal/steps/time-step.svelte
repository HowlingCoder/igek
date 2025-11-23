<script lang="ts">
    interface Props {
        selectedTime?: '-1' | '-5' | '-15' | null;
    }

    let { selectedTime = $bindable(null) }: Props = $props();
    let error = $state('');

    function validate() {
        if (!selectedTime) {
            error = 'Please choose when you heard the bang.';
            return { valid: false, error };
        }
        error = '';
        return { valid: true };
    }
</script>

<div class="space-y-4">
    {#if error}
        <div role="alert" class="alert alert-error">
            <div>{error}</div>
        </div>
    {/if}

    <p class="text-sm text-base-content/80">How long ago did you hear the bang?</p>

    <div class="grid grid-cols-3 gap-3">
        <label class="btn btn-outline flex items-center justify-center gap-2" class:selected={selectedTime === '-1'}>
            <input type="radio" name="time-step" value="-1" class="hidden" bind:group={selectedTime} />
            -1 min
        </label>

        <label class="btn btn-outline flex items-center justify-center gap-2" class:selected={selectedTime === '-5'}>
            <input type="radio" name="time-step" value="-5" class="hidden" bind:group={selectedTime} />
            -5 min
        </label>

        <label class="btn btn-outline flex items-center justify-center gap-2" class:selected={selectedTime === '-15'}>
            <input type="radio" name="time-step" value="-15" class="hidden" bind:group={selectedTime} />
            -15 min
        </label>
    </div>
</div>

<style>
    label.btn.selected { @apply btn-primary; }
</style>