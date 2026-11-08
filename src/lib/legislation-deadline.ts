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
 * Neither statute states an hour. The running clock counts down to 12:00 a.m.
 * Eastern Time at the start of December 11, 2026: the beginning of that
 * calendar date, not a clock time written in the statute. The calendar phase
 * still treats the whole Eastern day of December 11 as the date itself.
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

export type LegislationClock = {
  phase: LegislationPhase;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

type WallTime = CalendarDate & {
  hour: number;
  minute: number;
  second: number;
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

function wallTimeInTimeZone(instant: Date, timeZone: string): WallTime {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(instant);

  const read = (type: Intl.DateTimeFormatPartTypes) => {
    const part = parts.find((entry) => entry.type === type);
    if (!part) {
      throw new Error(`Missing calendar part: ${type}`);
    }
    return Number(part.value);
  };

  const hour = read("hour");

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: hour === 24 ? 0 : hour,
    minute: read("minute"),
    second: read("second"),
  };
}

function timeZoneOffsetMs(instant: Date, timeZone: string): number {
  const wall = wallTimeInTimeZone(instant, timeZone);
  const asUtc = Date.UTC(
    wall.year,
    wall.month - 1,
    wall.day,
    wall.hour,
    wall.minute,
    wall.second,
  );
  return asUtc - instant.getTime();
}

/** Wall-clock time in `timeZone`, expressed as a UTC instant. */
export function zonedWallTimeToInstant(wall: WallTime, timeZone: string): Date {
  const guess = Date.UTC(
    wall.year,
    wall.month - 1,
    wall.day,
    wall.hour,
    wall.minute,
    wall.second,
  );
  const first = guess - timeZoneOffsetMs(new Date(guess), timeZone);
  return new Date(guess - timeZoneOffsetMs(new Date(first), timeZone));
}

let deadlineInstant: Date | null = null;

/** 12:00 a.m. Eastern Time on the deadline date. */
export function legislationDeadlineInstant(): Date {
  if (!deadlineInstant) {
    deadlineInstant = zonedWallTimeToInstant(
      { ...LEGISLATION_DEADLINE, hour: 0, minute: 0, second: 0 },
      LEGISLATION_TIME_ZONE,
    );
  }
  return deadlineInstant;
}

export function getLegislationClock(now = new Date()): LegislationClock {
  const { phase } = getLegislationCountdown(now);
  const remainingMs = legislationDeadlineInstant().getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);
  const seconds = totalSeconds % 60;

  if (phase !== "upcoming") {
    return { phase, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return { phase, days, hours, minutes, seconds };
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
