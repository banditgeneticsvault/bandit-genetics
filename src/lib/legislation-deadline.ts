/**
 * Federal hemp-definition date for the Bandit countdown.
 *
 * Congressional Research Service (IF13136, updated September 28, 2026, and
 * Legal Sidebar LSB11496) states that Public Law 119-103 delayed the effective
 * date of most amendments in Section 781 of Public Law 119-37 until
 * December 11, 2026. Those amendments include the total-THC standard and the
 * exclusion for viable seeds from cannabis plants over 0.3% total THC,
 * including THCA. Provisions about cannabinoids a cannabis plant cannot
 * naturally produce were left on the original November 12, 2026 date.
 *
 * Neither statute states an hour. The countdown is calendar days in Eastern
 * Time until December 11, 2026, not a claimed statutory clock time.
 */

export const LEGISLATION_TIME_ZONE = "America/New_York";

export const LEGISLATION_DEADLINE = {
  year: 2026,
  month: 12,
  day: 11,
} as const;

export const LEGISLATION_DEADLINE_LABEL = "December 11, 2026";
export const LEGISLATION_DEADLINE_SHORT = "Dec 11, 2026";

export type CalendarDate = {
  year: number;
  month: number;
  day: number;
};

export type LegislationPhase = "upcoming" | "today" | "passed";

export type LegislationCountdown = {
  daysRemaining: number;
  phase: LegislationPhase;
  timeZone: typeof LEGISLATION_TIME_ZONE;
};

export function calendarDateInTimeZone(
  instant: Date,
  timeZone: string,
): CalendarDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);

  const read = (type: Intl.DateTimeFormatPartTypes) => {
    const part = parts.find((entry) => entry.type === type);
    if (!part) {
      throw new Error(`Missing calendar part: ${type}`);
    }
    return Number(part.value);
  };

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
  };
}

/** Whole calendar days from `from` until `to`. Negative when `to` is earlier. */
export function calendarDaySpan(from: CalendarDate, to: CalendarDate): number {
  const start = Date.UTC(from.year, from.month - 1, from.day);
  const end = Date.UTC(to.year, to.month - 1, to.day);
  return Math.round((end - start) / 86_400_000);
}

export function getLegislationCountdown(now = new Date()): LegislationCountdown {
  const today = calendarDateInTimeZone(now, LEGISLATION_TIME_ZONE);
  const daysRemaining = calendarDaySpan(today, LEGISLATION_DEADLINE);
  const phase: LegislationPhase =
    daysRemaining > 0 ? "upcoming" : daysRemaining === 0 ? "today" : "passed";

  return {
    daysRemaining,
    phase,
    timeZone: LEGISLATION_TIME_ZONE,
  };
}

/** Milliseconds from `now` until the next Eastern Time calendar date. */
export function millisecondsUntilNextEasternDate(now = new Date()): number {
  const start = calendarDateInTimeZone(now, LEGISLATION_TIME_ZONE);
  let low = now.getTime();
  let high = low + 36 * 60 * 60 * 1000;

  while (high - low > 1000) {
    const mid = Math.floor((low + high) / 2);
    const probed = calendarDateInTimeZone(new Date(mid), LEGISLATION_TIME_ZONE);
    const sameDay =
      probed.year === start.year &&
      probed.month === start.month &&
      probed.day === start.day;
    if (sameDay) low = mid;
    else high = mid;
  }

  return Math.max(0, high - now.getTime());
}
