<script lang="ts">

	async function sendReport() {
		const deviceId = localStorage.getItem('deviceId') || crypto.randomUUID();
		localStorage.setItem('deviceId', deviceId);

		navigator.geolocation.getCurrentPosition(async (pos) => {
			const body = {
				deviceId,
				latitude: pos.coords.latitude,
				longitude: pos.coords.longitude
			};

			await fetch('/api/reports', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body)
			});
		});
	}
</script>
<div role="alert" class="alert alert-error">

	<span>Error! Task failed successfully.</span>
</div>
<button class="btn" onclick={sendReport}>Knall melden</button>
