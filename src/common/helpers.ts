/* eslint-disable @typescript-eslint/no-explicit-any */
// export function formatCurrency(amount: number): string {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//   }).format(amount);
// }

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

export const extractErrorMessage = (error: any): string => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error || // sometimes APIs use "error"
    error?.message ||
    "An unexpected error occurred"
  );
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-NG").format(num);
};

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
