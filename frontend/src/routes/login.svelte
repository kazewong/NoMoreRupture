<script lang="ts">
	let email = '';
	let password = '';
	let loading = false;
	let error: string | null = null;

	// Placeholder function for form submission
	async function handleSubmit() {
		if (!email || !password) {
			error = 'Please enter both email and password.';
			return;
		}

		loading = true;
		error = null;

		try {
			// Simulate API call to POST /api/v1/auth/login
			console.log('Attempting login with:', { email, password });
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Success simulation
			alert('Login Successful! Redirecting to Dashboard...');
			// In a real app: router.push('/dashboard');
		} catch (e) {
			error = 'Login failed. Please check your credentials.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100 p-4">
	<div class="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
		<h2 class="mb-1 text-center text-3xl font-extrabold text-gray-900">NoMoreRupture Login</h2>
		<p class="mb-8 text-center text-gray-500">Athlete Data Platform - Secure Access</p>

		{#if error}
			<div class="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700" role="alert">
				{error}
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<div>
				<label for="email" class="block text-sm font-medium text-gray-700"> Email Address </label>
				<div class="mt-1">
					<input
						id="email"
						type="email"
						bind:value={email}
						required
						disabled={loading}
						class="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
						placeholder="you@example.com"
						on:keypress={(e) => (e.key === 'Enter' && !loading ? handleSubmit() : null)}
					/>
				</div>
			</div>

			<div>
				<label for="password" class="block text-sm font-medium text-gray-700"> Password </label>
				<div class="mt-1">
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						disabled={loading}
						class="block w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
						placeholder="••••••••"
						on:keypress={(e) => (e.key === 'Enter' && !loading ? handleSubmit() : null)}
					/>
				</div>
			</div>

			<div class="flex items-center justify-between pt-2">
				<div class="flex items-center">
					<input
						id="remember-me"
						type="checkbox"
						class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
					/>
					<label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
				</div>

				<div class="text-sm">
					<a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
						Forgot password?
					</a>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={loading}
					class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-150 ease-in-out hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
				>
					{#if loading}
						Logging in...
					{:else}
						Sign In
					{/if}
				</button>
			</div>
		</form>

		<p class="mt-6 text-center text-sm text-gray-600">
			New user? <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
				Sign up (Future Feature)
			</a>
		</p>
	</div>
</div>
