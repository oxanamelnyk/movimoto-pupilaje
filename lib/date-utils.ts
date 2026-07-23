/**
 * DAYS360 - Calculate days between two dates using 360-day year (Excel compatible)
 * @param startDate The start date
 * @param endDate The end date
 * @returns Number of days between the two dates using 360-day year basis
 */
export function days360(startDate: Date, endDate: Date): number {
  let d1 = startDate.getDate();
  const m1 = startDate.getMonth() + 1; // getMonth returns 0-11
  const y1 = startDate.getFullYear();

  let d2 = endDate.getDate();
  const m2 = endDate.getMonth() + 1;
  const y2 = endDate.getFullYear();

  // Adjust day 31 to 30
  if (d1 === 31) {
    d1 = 30;
  }

  // If d2 is 31 and d1 is 30 or 31, set d2 to 30
  if (d2 === 31 && (d1 === 30 || d1 === 31)) {
    d2 = 30;
  }

  // Calculate days: (year difference * 360) + (month difference * 30) + (day difference)
  return (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
}

/**
 * Calculate days between two dates (as strings or Dates)
 * @param entryDate The entry date (ISO string or Date)
 * @param exitDate The exit date (ISO string, Date, or null for today)
 * @returns Number of days or empty string if less than 1 day
 */
export function calculateDaysBetween(
  entryDate?: string | Date | null,
  exitDate?: string | Date | null,
): string | number {
  if (!entryDate) return "";

  const entry = typeof entryDate === "string" ? new Date(entryDate) : entryDate;
  const exit = exitDate
    ? typeof exitDate === "string"
      ? new Date(exitDate)
      : exitDate
    : new Date();

  const days = days360(entry, exit);

  // Return empty string if less than 1 day, otherwise return the number
  return days < 1 ? "" : days;
}
