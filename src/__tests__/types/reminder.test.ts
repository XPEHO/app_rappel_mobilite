import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Reminder } from "../../types/reminder";

describe("Reminder", () => {
  describe("constructor", () => {
    it("should create a reminder with provided id", () => {
      const reminder = new Reminder(123, "Thrall", "2024-12-25T10:00:00", "none");
      expect(reminder.id).toBe(123);
      expect(reminder.title).toBe("Thrall");
      expect(reminder.datetime).toBe("2024-12-25T10:00:00");
      expect(reminder.repeatMode).toBe("none");
    });

    it("should generate an id when null is provided", () => {
      const reminder = new Reminder(null, "Grommash", "2024-12-25T10:00:00", "daily");
      expect(reminder.id).toBeGreaterThan(0);
      expect(reminder.id).toBeLessThanOrEqual(2147483647);
    });

    it("should create reminders with different repeat modes", () => {
      const modes: Array<"daily" | "weekly" | "monthly" | "yearly" | "none"> = [
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "none",
      ];

      modes.forEach((mode) => {
        const reminder = new Reminder(1, "Llane Wrynn", "2024-12-25T10:00:00", mode);
        expect(reminder.repeatMode).toBe(mode);
      });
    });
  });

  describe("isActive", () => {
    beforeEach(() => {
      vi.useFakeTimers();
        // Fix today's date to Dec 4, 2024 so tests are consistent
      vi.setSystemTime(new Date("2024-12-04T12:00:00"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return true for future dates", () => {
      const reminder = new Reminder(1, "Azshara", "2024-12-25T10:00:00", "none");
      expect(reminder.isActive()).toBe(true);
    });

    it("should return false for past dates", () => {
      const reminder = new Reminder(1, "Gul'dan", "2024-11-01T10:00:00", "none");
      expect(reminder.isActive()).toBe(false);
    });

    it("should return false for current moment", () => {
      const reminder = new Reminder(1, "Antonidas", "2024-12-04T12:00:00", "none");
      expect(reminder.isActive()).toBe(false);
    });
  });

  describe("getNextOccurrence", () => {
    it("should return next day for daily repeat", () => {
      const reminder = new Reminder(1, "Daily Task", "2024-12-04T10:00:00", "daily");
      const next = reminder.getNextOccurrence();
      expect(next).not.toBeNull();
      expect(next?.getDate()).toBe(5);
      expect(next?.getMonth()).toBe(11); // December (0-indexed)
      expect(next?.getFullYear()).toBe(2024);
    });

    it("should return next week for weekly repeat", () => {
      const reminder = new Reminder(1, "Weekly Task", "2024-12-04T10:00:00", "weekly");
      const next = reminder.getNextOccurrence();
      expect(next).not.toBeNull();
      expect(next?.getDate()).toBe(11);
      expect(next?.getMonth()).toBe(11);
      expect(next?.getFullYear()).toBe(2024);
    });

    it("should return next month for monthly repeat", () => {
      const reminder = new Reminder(1, "Monthly Task", "2024-12-04T10:00:00", "monthly");
      const next = reminder.getNextOccurrence();
      expect(next).not.toBeNull();
      expect(next?.getDate()).toBe(4);
      expect(next?.getMonth()).toBe(0); // January (0-indexed)
      expect(next?.getFullYear()).toBe(2025);
    });

    it("should return next year for yearly repeat", () => {
      const reminder = new Reminder(1, "Yearly Task", "2024-12-04T10:00:00", "yearly");
      const next = reminder.getNextOccurrence();
      expect(next).not.toBeNull();
      expect(next?.getDate()).toBe(4);
      expect(next?.getMonth()).toBe(11);
      expect(next?.getFullYear()).toBe(2025);
    });

    it("should return null for none repeat mode", () => {
      const reminder = new Reminder(1, "One-time Task", "2024-12-04T10:00:00", "none");
      const next = reminder.getNextOccurrence();
      expect(next).toBeNull();
    });
  });

  describe("getDateTimeString", () => {
    it("should return a formatted date-time string", () => {
      const reminder = new Reminder(1, "Alexstrasza", "2024-12-25T14:30:00", "none");
      const result = reminder.getDateTimeString();
      // The exact format depends on locale, but it should contain date and time
      expect(result).toContain("25");
      expect(result).toContain("12");
      expect(result).toContain("2024");
    });
  });

  describe("getTimeString", () => {
    it("should format time with h separator", () => {
      const reminder = new Reminder(1, "Neltharion", "2024-12-25T14:30:00", "none");
      const result = reminder.getTimeString();
      expect(result).toContain("h");
      expect(result).toMatch(/\d+h\d+/);
    });

    it("should remove leading zero from hours", () => {
      const reminder = new Reminder(1, "Malygos", "2024-12-25T09:30:00", "none");
      const result = reminder.getTimeString();
      // Should be "9h30" not "09h30"
      expect(result.startsWith("0")).toBe(false);
    });

    it("should handle midnight correctly", () => {
      const reminder = new Reminder(1, "Nozdormu", "2024-12-25T00:00:00", "none");
      const result = reminder.getTimeString();
      expect(result).toContain("h");
    });

    it("should handle noon correctly", () => {
      const reminder = new Reminder(1, "Ysera", "2024-12-25T12:00:00", "none");
      const result = reminder.getTimeString();
      expect(result).toContain("12h");
    });
  });

  describe("getDateString", () => {
    it("should return formatted date in French", () => {
      const reminder = new Reminder(1, "Malfurion", "2024-12-25T10:00:00", "none");
      const result = reminder.getDateString();
      // Should contain day number
      expect(result).toContain("25");
      // Should be capitalized
      expect(result.charAt(0)).toBe(result.charAt(0).toUpperCase());
    });

    it("should include weekday, day, and month", () => {
      const reminder = new Reminder(1, "Illidan", "2024-01-15T10:00:00", "none");
      const result = reminder.getDateString();
      // Should contain day number
      expect(result).toContain("15");
      // Should have proper format
      expect(result.length).toBeGreaterThan(5);
    });

    it("should capitalize first letter", () => {
      const reminder = new Reminder(1, "Tyrande", "2024-12-25T10:00:00", "none");
      const result = reminder.getDateString();
      const firstChar = result.charAt(0);
      expect(firstChar).toBe(firstChar.toUpperCase());
    });
  });

  describe("getDisplayString", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      // Fix today's date to Jan 17, 2024 so tests are consistent
      vi.setSystemTime(new Date(2024, 0, 17, 12, 0, 0));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return time string for dates this week", () => {
      // Friday of the same week
      const reminder = new Reminder(1, "Sarrak", "2024-01-19T14:30:00", "none");
      const result = reminder.getDisplayString();
      // Should be time format (with "h")
      expect(result).toContain("h");
    });

    it("should return date string for dates in the past", () => {
      // Last week
      const reminder = new Reminder(1, "Geyah", "2024-01-10T14:30:00", "none");
      const result = reminder.getDisplayString();
      // Should be date format (with day number)
      expect(result).toContain("10");
    });

    it("should return date string for dates after this week", () => {
      // Next month
      const reminder = new Reminder(1, "Draka", "2024-02-15T14:30:00", "none");
      const result = reminder.getDisplayString();
      // Should be date format
      expect(result).toContain("15");
    });

    it("should return time string for today", () => {
      const reminder = new Reminder(1, "Aggra", "2024-01-17T16:30:00", "none");
      const result = reminder.getDisplayString();
      // Should be time format
      expect(result).toContain("h");
    });

    it("should return time string for tomorrow (this week)", () => {
      const reminder = new Reminder(1, "Durak", "2024-01-18T10:00:00", "none");
      const result = reminder.getDisplayString();
      // Should be time format
      expect(result).toContain("h");
    });
  });
});
