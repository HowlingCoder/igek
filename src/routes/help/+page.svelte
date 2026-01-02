<script lang="ts">
	import { t } from '$lib/translations/translations';

</script>

<div class="w-full h-full flex items-center justify-center p-6 bg-base-200">
	<div class="flex flex-col i min-h-full">
		<h1 class="text-3xl font-bold mb-2">{$t('help.title')}</h1>

		<h2  class="text-1xl font-bold my-2">Category</h2>
		<details class="collapse bg-base-100 border border-base-300" name="my-accordion-det-1" open>
  <summary class="collapse-title font-semibold">How do I create an account?</summary>
  <div class="collapse-content text-sm">Click the "Sign Up" button in the top right corner and follow the registration process.</div>
</details>
<details class="collapse bg-base-100 border border-base-300" name="my-accordion-det-1">
  <summary class="collapse-title font-semibold">I forgot my password. What should I do?</summary>
  <div class="collapse-content text-sm">Click on "Forgot Password" on the login page and follow the instructions sent to your email.</div>
</details>
<details class="collapse bg-base-100 border border-base-300" name="my-accordion-det-1">
  <summary class="collapse-title font-semibold">How do I update my profile information?</summary>
  <div class="collapse-content text-sm">Go to "My Account" settings and select "Edit Profile" to make changes.</div>
</details>
	</div>
</div>

