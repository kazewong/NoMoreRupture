<script lang="ts">
	import { resolve } from '$app/paths';
	import { auth } from '$lib/state/auth.svelte';

	const ctaHref = $derived(resolve(auth.isAuthenticated ? '/log' : '/login'));
	const ctaLabel = $derived(auth.isAuthenticated ? 'Log Your Data' : 'Join the Effort');
</script>

<svelte:head>
	<title>NoMoreRupture — predicting acute tendon injury</title>
</svelte:head>

<section class="hero py-16">
	<div class="hero-content max-w-3xl flex-col text-center">
		<h1 class="text-5xl font-extrabold">No more rupture.</h1>
		<p class="py-4 text-lg text-base-content/70">
			A volunteer-driven effort to predict acute lower-extremity injuries — like Achilles ruptures —
			before they happen, by tracking how athletes' strength evolves over time.
		</p>
		<div class="flex flex-wrap justify-center gap-3">
			<a href={ctaHref} class="btn btn-lg btn-primary">{ctaLabel}</a>
			<a href={resolve('/stats')} class="btn btn-ghost btn-lg">See live statistics</a>
		</div>
		<p class="pt-2 text-sm text-base-content/50">
			Non-commercial. Privacy-first. Identifying details are always optional.
		</p>
	</div>
</section>

<section class="mx-auto grid max-w-5xl gap-6 px-4 pb-16 md:grid-cols-3">
	<div class="card bg-base-100 shadow-md">
		<div class="card-body">
			<h2 class="card-title">The problem</h2>
			<p class="text-base-content/70">
				Tendons have few nerves — like hair, you feel nothing until it breaks. By then it's too
				late.
			</p>
		</div>
	</div>
	<div class="card bg-base-100 shadow-md">
		<div class="card-body">
			<h2 class="card-title">The idea</h2>
			<p class="text-base-content/70">
				Model training statistically. With enough strength data over time, patterns that precede
				injury may become visible.
			</p>
		</div>
	</div>
	<div class="card bg-base-100 shadow-md">
		<div class="card-body">
			<h2 class="card-title">Your part</h2>
			<p class="text-base-content/70">
				Log your testing metrics as you train, and report injuries if they happen. Every data point
				helps.
			</p>
		</div>
	</div>
</section>

<div role="alert" class="mx-auto mb-12 alert max-w-3xl">
	<span class="text-sm">
		This data is collected for research, not medical purposes, and is not a diagnostic tool.
	</span>
</div>
