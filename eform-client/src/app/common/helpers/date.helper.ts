import {addMinutes, set} from 'date-fns';

export function formatTimezone(date: Date): Date {
  const offset = date.getTimezoneOffset();
  if (offset < 0) {
   return addMinutes(date, Math.abs(offset));
  } else {
    return date ;
  }
}

/**
 * Sets the time components of a given date object to zero.
 * @param date The input date object.
 * @returns A new Date object with the time components set to zero.
 */
export function setDate(date: Date): Date {
  return set(date, {
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
}
