// Light/dark theme state. The initial value is applied before paint by an inline
// script in app.html (to avoid a flash); this module keeps it reactive and lets
// the user override + persist their choice.

import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

function resolveInitial(): Theme {
	if (!browser) return 'light';
	const stored = localStorage.getItem('theme');
	if (stored === 'light' || stored === 'dark') return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

class ThemeState {
	current = $state<Theme>('light');

	/** Sync reactive state with whatever the pre-paint script already applied. */
	init(): void {
		this.current = resolveInitial();
		this.apply();
	}

	toggle(): void {
		this.current = this.current === 'dark' ? 'light' : 'dark';
		if (browser) localStorage.setItem('theme', this.current);
		this.apply();
	}

	private apply(): void {
		if (browser) document.documentElement.dataset.theme = this.current;
	}
}

export const theme = new ThemeState();
