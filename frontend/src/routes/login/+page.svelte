<script lang="ts">
	import { api } from '$lib/api/client';

	function signInWith(provider: 'google') {
		// The backend handles the OAuth flow and sets a session cookie on callback.
		window.location.href = api.auth.oauthStartUrl(provider);
	}
</script>

<svelte:head>
	<title>Sign in — NoMoreRupture</title>
</svelte:head>

<div class="flex min-h-[70vh] items-center justify-center p-4">
	<div class="card w-full max-w-md bg-base-100 shadow-xl">
		<div class="card-body">
			<h1 class="text-center text-2xl font-bold">Sign in to NoMoreRupture</h1>
			<p class="text-center text-sm text-base-content/60">
				We use a sign-in provider so you never share a password with us. Your name and other details
				stay optional.
			</p>

			<div class="mt-4 flex flex-col gap-3">
				<button class="btn btn-block btn-outline" onclick={() => signInWith('google')}>
					Continue with Google
				</button>
			</div>

			<p class="mt-4 text-center text-xs text-base-content/50">
				By signing in you agree that data you submit is used for injury-prediction research, never
				sold, and never used for advertising.
			</p>
		</div>
	</div>
</div>
