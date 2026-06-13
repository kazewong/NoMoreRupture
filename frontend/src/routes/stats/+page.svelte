<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { api, ApiError } from '$lib/api/client';
	import { auth } from '$lib/state/auth.svelte';
	import type { PublicStats } from '$lib/types';

	let stats = $state<PublicStats | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	const updatedLabel = $derived(stats ? new Date(stats.updatedAt).toLocaleString() : '');
	const topArea = $derived(
		stats && stats.injuriesByArea.length > 0
			? [...stats.injuriesByArea].sort((a, b) => b.count - a.count)[0]
			: null
	);
	const maxAreaCount = $derived(
		stats ? Math.max(1, ...stats.injuriesByArea.map((a) => a.count)) : 1
	);

	async function load() {
		loading = true;
		error = null;
		try {
			stats = await api.stats.public();
		} catch (e) {
			error = e instanceof ApiError ? e.message : 'Failed to load statistics.';
		} finally {
			loading = false;
		}
	}

	onMount(load);
</script>

<svelte:head>
	<title>Live statistics — NoMoreRupture</title>
</svelte:head>

<div class="mx-auto max-w-5xl p-6">
	<header class="mb-8">
		<h1 class="text-3xl font-bold">Live statistics</h1>
		<p class="text-base-content/60">
			A real-time, anonymized snapshot of what the community has contributed so far. No account
			needed — these numbers are public on purpose.
		</p>
	</header>

	{#if loading}
		<div class="flex justify-center py-20">
			<span class="loading loading-lg loading-spinner text-primary"></span>
		</div>
	{:else if error}
		<div role="alert" class="alert alert-error">
			<span>{error}</span>
			<button class="btn btn-sm" onclick={load}>Retry</button>
		</div>
	{:else if stats}
		<div class="stats mb-8 w-full shadow max-sm:stats-vertical">
			<div class="stat">
				<div class="stat-title">Athletes signed up</div>
				<div class="stat-value text-primary">{stats.totalAthletes.toLocaleString()}</div>
				<div class="stat-desc">contributing to the dataset</div>
			</div>
			<div class="stat">
				<div class="stat-title">Measurements logged</div>
				<div class="stat-value">{stats.totalMeasurements.toLocaleString()}</div>
				<div class="stat-desc">performance-test entries</div>
			</div>
			<div class="stat">
				<div class="stat-title">Injuries reported</div>
				<div class="stat-value text-secondary">{stats.totalInjuries.toLocaleString()}</div>
				<div class="stat-desc">
					{#if topArea}most common: <span class="capitalize">{topArea.bodyArea}</span>{:else}none
						yet{/if}
				</div>
			</div>
		</div>

		<section class="mb-8">
			<h2 class="mb-4 text-xl font-semibold">Injuries by body area</h2>
			{#if stats.injuriesByArea.length === 0}
				<div class="card bg-base-100 shadow">
					<div class="card-body items-center text-center text-base-content/60">
						No injuries have been reported yet. 🤞
					</div>
				</div>
			{:else}
				<div class="card bg-base-100 shadow">
					<div class="card-body gap-3">
						{#each stats.injuriesByArea as area (area.bodyArea)}
							<div class="flex items-center gap-3">
								<span class="w-24 shrink-0 text-sm capitalize">{area.bodyArea}</span>
								<progress
									class="progress flex-1 progress-secondary"
									value={area.count}
									max={maxAreaCount}
								></progress>
								<span class="w-10 shrink-0 text-right text-sm tabular-nums">{area.count}</span>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</section>

		<div class="flex flex-wrap items-center justify-between gap-2">
			<p class="text-xs text-base-content/50">Last updated {updatedLabel}</p>
			{#if !auth.isAuthenticated}
				<a href={resolve('/login')} class="btn btn-sm btn-primary">Contribute your data</a>
			{/if}
		</div>
	{/if}
</div>
