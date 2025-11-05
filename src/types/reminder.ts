import {
  isDateBeforeToday,
  isDateThisWeek,
  plusOneDay,
  plusOneMonth,
  plusOneWeek,
  plusOneYear,
} from "@/utils/date_utils";

export class Reminder {
  id: number;
  title: string;
  datetime: string; // ISO format
  repeatMode: "daily" | "weekly" | "monthly" | "yearly" | "none";

  constructor(
    id: number | null,
    title: string,
    datetime: string,
    repeatMode: "daily" | "weekly" | "monthly" | "yearly" | "none"
  ) {
    this.id = id ?? Date.now() % 2147483647;
    this.title = title;
    this.datetime = datetime;
    this.repeatMode = repeatMode;
  }

  isActive(): boolean {
    return new Date(this.datetime) > new Date();
  }

  getNextOccurrence(): Date | null {
    const baseDate = new Date(this.datetime);

    switch (this.repeatMode) {
      case "daily":
        return plusOneDay(baseDate);
      case "weekly":
        return plusOneWeek(baseDate);
      case "monthly":
        return plusOneMonth(baseDate);
      case "yearly":
        return plusOneYear(baseDate);
      default:
        return null;
    }
  }

  getDateTimeString(): string {
    const date = new Date(this.datetime);
    return date.toLocaleString();
  }

  getTimeString(): string {
    const date = new Date(this.datetime);
    return date
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      .replace(":", "h")
      .replace(/^0/, "");
  }

  getDateString(): string {
    const date = new Date(this.datetime);
    const formatted = date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    // Capitalize first letter of weekday and month
    return formatted
      .replace(/^\w/, (char) => char.toUpperCase())
      .replace(/(\s\w)/g, (match) => match.toUpperCase());
  }

  getDisplayString(): string {
    const date = new Date(this.datetime);
    return isDateThisWeek(date) && !isDateBeforeToday(date)
      ? this.getTimeString()
      : this.getDateString();
  }
}
