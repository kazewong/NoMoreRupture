<script lang="ts">
	import './layout.css';
	import { animate } from 'animejs';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/Navbar.svelte';
	import { auth } from '$lib/state/auth.svelte';
	import { theme } from '$lib/state/theme.svelte';

	let { children } = $props();

	let main = $state<HTMLElement>();

	// Sync theme with the pre-paint script and load the current session once.
	$effect(() => {
		theme.init();
		auth.refresh();
	});

	// Subtle fade/slide-in on each navigation (skipped if the user prefers
	// reduced motion). Reading the pathname re-runs this on every route change.
	$effect(() => {
		// Reading the pathname registers it as a dependency so this re-runs on nav.
		const pathname = page.url.pathname;
		if (!main || !pathname || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		animate(main, { opacity: [0, 1], y: [8, 0], duration: 380, ease: 'out(3)' });
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col bg-base-200">
	<Navbar />
	<main class="flex-1" bind:this={main}>
		{@render children()}
	</main>
</div>
