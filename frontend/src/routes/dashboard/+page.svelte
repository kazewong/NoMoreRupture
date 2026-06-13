<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { api, ApiError } from '$lib/api/client';
	import type { AggregateStats } from '$lib/types';

	let stats = $state<AggregateStats | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	async function load() {
		loading = true;
		error = null;
		try {
			stats = await api.stats.aggregate();
		} catch (e) {
			error = e instanceof ApiError ? e.message : 'Failed to load statistics.';
		} finally {
			loading = false;
		}
	}

	onMount(load);
</script>

<svelte:head>
	<title>Dashboard — NoMoreRupture</title>
</svelte:head>

<div class="mx-auto max-w-6xl p-6">
	<header class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold">Dashboard</h1>
		<a href={resolve('/log')} class="btn btn-primary">Log New Data</a>
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
		<div class="stats mb-8 w-full shadow">
			<div class="stat">
				<div class="stat-title">Athletes tracked</div>
				<div class="stat-value text-primary">{stats.totalAthletes}</div>
			</div>
			<div class="stat">
				<div class="stat-title">Tests measured</div>
				<div class="stat-value">{stats.performanceAverages.length}</div>
			</div>
		</div>

		<section class="mb-10">
			<h2 class="mb-4 text-xl font-semibold">Performance averages (cohort)</h2>
			{#if stats.performanceAverages.length === 0}
				<p class="text-base-content/60">No measurements yet. Be the first to contribute.</p>
			{:else}
				<div class="grid gap-4 md:grid-cols-3">
					{#each stats.performanceAverages as metric (metric.event)}
						<div class="card bg-base-100 shadow">
							<div class="card-body">
								<p class="text-sm text-base-content/60">{metric.label}</p>
								<p class="text-3xl font-bold">
									{metric.average}<span class="ml-1 text-lg text-base-content/60"
										>{metric.unit}</span
									>
								</p>
								<p class="text-xs text-base-content/40">N = {metric.sampleSize}</p>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<section class="mb-10">
			<h2 class="mb-4 text-xl font-semibold">Injury trends</h2>
			{#if stats.injuryTrends.length === 0}
				<p class="text-base-content/60">No injury reports recorded yet.</p>
			{:else}
				<div class="overflow-x-auto rounded-box bg-base-100 shadow">
					<table class="table">
						<thead>
							<tr><th>Period</th><th>Body area</th><th class="text-right">Count</th></tr>
						</thead>
						<tbody>
							{#each stats.injuryTrends as point, i (i)}
								<tr>
									<td>{point.period}</td>
									<td class="capitalize">{point.bodyArea}</td>
									<td class="text-right">{point.count}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</section>

		{#if stats.correlations.length > 0}
			<section>
				<h2 class="mb-4 text-xl font-semibold">Correlation insights</h2>
				<div class="grid gap-4 md:grid-cols-2">
					{#each stats.correlations as insight (insight.title)}
						<div class="card bg-base-100 shadow">
							<div class="card-body">
								<h3 class="card-title text-base">{insight.title}</h3>
								<p class="text-sm text-base-content/70">{insight.description}</p>
								<!-- TODO: render a scatter/line chart of insight.points once a charting lib is chosen. -->
								<div
									class="mt-2 flex h-40 items-center justify-center rounded-box border border-dashed border-base-300 text-sm text-base-content/40"
								>
									Chart: {insight.xLabel} vs {insight.yLabel} ({insight.points.length} points)
								</div>
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>
