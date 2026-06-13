<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { auth } from '$lib/state/auth.svelte';
	import { theme } from '$lib/state/theme.svelte';

	// Visible to everyone, including signed-out visitors.
	const publicLinks = [{ href: resolve('/stats'), label: 'Statistics' }];
	// Only meaningful once signed in.
	const authedLinks = [
		{ href: resolve('/dashboard'), label: 'Dashboard' },
		{ href: resolve('/log'), label: 'Log Data' },
		{ href: resolve('/profile'), label: 'Profile' }
	];
	const links = $derived(auth.isAuthenticated ? [...publicLinks, ...authedLinks] : publicLinks);

	function isActive(href: string): boolean {
		return page.url.pathname === href || page.url.pathname.startsWith(href + '/');
	}

	async function handleSignOut() {
		await auth.logout();
		await goto(resolve('/'));
	}
</script>

<div class="navbar bg-base-100 shadow-md">
	<div class="navbar-start">
		<a href={resolve('/')} class="btn text-xl normal-case btn-ghost">NoMoreRupture</a>
	</div>

	<div class="navbar-center hidden lg:flex">
		<ul class="menu menu-horizontal gap-1 px-1">
			{#each links as link (link.href)}
				<li>
					<a href={link.href} class:menu-active={isActive(link.href)}>{link.label}</a>
				</li>
			{/each}
		</ul>
	</div>

	<div class="navbar-end gap-2">
		<button
			class="btn btn-circle btn-ghost"
			aria-label="Toggle dark mode"
			onclick={() => theme.toggle()}
		>
			{theme.current === 'dark' ? '☀️' : '🌙'}
		</button>

		{#if auth.loading}
			<span class="loading loading-sm loading-spinner"></span>
		{:else if auth.isAuthenticated}
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn btn-ghost">
					{auth.user?.displayName ?? auth.user?.email}
				</div>
				<ul class="dropdown-content menu z-1 mt-2 w-48 rounded-box bg-base-100 p-2 shadow-lg">
					<li><a href={resolve('/settings')}>Settings</a></li>
					<li><button onclick={handleSignOut}>Sign out</button></li>
				</ul>
			</div>
		{:else}
			<a href={resolve('/login')} class="btn btn-primary">Sign In</a>
		{/if}
	</div>
</div>
