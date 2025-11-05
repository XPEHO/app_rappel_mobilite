export function plusOneYear(date: Date) {
  const newDate = new Date(date);
  newDate.setFullYear(date.getFullYear() + 1);
  return newDate;
}

export function plusOneMonth(date: Date) {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() + 1);
  return newDate;
}

export function plusOneWeek(date: Date) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + 7);
  return newDate;
}

export function plusOneDay(date: Date) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + 1);
  return newDate;
}

export function getStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

export function isDateBeforeToday(date: Date) {
  const today = new Date();
  const startOfToday = getStartOfDay(today);
  return date < startOfToday;
}

export function isDateThisWeek(date: Date) {
  const today = new Date();
  const startOfWeek = getStartOfDay(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
  const endOfWeek = plusOneWeek(startOfWeek);
  return date >= startOfWeek && date < endOfWeek;
}

export function isDateInNextWeek(date: Date) {
  const today = new Date();
  const startOfNextWeek = getStartOfDay(today);
  startOfNextWeek.setDate(today.getDate() - today.getDay() + 1 + 7); // Monday of next week
  const endOfNextWeek = plusOneWeek(startOfNextWeek);
  return date >= startOfNextWeek && date < endOfNextWeek;
}
