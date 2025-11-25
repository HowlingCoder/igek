<script>
  import { IconClock, IconMapPin } from '@tabler/icons-svelte';
</script>

<div class="flex flex-col min-h-full mx-auto mt-3">
  <h2 class="text-lg text-base-content/70">Danke!</h2>

  <div class="mt-6 flex items-start gap-3 max-w-lg ">
    <IconMapPin class="w-6 h-6 text-primary shrink-0 mt-1" size={24} />

    <div class="flex-1 ">
      <p class="text-sm text-base-content/60">
        Im folgenden kannst du einen Ort in deiner Umgebung auswählen, von dem du glaubst, dass der Knall dort seinen Ursprung hat. Eine ungefähre Angabe reicht aus.

      </p>
      <p class="mt-3 italic text-sm text-base-content/40">Tipp: Du kannst die Karte verschieben und zoomen, um den genauen Ort auszuwählen.</p>
    </div>
  </div>

  <div class="mt-6 flex items-start gap-3 max-w-lg ">
    <IconClock class="w-6 h-6 text-primary shrink-0 mt-1" size={24} />

    <p class="flex-1 text-sm text-base-content/60 ">Anschließend sagst du uns noch, wann der Knall war, damit wir dies auch zeitlich zuordnen können.</p>
  </div>

  <div class="mt-6 max-w-lg  p-3 bg-base-200 text-base-content/70 rounded-md">
    <div class="font-semibold">Hinweis</div>
    <div class="mt-1 text-sm text-base-content/60">
      <p class="mt-2">Deine Meldung wird auf der Übersichtkarte nur indirekt angezeigt. Wenn mehrere Meldungen aus einer Region eingehen, wird dies als Hotspot markiert, um Missbrauch zu verhindern.</p>
    </div>
  </div>

</div>