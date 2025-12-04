import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
    plusOneYear,
    plusOneMonth,
    plusOneWeek,
    plusOneDay,
    getStartOfDay,
    isSameDay,
    isDateBeforeToday,
    isDateThisWeek,
    isDateInNextWeek,
} from "../utils/date_utils";

describe("date_utils", () => {
    describe("plusOneYear", () => {
        it("should add one year to a date", () => {
            const date = new Date(2024, 0, 15); // 15 Jan 2024
            const result = plusOneYear(date);
            expect(result.getFullYear()).toBe(2025);
            expect(result.getMonth()).toBe(0);
            expect(result.getDate()).toBe(15);
        });

        it("should not mutate the original date", () => {
            const date = new Date(2024, 5, 10); // 10 Jun 2024
            const originalYear = date.getFullYear();
            plusOneYear(date);
            expect(date.getFullYear()).toBe(originalYear);
        });

        it("should handle leap years correctly", () => {
            const date = new Date(2024, 1, 29); // 29 Feb 2024 (leap year)
            const result = plusOneYear(date);
            expect(result.getFullYear()).toBe(2025);
            expect(result.getMonth()).toBe(2);
            // JavaScript adjusts to 1st March in non-leap year
            expect(result.getDate()).toBe(1);
        });
    });

    describe("plusOneMonth", () => {
        it("should add one month to a date", () => {
            const date = new Date(2024, 0, 15); // 15 Jan 2024
            const result = plusOneMonth(date);
            expect(result.getMonth()).toBe(1);
            expect(result.getDate()).toBe(15);
        });

        it("should roll over to next year when adding to December", () => {
            const date = new Date(2024, 11, 15); // 15 Dec 2024
            const result = plusOneMonth(date);
            expect(result.getFullYear()).toBe(2025);
            expect(result.getMonth()).toBe(0);
            expect(result.getDate()).toBe(15);
        });

        it("should not mutate the original date", () => {
            const date = new Date(2024, 5, 10); // 10 Jun 2024
            const originalMonth = date.getMonth();
            plusOneMonth(date);
            expect(date.getMonth()).toBe(originalMonth);
        });

        it("should handle dates at end of month correctly", () => {
            const date = new Date(2024, 0, 31); // 31 Jan 2024
            const result = plusOneMonth(date);
            // JavaScript adjusts to 2nd or 3rd of March depending on leap year
            expect(result.getMonth()).toBe(2);
        });
    });

    describe("plusOneWeek", () => {
        it("should add 7 days to a date", () => {
            const date = new Date(2024, 0, 15); // 15 Jan 2024
            const result = plusOneWeek(date);
            expect(result.getDate()).toBe(22);
            expect(result.getMonth()).toBe(0);
        });

        it("should roll over to next month when necessary", () => {
            const date = new Date(2024, 0, 28); // 28 Jan 2024
            const result = plusOneWeek(date);
            expect(result.getDate()).toBe(4);
            expect(result.getMonth()).toBe(1);
        });

        it("should not mutate the original date", () => {
            const date = new Date(2024, 5, 10); // 10 Jun 2024
            const originalDate = date.getDate();
            plusOneWeek(date);
            expect(date.getDate()).toBe(originalDate);
        });
    });

    describe("plusOneDay", () => {
        it("should add one day to a date", () => {
            const date = new Date(2024, 0, 15); // 15 Jan 2024
            const result = plusOneDay(date);
            expect(result.getDate()).toBe(16);
        });

        it("should roll over to next month", () => {
            const date = new Date(2024, 0, 31); // 31 Jan 2024
            const result = plusOneDay(date);
            expect(result.getDate()).toBe(1);
            expect(result.getMonth()).toBe(1);
        });

        it("should roll over to next year", () => {
            const date = new Date(2024, 11, 31); // 31 Dec 2024
            const result = plusOneDay(date);
            expect(result.getDate()).toBe(1);
            expect(result.getMonth()).toBe(0);
            expect(result.getFullYear()).toBe(2025);
        });

        it("should not mutate the original date", () => {
            const date = new Date(2024, 5, 10); // 10 Jun 2024
            const originalDate = date.getDate();
            plusOneDay(date);
            expect(date.getDate()).toBe(originalDate);
        });
    });

    describe("getStartOfDay", () => {
        it("should return date with time set to 00:00:00", () => {
            const date = new Date(2024, 0, 15, 14, 30, 45); // 15 Jan 2024 14:30:45
            const result = getStartOfDay(date);
            expect(result.getHours()).toBe(0);
            expect(result.getMinutes()).toBe(0);
            expect(result.getSeconds()).toBe(0);
            expect(result.getMilliseconds()).toBe(0);
        });

        it("should keep the same date", () => {
            const date = new Date(2024, 0, 15, 23, 59, 59); // 15 Jan 2024 23:59:59
            const result = getStartOfDay(date);
            expect(result.getFullYear()).toBe(2024);
            expect(result.getMonth()).toBe(0);
            expect(result.getDate()).toBe(15);
        });
    });

    describe("isSameDay", () => {
        it("should return true for same date and time", () => {
            const date1 = new Date(2024, 0, 15, 10, 30); // 15 Jan 2024 10:30
            const date2 = new Date(2024, 0, 15, 10, 30);
            expect(isSameDay(date1, date2)).toBe(true);
        });

        it("should return true for same date but different time", () => {
            const date1 = new Date(2024, 0, 15, 10, 30); // 15 Jan 2024 10:30
            const date2 = new Date(2024, 0, 15, 23, 45); // 15 Jan 2024 23:45
            expect(isSameDay(date1, date2)).toBe(true);
        });

        it("should return false for different dates", () => {
            const date1 = new Date(2024, 0, 15); // 15 Jan 2024
            const date2 = new Date(2024, 0, 16); // 16 Jan 2024
            expect(isSameDay(date1, date2)).toBe(false);
        });

        it("should return false for different months", () => {
            const date1 = new Date(2024, 0, 15); // 15 Jan 2024
            const date2 = new Date(2024, 1, 15); // 15 Feb 2024
            expect(isSameDay(date1, date2)).toBe(false);
        });

        it("should return false for different years", () => {
            const date1 = new Date(2024, 0, 15); // 15 Jan 2024
            const date2 = new Date(2025, 0, 15); // 15 Jan 2025
            expect(isSameDay(date1, date2)).toBe(false);
        });
    });

    describe("isDateBeforeToday", () => {
        beforeEach(() => {
            // Mock the current date to 2024-01-15 12:00:00
            vi.useFakeTimers();
            vi.setSystemTime(new Date(2024, 0, 15, 12, 0, 0));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("should return true for yesterday", () => {
            const yesterday = new Date(2024, 0, 14, 23, 59); // 14 Jan 2024
            expect(isDateBeforeToday(yesterday)).toBe(true);
        });

        it("should return false for today", () => {
            const today = new Date(2024, 0, 15, 8, 30); // 15 Jan 2024
            expect(isDateBeforeToday(today)).toBe(false);
        });

        it("should return false for tomorrow", () => {
            const tomorrow = new Date(2024, 0, 16, 0, 0); // 16 Jan 2024
            expect(isDateBeforeToday(tomorrow)).toBe(false);
        });

        it("should return true for dates in the past", () => {
            const pastDate = new Date(2023, 11, 31); // 31 Dec 2023
            expect(isDateBeforeToday(pastDate)).toBe(true);
        });

        it("should return false for dates in the future", () => {
            const futureDate = new Date(2025, 0, 1); // 1 Jan 2025
            expect(isDateBeforeToday(futureDate)).toBe(false);
        });
    });

    describe("isDateThisWeek", () => {
        beforeEach(() => {
            // Mock to Wednesday 2024-01-17 12:00:00 (mid-week)
            vi.useFakeTimers();
            vi.setSystemTime(new Date(2024, 0, 17, 12, 0, 0));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("should return true for Monday of current week", () => {
            const monday = new Date(2024, 0, 15, 10, 0); // Monday
            expect(isDateThisWeek(monday)).toBe(true);
        });

        it("should return true for today (Wednesday)", () => {
            const today = new Date(2024, 0, 17, 14, 30); // Wednesday
            expect(isDateThisWeek(today)).toBe(true);
        });

        it("should return true for Sunday of current week", () => {
            const sunday = new Date(2024, 0, 21, 23, 59); // Sunday
            expect(isDateThisWeek(sunday)).toBe(true);
        });

        it("should return false for previous week", () => {
            const lastWeek = new Date(2024, 0, 14, 12, 0); // Sunday before
            expect(isDateThisWeek(lastWeek)).toBe(false);
        });

        it("should return false for next week", () => {
            const nextWeek = new Date(2024, 0, 22, 0, 0); // Monday after
            expect(isDateThisWeek(nextWeek)).toBe(false);
        });
    });

    describe("isDateInNextWeek", () => {
        beforeEach(() => {
            // Mock to Wednesday 2024-01-17 12:00:00
            vi.useFakeTimers();
            vi.setSystemTime(new Date(2024, 0, 17, 12, 0, 0));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("should return true for Monday of next week", () => {
            const nextMonday = new Date(2024, 0, 22, 10, 0); // Next Monday
            expect(isDateInNextWeek(nextMonday)).toBe(true);
        });

        it("should return true for dates within next week", () => {
            const nextThursday = new Date(2024, 0, 25, 14, 30); // Next Thursday
            expect(isDateInNextWeek(nextThursday)).toBe(true);
        });

        it("should return true for Sunday of next week", () => {
            const nextSunday = new Date(2024, 0, 28, 23, 59); // Next Sunday
            expect(isDateInNextWeek(nextSunday)).toBe(true);
        });

        it("should return false for current week", () => {
            const thisWeek = new Date(2024, 0, 18, 12, 0); // This week
            expect(isDateInNextWeek(thisWeek)).toBe(false);
        });

        it("should return false for week after next", () => {
            const twoWeeksLater = new Date(2024, 0, 29, 0, 0); // Monday after next week
            expect(isDateInNextWeek(twoWeeksLater)).toBe(false);
        });
    });
});
