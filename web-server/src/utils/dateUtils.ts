export function addDaysToDate(date: Date, numberOfDays: number): Date {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + numberOfDays);
  return newDate;
}
