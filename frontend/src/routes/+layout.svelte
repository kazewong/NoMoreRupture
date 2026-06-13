<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/Navbar.svelte';
	import { auth } from '$lib/state/auth.svelte';
	import { theme } from '$lib/state/theme.svelte';

	let { children } = $props();

	// Sync theme with the pre-paint script and load the current session once.
	$effect(() => {
		theme.init();
		auth.refresh();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col bg-base-200">
	<Navbar />
	<main class="flex-1">
		{@render children()}
	</main>
</div>
