<script lang="ts">
	import { t } from '$lib/translations/translations';
</script>

<div class="w-full min-h-screen flex justify-center p-6 bg-base-200">
	<div class="flex flex-col w-full max-w-4xl">
		<h1 class="text-3xl font-bold mb-4">{$t('help.title')}</h1>
		<p class="text-base-content/70 mb-8">{$t('help.description')}</p>

		<div class="space-y-6">
			<div>
				<h2 class="text-2xl font-bold mb-4">{$t('help.categories.general.title')}</h2>
				<div class="space-y-2">
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.general.questions.what_is.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.general.questions.what_is.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.general.questions.who_can_use.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.general.questions.who_can_use.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.general.questions.cost.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.general.questions.cost.a')}</p>
						</div>
					</details>
				</div>
			</div>

			<div>
				<h2 class="text-2xl font-bold mb-4">{$t('help.categories.privacy.title')}</h2>
				<div class="space-y-2">
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.privacy.questions.anonymous.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.privacy.questions.anonymous.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.privacy.questions.device_id.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.privacy.questions.device_id.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.privacy.questions.location_data.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.privacy.questions.location_data.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.privacy.questions.data_usage.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.privacy.questions.data_usage.a')}</p>
						</div>
					</details>
				</div>
			</div>

			<div>
				<h2 class="text-2xl font-bold mb-4">{$t('help.categories.reporting.title')}</h2>
				<div class="space-y-2">
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.reporting.questions.how_to_report.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.reporting.questions.how_to_report.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.reporting.questions.when_to_report.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.reporting.questions.when_to_report.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.reporting.questions.multiple_reports.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.reporting.questions.multiple_reports.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.reporting.questions.outside_frankfurt.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.reporting.questions.outside_frankfurt.a')}</p>
						</div>
					</details>
				</div>
			</div>

			<div>
				<h2 class="text-2xl font-bold mb-4">{$t('help.categories.map.title')}</h2>
				<div class="space-y-2">
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.map.questions.what_are_clusters.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.map.questions.what_are_clusters.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.map.questions.why_clusters.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.map.questions.why_clusters.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.map.questions.accuracy.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.map.questions.accuracy.a')}</p>
						</div>
					</details>
				</div>
			</div>

			<div class="bg-warning/10 border border-warning p-6 rounded-lg">
				<h2 class="text-2xl font-bold mb-4 text-warning">{$t('help.categories.actions.title')}</h2>
				<div class="space-y-2">
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.actions.questions.what_happens.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.actions.questions.what_happens.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.actions.questions.immediate_action.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p class="font-semibold text-warning mb-2">
								{$t('help.categories.actions.questions.immediate_action.a')}
							</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.actions.questions.vigilante.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p class="font-semibold text-error">
								{$t('help.categories.actions.questions.vigilante.a')}
							</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.actions.questions.police.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.actions.questions.police.a')}</p>
						</div>
					</details>
				</div>
			</div>

			<div>
				<h2 class="text-2xl font-bold mb-4">{$t('help.categories.technical.title')}</h2>
				<div class="space-y-2">
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.technical.questions.browsers.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.technical.questions.browsers.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.technical.questions.location_permission.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.technical.questions.location_permission.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.technical.questions.offline.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.technical.questions.offline.a')}</p>
						</div>
					</details>
					<details class="collapse collapse-arrow bg-base-100 border border-base-300">
						<summary class="collapse-title font-semibold">
							{$t('help.categories.technical.questions.problems.q')}
						</summary>
						<div class="collapse-content text-sm">
							<p>{$t('help.categories.technical.questions.problems.a')}</p>
						</div>
					</details>
				</div>
			</div>
		</div>
	</div>
</div>
