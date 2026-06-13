// Domain types for the NoMoreRupture platform.
//
// Privacy-first principle (see README / CLAUDE.md): identifying and demographic
// fields are OPTIONAL by design. Most fields are nullable/optional because the
// dataset is expected to be noisy and partial — model for missing data as the norm.

export type OAuthProvider = 'google';

/** Coarse activity level, kept optional to avoid forcing disclosure. */
export type ActivityLevel = 'recreational' | 'competitive' | 'elite';

export type Sex = 'male' | 'female' | 'intersex' | 'prefer_not_to_say';

/** The authenticated athlete. Only `id` and `email` are guaranteed. */
export interface Athlete {
	id: string;
	email: string;
	/** Display name — optional; never required. */
	displayName?: string | null;
	createdAt: string; // ISO 8601
	profile?: AthleteProfile | null;
}

/** Self-reported, all-optional demographic context for the statistical model. */
export interface AthleteProfile {
	birthYear?: number | null;
	sex?: Sex | null;
	heightCm?: number | null;
	weightKg?: number | null;
	activityLevel?: ActivityLevel | null;
	primarySport?: string | null;
	/** ISO country code, optional — geolocation is never required. */
	country?: string | null;
}

export type InjurySeverity = 'minor' | 'moderate' | 'severe';

export type BodyArea = 'achilles' | 'knee' | 'hamstring' | 'shoulder' | 'ankle' | 'other';

/** A single performance-test result (e.g. a vertical jump of 105 cm). */
export interface TestResult {
	/** Stable key for the test event, e.g. "vertical_jump". */
	event: string;
	/** Human label, e.g. "Vertical Jump". */
	label: string;
	value: number;
	unit: string;
}

/** A dated batch of performance measurements submitted by an athlete. */
export interface MeasurementEntry {
	id?: string;
	dateRecorded: string; // ISO date (YYYY-MM-DD)
	results: TestResult[];
}

/** A reported injury incident. */
export interface InjuryReport {
	id?: string;
	dateReported: string; // ISO date (YYYY-MM-DD)
	severity: InjurySeverity;
	bodyArea: BodyArea;
	description?: string | null;
	isChronic: boolean;
}

// --- Aggregate statistics (anonymized; never per-individual identifying data) ---

export interface PerformanceAverage {
	event: string;
	label: string;
	average: number;
	unit: string;
	/** Number of athletes contributing to this average. */
	sampleSize: number;
}

export interface InjuryTrendPoint {
	period: string; // e.g. "2026-04" or "Apr"
	bodyArea: BodyArea;
	count: number;
}

export interface CorrelationInsight {
	title: string;
	description: string;
	points: Array<{ x: number; y: number }>;
	xLabel: string;
	yLabel: string;
}

export interface AggregateStats {
	totalAthletes: number;
	performanceAverages: PerformanceAverage[];
	injuryTrends: InjuryTrendPoint[];
	correlations: CorrelationInsight[];
}

export interface InjuryAreaCount {
	bodyArea: BodyArea;
	count: number;
}

/**
 * Headline, fully-anonymized numbers for the public "live statistics" page.
 * Contains only counts and breakdowns — never anything that could identify an
 * individual — so it is safe to serve without authentication.
 */
export interface PublicStats {
	/** People who have signed up to contribute. */
	totalAthletes: number;
	/** Measurement entries submitted across everyone. */
	totalMeasurements: number;
	/** Injury reports submitted across everyone. */
	totalInjuries: number;
	injuriesByArea: InjuryAreaCount[];
	/** When these figures were last computed (ISO 8601). */
	updatedAt: string;
}
