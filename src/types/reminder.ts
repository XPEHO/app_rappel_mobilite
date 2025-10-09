export class Reminder {
  id: number;
  title: string;
  datetime: string; // ISO format
  repeatMode: "minutely" | "daily" | "weekly" | "monthly" | "yearly" | "none";

  constructor(
    id: number,
    title: string,
    datetime: string,
    repeatMode: "minutely" | "daily" | "weekly" | "monthly" | "yearly" | "none"
  ) {
    this.id = id;
    this.title = title;
    this.datetime = datetime;
    this.repeatMode = repeatMode;
  }

  isActive(): boolean {
    return new Date(this.datetime) > new Date();
  }

  getNextOccurrence(): Date {
    const baseDate = new Date(this.datetime);
    const now = new Date();

    if (this.repeatMode === "none") {
      return baseDate;
    }

    // Add logic for repeat calculations
    return baseDate;
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
}
