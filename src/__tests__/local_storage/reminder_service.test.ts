import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { saveReminders, loadReminders, groupRemindersByDate } from "../../local_storage/reminder_service";
import { Reminder } from "../../types/reminder";

describe("reminder_service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("saveReminders", () => {
    it("should save reminders to localStorage", () => {
      const reminders = [
        new Reminder(1, "Task 1", "2024-12-25T10:00:00", "none"),
        new Reminder(2, "Task 2", "2024-12-26T14:00:00", "daily"),
      ];

      saveReminders(reminders);

      const stored = localStorage.getItem("reminders");
      expect(stored).not.toBeNull();
      
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(2);
      expect(parsed[0].id).toBe(1);
      expect(parsed[1].id).toBe(2);
    });

    it("should overwrite previous reminders", () => {
      const firstBatch = [new Reminder(1, "Old Task", "2024-12-25T10:00:00", "none")];
      const secondBatch = [
        new Reminder(2, "New Task 1", "2024-12-26T10:00:00", "none"),
        new Reminder(3, "New Task 2", "2024-12-27T10:00:00", "none"),
      ];

      saveReminders(firstBatch);
      saveReminders(secondBatch);

      const stored = localStorage.getItem("reminders");
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(2);
      expect(parsed[0].id).toBe(2);
    });

    it("should save empty array", () => {
      saveReminders([]);

      const stored = localStorage.getItem("reminders");
      const parsed = JSON.parse(stored!);
      expect(parsed.length).toBe(0);
    });
  });

  describe("loadReminders", () => {
    it("should return empty array when no data stored", () => {
      const result = loadReminders();
      expect(result).toEqual([]);
    });

    it("should load and parse stored reminders", () => {
      const reminders = [
        new Reminder(1, "Task 1", "2024-12-25T10:00:00", "none"),
        new Reminder(2, "Task 2", "2024-12-26T14:00:00", "daily"),
      ];
      localStorage.setItem("reminders", JSON.stringify(reminders));

      const loaded = loadReminders();
      
      expect(loaded.length).toBe(2);
      expect(loaded[0]).toBeInstanceOf(Reminder);
      expect(loaded[0].id).toBe(1);
      expect(loaded[0].title).toBe("Task 1");
    });

    it("should sort reminders by datetime", () => {
      const reminders = [
        new Reminder(1, "Later", "2024-12-27T10:00:00", "none"),
        new Reminder(2, "Earlier", "2024-12-25T10:00:00", "none"),
        new Reminder(3, "Middle", "2024-12-26T10:00:00", "none"),
      ];
      localStorage.setItem("reminders", JSON.stringify(reminders));

      const loaded = loadReminders();
      
      expect(loaded[0].title).toBe("Earlier");
      expect(loaded[1].title).toBe("Middle");
      expect(loaded[2].title).toBe("Later");
    });

    it("should restore Reminder instances with methods", () => {
      const reminders = [
        new Reminder(1, "Task", "2025-12-25T10:00:00", "daily"),
      ];
      localStorage.setItem("reminders", JSON.stringify(reminders));

      const loaded = loadReminders();
      
      expect(typeof loaded[0].getTimeString).toBe("function");
      expect(typeof loaded[0].getNextOccurrence).toBe("function");
    });
  });

  describe("groupRemindersByDate", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      // Fix today's date to Dec 4, 2024 so tests are consistent
      vi.setSystemTime(new Date(2024, 11, 4, 12, 0, 0)); 
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return empty object for empty array", () => {
      const result = groupRemindersByDate([]);
      expect(Object.keys(result).length).toBe(0);
    });

    it("should group overdue reminders as 'En retard'", () => {
      const reminders = [
        new Reminder(1, "Overdue", "2024-12-03T10:00:00", "none"),
      ];

      const grouped = groupRemindersByDate(reminders);
      
      expect(grouped["En retard"]).toBeDefined();
      expect(grouped["En retard"].length).toBe(1);
    });

    it("should group today's reminders", () => {
      const reminders = [
        new Reminder(1, "Today", "2024-12-04T14:00:00", "none"),
      ];

      const grouped = groupRemindersByDate(reminders);
      
      expect(grouped["Aujourd'hui, 04/12"]).toBeDefined();
      expect(grouped["Aujourd'hui, 04/12"].length).toBe(1);
    });

    it("should group tomorrow's reminders", () => {
      const reminders = [
        new Reminder(1, "Tomorrow", "2024-12-05T14:00:00", "none"),
      ];

      const grouped = groupRemindersByDate(reminders);
      
      expect(grouped["Demain, 05/12"]).toBeDefined();
      expect(grouped["Demain, 05/12"].length).toBe(1);
    });

    it("should group this week's reminders by date", () => {
      const reminders = [
        new Reminder(1, "Friday", "2024-12-06T14:00:00", "none"),
      ];

      const grouped = groupRemindersByDate(reminders);
      
      expect(grouped["06/12"]).toBeDefined();
      expect(grouped["06/12"].length).toBe(1);
    });

    it("should group next week's reminders", () => {
      const reminders = [
        new Reminder(1, "Next week", "2024-12-10T14:00:00", "none"),
      ];

      const grouped = groupRemindersByDate(reminders);
      
      expect(grouped["La semaine prochaine"]).toBeDefined();
      expect(grouped["La semaine prochaine"].length).toBe(1);
    });

    it("should group future reminders as 'À venir'", () => {
      const reminders = [
        new Reminder(1, "Future", "2025-01-15T14:00:00", "none"),
      ];

      const grouped = groupRemindersByDate(reminders);
      
      expect(grouped["À venir"]).toBeDefined();
      expect(grouped["À venir"].length).toBe(1);
    });

    it("should group multiple reminders correctly", () => {
      const reminders = [
        new Reminder(1, "Overdue", "2024-12-03T10:00:00", "none"),
        new Reminder(2, "Today 1", "2024-12-04T10:00:00", "none"),
        new Reminder(3, "Today 2", "2024-12-04T16:00:00", "none"),
        new Reminder(4, "Tomorrow", "2024-12-05T10:00:00", "none"),
        new Reminder(5, "This week", "2024-12-06T10:00:00", "none"),
        new Reminder(6, "Next week", "2024-12-10T10:00:00", "none"),
        new Reminder(7, "Future", "2025-01-15T10:00:00", "none"),
      ];

      const grouped = groupRemindersByDate(reminders);
      
      expect(Object.keys(grouped).length).toBe(6);
      expect(grouped["En retard"]?.length).toBe(1);
      expect(grouped["Aujourd'hui, 04/12"]?.length).toBe(2);
      expect(grouped["Demain, 05/12"]?.length).toBe(1);
      expect(grouped["06/12"]?.length).toBe(1);
      expect(grouped["La semaine prochaine"]?.length).toBe(1);
      expect(grouped["À venir"]?.length).toBe(1);
    });

    it("should pad dates with zeros", () => {
      // Fix today's date to Jan 9, 2024 so tests are consistent
      vi.setSystemTime(new Date(2024, 0, 9, 12, 0, 0));

      const reminders = [
        new Reminder(1, "Today", "2024-01-09T10:00:00", "none"),
        new Reminder(2, "Tomorrow", "2024-01-10T10:00:00", "none"),
      ];

      const grouped = groupRemindersByDate(reminders);
      
      expect(grouped["Aujourd'hui, 09/01"]).toBeDefined();
      expect(grouped["Demain, 10/01"]).toBeDefined();
    });

    it("should handle same day reminders at different times", () => {
      const reminders = [
        new Reminder(1, "Morning", "2024-12-04T08:00:00", "none"),
        new Reminder(2, "Afternoon", "2024-12-04T14:00:00", "none"),
        new Reminder(3, "Evening", "2024-12-04T20:00:00", "none"),
      ];

      const grouped = groupRemindersByDate(reminders);
      
      expect(grouped["Aujourd'hui, 04/12"].length).toBe(3);
    });
  });
});
