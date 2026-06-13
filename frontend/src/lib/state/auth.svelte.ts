// Global authentication state, exposed as a runes-based singleton.
// Import `auth` anywhere and read `auth.user` / `auth.loading` reactively.

import { api, ApiError } from '$lib/api/client';
import type { Athlete } from '$lib/types';

class AuthState {
	user = $state<Athlete | null>(null);
	loading = $state(true);

	get isAuthenticated(): boolean {
		return this.user !== null;
	}

	/** Fetch the current session. Safe to call repeatedly (e.g. on app load). */
	async refresh(): Promise<void> {
		this.loading = true;
		try {
			this.user = await api.auth.me();
		} catch (err) {
			// 401 simply means "not signed in"; anything else we also treat as
			// logged-out for the UI, but surface unexpected errors to the console.
			if (!(err instanceof ApiError) || err.status !== 401) {
				console.error('auth.refresh failed:', err);
			}
			this.user = null;
		} finally {
			this.loading = false;
		}
	}

	async logout(): Promise<void> {
		try {
			await api.auth.logout();
		} finally {
			this.user = null;
		}
	}
}

export const auth = new AuthState();
