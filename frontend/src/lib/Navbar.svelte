<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="navbar bg-base-100 shadow-md">
	<div class="navbar-start">
		<a class="btn text-xl normal-case btn-ghost">NoMoreRupture</a>
	</div>
	<div class="navbar-center hidden lg:flex">
		<div class="flex gap-4">
			<a href="/dashboard" class="btn normal-case btn-ghost">Dashboard</a>
			<a href="/profile" class="btn normal-case btn-ghost">Profile</a>
			<a href="/settings" class="btn normal-case btn-ghost">Settings</a>
		</div>
	</div>
	<div class="navbar-end">
		<button class="btn btn-primary"> Sign In </button>
	</div>
</div>
