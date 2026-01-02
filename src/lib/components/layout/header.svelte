<script>
	import { APP_VERSION } from '$lib/version';

	function closeMenu(e) {
		const details = e.target.closest('details');
		if (details) {
			details.removeAttribute('open');
		}
	}
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="navbar-start">
		<span class="btn btn-ghost text-xl"
			>💥 Knallmelder <span class=" text-xs ms-3 text-base-content/40">Demo v{APP_VERSION}</span
			></span
		>
	</div>

	<div class="navbar-end">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</div>
			<ul
				tabindex="-1"
				class="menu menu-sm dropdown-content z-1 mt-3 p-2 shadow w-full legal-menu bg-base-300 rounded-t-none legal-menu" 
			>
				<li><a href="/legal/privacy">Datenschutzerklärung</a></li>
				<li><a href="/legal/imprint" onclick={closeMenu}>Impressum</a></li>
			</ul>
		</div>
	</div>
</div>

<style>
	.legal-menu {
		z-index: 50;
		position: fixed;
		right: 0;
		left: 0;

		li {
			a {
				padding-left: 1.5rem;
				padding-top: 1.5rem;
				padding-bottom: 1.5rem;
			}
		}
	}
</style>
