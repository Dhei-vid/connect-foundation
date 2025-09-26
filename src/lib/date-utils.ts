import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Formats a Firebase timestamp or Date object to a readable date string
 * @param date - Firebase timestamp, Date object, or ISO string
 * @param formatString - Optional format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export function formatFirebaseDate(
  date: Date | string | { toDate?: () => Date } | null | undefined,
  formatString: string = 'MMM dd, yyyy'
): string {
  if (!date) return 'N/A';

  let dateObj: Date;

  // Handle Firebase timestamp objects
  if (typeof date === 'object' && date !== null && 'toDate' in date) {
    dateObj = date.toDate();
  }
  // Handle Date objects
  else if (date instanceof Date) {
    dateObj = date;
  }
  // Handle ISO strings
  else if (typeof date === 'string') {
    dateObj = parseISO(date);
  }
  // Handle null/undefined
  else {
    return 'N/A';
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'N/A';
  }

  return format(dateObj, formatString);
}

/**
 * Formats a Firebase timestamp or Date object to a relative time string
 * @param date - Firebase timestamp, Date object, or ISO string
 * @returns Relative time string (e.g., "2 days ago", "3 hours ago")
 */
export function formatFirebaseDateRelative(
  date: Date | string | { toDate?: () => Date } | null | undefined
): string {
  if (!date) return 'N/A';

  let dateObj: Date;

  // Handle Firebase timestamp objects
  if (typeof date === 'object' && date !== null && 'toDate' in date) {
    dateObj = date.toDate();
  }
  // Handle Date objects
  else if (date instanceof Date) {
    dateObj = date;
  }
  // Handle ISO strings
  else if (typeof date === 'string') {
    dateObj = parseISO(date);
  }
  // Handle null/undefined
  else {
    return 'N/A';
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return 'N/A';
  }

  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Formats a Firebase timestamp or Date object to a full date and time string
 * @param date - Firebase timestamp, Date object, or ISO string
 * @returns Full date and time string (e.g., "Dec 25, 2023 at 2:30 PM")
 */
export function formatFirebaseDateTime(
  date: Date | string | { toDate?: () => Date } | null | undefined
): string {
  return formatFirebaseDate(date, 'MMM dd, yyyy \'at\' h:mm a');
}

/**
 * Formats a Firebase timestamp or Date object to a short date string
 * @param date - Firebase timestamp, Date object, or ISO string
 * @returns Short date string (e.g., "12/25/2023")
 */
export function formatFirebaseDateShort(
  date: Date | string | { toDate?: () => Date } | null | undefined
): string {
  return formatFirebaseDate(date, 'MM/dd/yyyy');
}

/**
 * Formats a Firebase timestamp or Date object to a long date string
 * @param date - Firebase timestamp, Date object, or ISO string
 * @returns Long date string (e.g., "December 25, 2023")
 */
export function formatFirebaseDateLong(
  date: Date | string | { toDate?: () => Date } | null | undefined
): string {
  return formatFirebaseDate(date, 'MMMM dd, yyyy');
}
