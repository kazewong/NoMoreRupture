<script lang="ts">
	import { api, ApiError } from '$lib/api/client';
	import type {
		BodyArea,
		InjuryReport,
		InjurySeverity,
		MeasurementEntry,
		TestResult
	} from '$lib/types';

	const today = new Date().toISOString().slice(0, 10);

	type Tab = 'measurements' | 'injury';
	let activeTab = $state<Tab>('measurements');

	// --- Measurements form ---
	// A flexible list of test events — athletes can add/remove rows (most fields optional).
	let dateRecorded = $state(today);
	let results = $state<TestResult[]>([
		{ event: 'vertical_jump', label: 'Vertical Jump', value: 0, unit: 'cm' },
		{ event: 'broad_jump', label: 'Broad Jump', value: 0, unit: 'm' }
	]);

	function addRow() {
		results.push({ event: '', label: '', value: 0, unit: '' });
	}
	function removeRow(index: number) {
		results.splice(index, 1);
	}

	// --- Injury form ---
	let injury = $state<InjuryReport>({
		dateReported: today,
		severity: 'minor',
		bodyArea: 'achilles',
		description: '',
		isChronic: false
	});

	const severities: InjurySeverity[] = ['minor', 'moderate', 'severe'];
	const bodyAreas: BodyArea[] = ['achilles', 'knee', 'hamstring', 'shoulder', 'ankle', 'other'];

	// --- Submission ---
	let submitting = $state(false);
	let message = $state<{ kind: 'success' | 'error'; text: string } | null>(null);

	async function submitMeasurements() {
		const filled = results.filter((r) => r.label.trim() !== '');
		if (filled.length === 0) {
			message = { kind: 'error', text: 'Add at least one test result before submitting.' };
			return;
		}
		const entry: MeasurementEntry = { dateRecorded, results: filled };
		await send(() => api.data.submitMeasurement(entry), 'Measurements saved. Thank you!');
	}

	async function submitInjury() {
		await send(() => api.data.submitInjury(injury), 'Injury report saved. Take care of yourself.');
	}

	async function send(action: () => Promise<unknown>, successText: string) {
		if (submitting) return;
		submitting = true;
		message = null;
		try {
			await action();
			message = { kind: 'success', text: successText };
		} catch (e) {
			message = {
				kind: 'error',
				text: e instanceof ApiError ? e.message : 'Submission failed. Please try again.'
			};
		} finally {
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Log Data — NoMoreRupture</title>
</svelte:head>

<div class="mx-auto max-w-3xl p-6">
	<header class="mb-6">
		<h1 class="text-3xl font-bold">Log your data</h1>
		<p class="text-base-content/60">
			Performance metrics and injury reports. Only fill in what you're comfortable sharing.
		</p>
	</header>

	{#if message}
		<div
			role="alert"
			class="mb-6 alert {message.kind === 'success' ? 'alert-success' : 'alert-error'}"
		>
			<span>{message.text}</span>
		</div>
	{/if}

	<div role="tablist" class="tabs-boxed mb-6 tabs">
		<button
			role="tab"
			class="tab"
			class:tab-active={activeTab === 'measurements'}
			onclick={() => (activeTab = 'measurements')}
		>
			Performance
		</button>
		<button
			role="tab"
			class="tab"
			class:tab-active={activeTab === 'injury'}
			onclick={() => (activeTab = 'injury')}
		>
			Injury Report
		</button>
	</div>

	{#if activeTab === 'measurements'}
		<div class="card bg-base-100 shadow">
			<div class="card-body gap-6">
				<label class="form-control w-full max-w-xs">
					<span class="label-text mb-1">Test date</span>
					<input type="date" max={today} bind:value={dateRecorded} class="input-bordered input" />
				</label>

				<div class="space-y-3">
					{#each results as result, i (i)}
						<div class="flex flex-wrap items-end gap-2">
							<label class="form-control flex-1">
								<span class="label-text mb-1">Test name</span>
								<input
									type="text"
									placeholder="e.g. Vertical Jump"
									bind:value={result.label}
									class="input-bordered input"
								/>
							</label>
							<label class="form-control w-28">
								<span class="label-text mb-1">Value</span>
								<input
									type="number"
									step="0.1"
									bind:value={result.value}
									class="input-bordered input"
								/>
							</label>
							<label class="form-control w-20">
								<span class="label-text mb-1">Unit</span>
								<input
									type="text"
									placeholder="cm"
									bind:value={result.unit}
									class="input-bordered input"
								/>
							</label>
							<button
								class="btn btn-square btn-ghost"
								aria-label="Remove test"
								onclick={() => removeRow(i)}
							>
								✕
							</button>
						</div>
					{/each}
				</div>

				<button class="btn self-start btn-ghost btn-sm" onclick={addRow}>+ Add test event</button>

				<div class="card-actions justify-end">
					<button class="btn btn-primary" disabled={submitting} onclick={submitMeasurements}>
						{#if submitting}<span class="loading loading-sm loading-spinner"></span>{/if}
						Submit measurements
					</button>
				</div>
			</div>
		</div>
	{:else}
		<div class="card bg-base-100 shadow">
			<div class="card-body gap-4">
				<label class="form-control w-full max-w-xs">
					<span class="label-text mb-1">Date reported</span>
					<input
						type="date"
						max={today}
						bind:value={injury.dateReported}
						class="input-bordered input"
					/>
				</label>

				<div class="grid gap-4 sm:grid-cols-2">
					<label class="form-control">
						<span class="label-text mb-1">Severity</span>
						<select bind:value={injury.severity} class="select-bordered select capitalize">
							{#each severities as s (s)}
								<option value={s}>{s}</option>
							{/each}
						</select>
					</label>
					<label class="form-control">
						<span class="label-text mb-1">Body area</span>
						<select bind:value={injury.bodyArea} class="select-bordered select capitalize">
							{#each bodyAreas as area (area)}
								<option value={area}>{area}</option>
							{/each}
						</select>
					</label>
				</div>

				<label class="form-control">
					<span class="label-text mb-1">Description (optional)</span>
					<textarea
						rows="4"
						bind:value={injury.description}
						placeholder="How it happened, symptoms, current status…"
						class="textarea-bordered textarea"
					></textarea>
				</label>

				<label class="label cursor-pointer justify-start gap-3">
					<input type="checkbox" bind:checked={injury.isChronic} class="checkbox" />
					<span class="label-text">This is a chronic or recurring injury</span>
				</label>

				<div class="card-actions justify-end">
					<button class="btn btn-primary" disabled={submitting} onclick={submitInjury}>
						{#if submitting}<span class="loading loading-sm loading-spinner"></span>{/if}
						Submit injury report
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>
