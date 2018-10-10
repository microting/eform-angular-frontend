import {addMinutes} from 'date-fns';

export function formatTimezone(date: Date): Date {
  const offset = date.getTimezoneOffset();
  if (offset < 0) {
   return addMinutes(date, Math.abs(offset));
  } else {
    return date ;
  }
}
