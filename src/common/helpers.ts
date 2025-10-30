import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

// Error interface for better type safety
interface ErrorWithResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

// Generic error type that can be any error-like object
export type UnknownError =
  | Error
  | ErrorWithResponse
  | Record<string, unknown>
  | string
  | null
  | undefined;

/**
 * Format Date
 * @param date
 * @returns
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
}

/**
 * Get Error Message
 * @param error
 * @returns
 */
export const extractErrorMessage = (error: UnknownError): string => {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    // Check for API error response structure
    if (
      "response" in error &&
      error.response &&
      typeof error.response === "object"
    ) {
      const response = error.response as {
        data?: { message?: string; error?: string };
      };
      if (response.data) {
        return (
          response.data.message ||
          response.data.error ||
          "An API error occurred"
        );
      }
    }

    // Check for standard Error object
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return "An unexpected error occurred";
};

/**
 * Format Currency in Naira
 * @param amount
 * @returns
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format number
 * @param num
 * @returns
 */
export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-NG").format(num);
};

/**
 * Get Status Variant
 * @param status
 * @returns
 */
export const getStatusVariant = (
  status: "completed" | "pending" | "failed"
) => {
  switch (status) {
    case "completed":
      return "success";

    case "pending":
      return "pending";

    case "failed":
      return "destructive";

    default:
      return "secondary";
  }
};

/**
 * Returns responsive Tailwind CSS classes for headings (H1–H4)
 * based on the given heading level.
 *
 * This function ensures consistent typography hierarchy and
 * fluid scaling across screen sizes.
 *
 * **Heading hierarchy**
 * - Level 1 → Largest, for page titles
 * - Level 2 → Section titles
 * - Level 3 → Subsection titles
 * - Level 4 → Small headings or labels
 *
 * **Responsive scaling**
 * Each level increases font size as screen width grows:
 * - `sm:` → small screens
 * - `lg:` → large screens
 * - `2xl:` → extra large screens
 *
 * @param {number} level - Heading level (1–4)
 * @returns {string} Tailwind CSS class string for responsive text sizes
 *
 * @example
 * ```tsx
 * <h1 className={getHeaderStyle(1)}>Dashboard Overview</h1>
 * <h2 className={getHeaderStyle(2)}>Recent Activity</h2>
 * <h3 className={getHeaderStyle(3)}>User Statistics</h3>
 * <h4 className={getHeaderStyle(4)}>Notes</h4>
 * ```
 */
export const getHeaderStyle = (level: number): string => {
  switch (level) {
    case 1:
      return "text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-bold";
    case 2:
      return "text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl font-semibold";
    case 3:
      return "text-lg sm:text-xl lg:text-2xl 2xl:text-3xl font-medium";
    case 4:
      return "text-base sm:text-lg lg:text-xl 2xl:text-2xl font-medium";
    default:
      return "text-base sm:text-lg lg:text-xl 2xl:text-2xl"; // fallback
  }
};

/**
 * Formats a Firebase Timestamp or Date into a readable string.
 *
 * @param timestamp - Firebase Timestamp, JS Date, or plain object with seconds/nanoseconds.
 * @param pattern - date-fns format pattern (default: "MMM dd, yyyy").
 * @returns Formatted date string or "N/A" if invalid.
 */
export function formatFirebaseDate(
  timestamp?:
    | Timestamp
    | Date
    | { seconds: number; nanoseconds: number }
    | null,
  pattern: string = "MMM dd, yyyy"
): string {
  if (!timestamp) return "N/A";

  try {
    let date: Date;

    // Case 1: Firestore Timestamp instance
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    }
    // Case 2: Native JS Date
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Case 3: Plain object { seconds, nanoseconds }
    else if (
      typeof timestamp === "object" &&
      "seconds" in timestamp &&
      "nanoseconds" in timestamp
    ) {
      date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
    } else {
      return "Invalid Date";
    }

    return format(date, pattern);
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Invalid Date";
  }
}

/**
 * Extract Initials from Name
 * @param name String
 * @returns
 */
export const extractInitials = (name: string = ""): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";

  return `${parts[0][0].toUpperCase()}${parts.at(-1)?.[0].toUpperCase() ?? ""}`;
};
