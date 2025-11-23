<script lang="ts">
        let reportModalRef: any = null;

    function openReport() {
        reportModalRef?.openReport?.();
    }

</script>
<div class="flex flex-col i min-h-full bg-base-200 p-6">
  <h1 class="text-3xl font-bold mb-2">Feuerwerks-Meldung</h1>
  
  <h2 class="text-lg text-base-content/70 mb-6">
    Melden Sie Störungen schnell und anonym
  </h2>

    <button class="btn btn-primary mb-4" on:click={openReport}>
    🔔 Knall melden
  </button>

  <!-- Erklärung -->
  <p class="text-sm text-base-content/60 max-w-md">
    Ihre Meldung wird anonym gespeichert und hilft, Hotspots zu erkennen. 
    Öffentliche Daten sind nur aggregiert sichtbar, um Missbrauch zu verhindern.
  </p>
</div>
