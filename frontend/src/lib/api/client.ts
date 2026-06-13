// Typed client for the Axum backend.
//
// The base URL is configured via the PUBLIC_API_BASE_URL env var (see .env.example).
// Requests are credentialed so the backend's session cookie (set after the OAuth
// callback) is sent on every call.

import { env } from '$env/dynamic/public';
import type {
	Athlete,
	AggregateStats,
	InjuryReport,
	MeasurementEntry,
	OAuthProvider,
	PublicStats
} from '$lib/types';

const BASE_URL = env.PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
	constructor(
		public status: number,
		message: string
	) {
		super(message);
		this.name = 'ApiError';
	}
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	let res: Response;
	try {
		res = await fetch(`${BASE_URL}${path}`, {
			credentials: 'include',
			...init,
			headers: {
				'content-type': 'application/json',
				...init?.headers
			}
		});
	} catch {
		throw new ApiError(0, 'Could not reach the server. Is the backend running?');
	}

	if (!res.ok) {
		let message = res.statusText || `Request failed (${res.status})`;
		try {
			const body = await res.json();
			if (typeof body?.message === 'string') message = body.message;
		} catch {
			// non-JSON error body; keep the status text
		}
		throw new ApiError(res.status, message);
	}

	if (res.status === 204) return undefined as T;
	return (await res.json()) as T;
}

export const api = {
	auth: {
		/** Current athlete, or throws ApiError(401) if not signed in. */
		me: () => request<Athlete>('/api/v1/auth/me'),
		/** Full URL to begin an OAuth flow; navigate the browser here. */
		oauthStartUrl: (provider: OAuthProvider) => `${BASE_URL}/api/v1/auth/${provider}`,
		logout: () => request<void>('/api/v1/auth/logout', { method: 'POST' })
	},
	stats: {
		/** Anonymized headline stats for the public page — no auth required. */
		public: () => request<PublicStats>('/api/v1/stats/public'),
		aggregate: () => request<AggregateStats>('/api/v1/stats/aggregate')
	},
	data: {
		submitMeasurement: (entry: MeasurementEntry) =>
			request<MeasurementEntry>('/api/v1/data/measurement', {
				method: 'POST',
				body: JSON.stringify(entry)
			}),
		submitInjury: (report: InjuryReport) =>
			request<InjuryReport>('/api/v1/data/injury', {
				method: 'POST',
				body: JSON.stringify(report)
			})
	}
};
