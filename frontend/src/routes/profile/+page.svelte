<script lang="ts">
	import { resolve } from '$app/paths';
	import { auth } from '$lib/state/auth.svelte';
	import type { ActivityLevel, Sex } from '$lib/types';

	const activityLevels: ActivityLevel[] = ['recreational', 'competitive', 'elite'];
	const sexes: Sex[] = ['male', 'female', 'intersex', 'prefer_not_to_say'];

	// Local editable copy seeded from the session. Persisting these to the backend
	// is a TODO once a PATCH /api/v1/profile endpoint exists.
	let displayName = $state('');
	let birthYear = $state<number | null>(null);
	let sex = $state<Sex | null>(null);
	let heightCm = $state<number | null>(null);
	let weightKg = $state<number | null>(null);
	let activityLevel = $state<ActivityLevel | null>(null);
	let primarySport = $state('');

	$effect(() => {
		const u = auth.user;
		if (!u) return;
		displayName = u.displayName ?? '';
		const p = u.profile;
		birthYear = p?.birthYear ?? null;
		sex = p?.sex ?? null;
		heightCm = p?.heightCm ?? null;
		weightKg = p?.weightKg ?? null;
		activityLevel = p?.activityLevel ?? null;
		primarySport = p?.primarySport ?? '';
	});
</script>

<svelte:head>
	<title>Profile — NoMoreRupture</title>
</svelte:head>

<div class="mx-auto max-w-2xl p-6">
	<h1 class="mb-2 text-3xl font-bold">Your profile</h1>
	<p class="mb-6 text-base-content/60">
		Everything here is optional. The more context the model has, the better — but only share what
		you're comfortable with.
	</p>

	{#if auth.loading}
		<div class="flex justify-center py-20">
			<span class="loading loading-lg loading-spinner text-primary"></span>
		</div>
	{:else if !auth.isAuthenticated}
		<div role="alert" class="alert">
			<span>Please <a href={resolve('/login')} class="link">sign in</a> to view your profile.</span>
		</div>
	{:else}
		<div class="card bg-base-100 shadow">
			<div class="card-body gap-4">
				<label class="form-control">
					<span class="label-text mb-1">Display name</span>
					<input type="text" bind:value={displayName} class="input-bordered input" />
				</label>

				<div class="grid gap-4 sm:grid-cols-2">
					<label class="form-control">
						<span class="label-text mb-1">Birth year</span>
						<input type="number" bind:value={birthYear} class="input-bordered input" />
					</label>
					<label class="form-control">
						<span class="label-text mb-1">Sex</span>
						<select bind:value={sex} class="select-bordered select">
							<option value={null}>—</option>
							{#each sexes as s (s)}<option value={s}>{s.replace(/_/g, ' ')}</option>{/each}
						</select>
					</label>
					<label class="form-control">
						<span class="label-text mb-1">Height (cm)</span>
						<input type="number" bind:value={heightCm} class="input-bordered input" />
					</label>
					<label class="form-control">
						<span class="label-text mb-1">Weight (kg)</span>
						<input type="number" bind:value={weightKg} class="input-bordered input" />
					</label>
					<label class="form-control">
						<span class="label-text mb-1">Activity level</span>
						<select bind:value={activityLevel} class="select-bordered select capitalize">
							<option value={null}>—</option>
							{#each activityLevels as a (a)}<option value={a}>{a}</option>{/each}
						</select>
					</label>
					<label class="form-control">
						<span class="label-text mb-1">Primary sport</span>
						<input type="text" bind:value={primarySport} class="input-bordered input" />
					</label>
				</div>

				<div class="card-actions justify-end">
					<button class="btn btn-primary" disabled>Save (coming soon)</button>
				</div>
			</div>
		</div>
	{/if}
</div>
