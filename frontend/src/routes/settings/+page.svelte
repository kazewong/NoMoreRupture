<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { auth } from '$lib/state/auth.svelte';
	import { theme } from '$lib/state/theme.svelte';

	async function signOut() {
		await auth.logout();
		await goto(resolve('/'));
	}
</script>

<svelte:head>
	<title>Settings — NoMoreRupture</title>
</svelte:head>

<div class="mx-auto max-w-2xl p-6">
	<h1 class="mb-6 text-3xl font-bold">Settings</h1>

	<div class="card mb-6 bg-base-100 shadow">
		<div class="card-body">
			<h2 class="card-title text-lg">Appearance</h2>
			<label class="label cursor-pointer justify-between">
				<span class="label-text">Dark mode</span>
				<input
					type="checkbox"
					class="toggle"
					checked={theme.current === 'dark'}
					onchange={() => theme.toggle()}
				/>
			</label>
		</div>
	</div>

	{#if auth.isAuthenticated}
		<div class="card mb-6 bg-base-100 shadow">
			<div class="card-body">
				<h2 class="card-title text-lg">Account</h2>
				<p class="text-sm text-base-content/60">Signed in as {auth.user?.email}</p>
				<div class="mt-2 card-actions">
					<button class="btn btn-outline" onclick={signOut}>Sign out</button>
				</div>
			</div>
		</div>

		<div class="card border border-error/30 bg-base-100 shadow">
			<div class="card-body">
				<h2 class="card-title text-lg text-error">Your data</h2>
				<p class="text-sm text-base-content/60">
					Per our privacy-first commitment, you can request deletion of all data you've contributed
					at any time.
				</p>
				<div class="mt-2 card-actions">
					<!-- TODO: wire to DELETE /api/v1/account once the endpoint exists. -->
					<button class="btn btn-outline btn-error" disabled>Request data deletion</button>
				</div>
			</div>
		</div>
	{:else}
		<div role="alert" class="alert">
			<span
				>Please <a href={resolve('/login')} class="link">sign in</a> to manage your account.</span
			>
		</div>
	{/if}
</div>
