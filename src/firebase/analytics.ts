import { getDonationStats, getDonationsByDateRange } from "./donations";
import { getIssues } from "./issues";
import { getVolunteers } from "./volunteers";
import { getContactInquiries } from "./enquiries";
import { getOrphanages } from "./orphanages";
import type {
  Orphanage,
  Issue,
  Volunteer,
  ContactInquiry,
  Donation,
} from "@/common/types";

// Type definitions for export filters
type ExportFilters = {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  priority?: string;
  category?: string;
  orphanageId?: string;
  email?: string;
  limitCount?: number;
  assignedOrphanageId?: string;
  skills?: string[];
  availability?: "weekdays" | "weekends" | "both" | "flexible";
  experience?: "none" | "beginner" | "intermediate" | "advanced";
  city?: string;
  state?: string;
};

// --------------------
// DASHBOARD ANALYTICS
// --------------------

export async function getDashboardStats(): Promise<{
  donations: {
    totalAmount: number;
    totalCount: number;
    thisMonth: number;
    thisWeek: number;
  };
  orphanages: {
    total: number;
    verified: number;
    pending: number;
  };
  issues: {
    total: number;
    open: number;
    resolved: number;
    urgent: number;
  };
  volunteers: {
    total: number;
    approved: number;
    pending: number;
  };
  inquiries: {
    total: number;
    new: number;
    replied: number;
  };
}> {
  try {
    // Get current date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get donation stats with error handling
    let allDonations, monthlyDonations, weeklyDonations;
    try {
      [allDonations, monthlyDonations, weeklyDonations] = await Promise.all([
        getDonationStats(),
        getDonationStats({ startDate: startOfMonth }),
        getDonationStats({ startDate: startOfWeek }),
      ]);
    } catch (error) {
      console.error("Error getting donation stats:", error);
      allDonations = { totalAmount: 0, totalDonations: 0 };
      monthlyDonations = { totalAmount: 0 };
      weeklyDonations = { totalAmount: 0 };
    }

    // Get orphanage stats with error handling
    let orphanageStats;
    try {
      const allOrphanages = await getOrphanages();
      orphanageStats = {
        total: allOrphanages.length,
        verified: allOrphanages.filter((o) => o.verified).length,
        pending: allOrphanages.filter((o) => !o.verified).length,
      };
    } catch (error) {
      console.error("Error getting orphanage stats:", error);
      orphanageStats = { total: 0, verified: 0, pending: 0 };
    }

    // Get issue stats with error handling
    let issueStats;
    try {
      const allIssues = await getIssues();
      issueStats = {
        total: allIssues.length,
        open: allIssues.filter((i) => i.status === "open").length,
        resolved: allIssues.filter((i) => i.status === "resolved").length,
        urgent: allIssues.filter((i) => i.priority === "urgent").length,
      };
    } catch (error) {
      console.error("Error getting issue stats:", error);
      issueStats = { total: 0, open: 0, resolved: 0, urgent: 0 };
    }

    // Get volunteer stats with error handling
    let volunteerStats;
    try {
      const allVolunteers = await getVolunteers();
      volunteerStats = {
        total: allVolunteers.length,
        approved: allVolunteers.filter((v) => v.status === "approved").length,
        pending: allVolunteers.filter((v) => v.status === "pending").length,
      };
    } catch (error) {
      console.error("Error getting volunteer stats:", error);
      volunteerStats = { total: 0, approved: 0, pending: 0 };
    }

    // Get inquiry stats with error handling
    let inquiryStats;
    try {
      const allInquiries = await getContactInquiries();
      inquiryStats = {
        total: allInquiries.length,
        new: allInquiries.filter((i) => i.status === "new").length,
        replied: allInquiries.filter((i) => i.status === "replied").length,
      };
    } catch (error) {
      console.error("Error getting inquiry stats:", error);
      inquiryStats = { total: 0, new: 0, replied: 0 };
    }

    const result = {
      donations: {
        totalAmount: allDonations.totalAmount,
        totalCount: allDonations.totalDonations,
        thisMonth: monthlyDonations.totalAmount,
        thisWeek: weeklyDonations.totalAmount,
      },
      orphanages: orphanageStats,
      issues: issueStats,
      volunteers: volunteerStats,
      inquiries: inquiryStats,
    };

    return result;
  } catch (error) {
    console.error("Error getting dashboard stats:", error);
    throw error;
  }
}

// --------------------
// FINANCIAL ANALYTICS
// --------------------

export async function getFinancialOverview(
  timeframe: "week" | "month" | "quarter" | "year"
): Promise<{
  donations: {
    total: number;
    average: number;
    count: number;
    trend: number; // percentage change from previous period
  };
  issues: {
    totalRaised: number;
    totalNeeded: number;
    completionRate: number;
  };
  topCategories: Array<{
    category: string;
    amount: number;
    count: number;
  }>;
}> {
  try {
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;

    // Calculate date ranges based on timeframe
    switch (timeframe) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        break;
      case "quarter":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        previousStartDate = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
        previousStartDate = new Date(0);
    }

    // Get donation data for current and previous periods
    const [currentDonations, previousDonations, allIssues] = await Promise.all([
      getDonationStats({ startDate }),
      getDonationStats({ startDate: previousStartDate, endDate: startDate }),
      getIssues(),
    ]);

    // Calculate trend
    const trend =
      previousDonations.totalAmount > 0
        ? ((currentDonations.totalAmount - previousDonations.totalAmount) /
            previousDonations.totalAmount) *
          100
        : 0;

    // Calculate issue statistics
    const totalRaised = allIssues.reduce(
      (sum, issue) => sum + issue.raisedAmount,
      0
    );
    const totalNeeded = allIssues.reduce(
      (sum, issue) => sum + issue.estimatedCost,
      0
    );
    const completionRate =
      totalNeeded > 0 ? (totalRaised / totalNeeded) * 100 : 0;

    // Get top categories (this would need to be implemented based on your categorization)
    const topCategories = [
      { category: "Medical", amount: 0, count: 0 },
      { category: "Education", amount: 0, count: 0 },
      { category: "Food", amount: 0, count: 0 },
      { category: "Shelter", amount: 0, count: 0 },
    ];

    return {
      donations: {
        total: currentDonations.totalAmount,
        average: currentDonations.averageAmount,
        count: currentDonations.completedDonations,
        trend,
      },
      issues: {
        totalRaised,
        totalNeeded,
        completionRate,
      },
      topCategories,
    };
  } catch (error) {
    console.error("Error getting financial overview:", error);
    throw error;
  }
}

// --------------------
// GROWTH ANALYTICS
// --------------------

export async function getGrowthMetrics(): Promise<{
  donations: {
    daily: Array<{ date: string; amount: number; count: number }>;
    monthly: Array<{ month: string; amount: number; count: number }>;
  };
  orphanages: {
    registrations: Array<{ month: string; count: number }>;
  };
  volunteers: {
    applications: Array<{ month: string; count: number }>;
  };
}> {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    // Get data for the last 6 months
    const [donations, orphanages, volunteers] = await Promise.all([
      getDonationsByDateRange(sixMonthsAgo, now),
      getOrphanages(),
      getVolunteers(),
    ]);

    // Process donations data
    const donationsByDate = new Map<
      string,
      { amount: number; count: number }
    >();
    const donationsByMonth = new Map<
      string,
      { amount: number; count: number }
    >();

    donations.forEach((donation) => {
      if (donation.status === "completed") {
        const date = donation.createdAt.toISOString().split("T")[0];
        const month = donation.createdAt.toISOString().substring(0, 7);

        // Daily aggregation
        if (!donationsByDate.has(date)) {
          donationsByDate.set(date, { amount: 0, count: 0 });
        }
        const daily = donationsByDate.get(date)!;
        daily.amount += donation.amount;
        daily.count += 1;

        // Monthly aggregation
        if (!donationsByMonth.has(month)) {
          donationsByMonth.set(month, { amount: 0, count: 0 });
        }
        const monthly = donationsByMonth.get(month)!;
        monthly.amount += donation.amount;
        monthly.count += 1;
      }
    });

    // Process orphanage registrations
    const orphanageRegistrations = new Map<string, number>();
    orphanages.forEach((orphanage) => {
      const month = orphanage.createdAt.toISOString().substring(0, 7);
      orphanageRegistrations.set(
        month,
        (orphanageRegistrations.get(month) || 0) + 1
      );
    });

    // Process volunteer applications
    const volunteerApplications = new Map<string, number>();
    volunteers.forEach((volunteer) => {
      const month = volunteer.createdAt.toISOString().substring(0, 7);
      volunteerApplications.set(
        month,
        (volunteerApplications.get(month) || 0) + 1
      );
    });

    return {
      donations: {
        daily: Array.from(donationsByDate.entries())
          .map(([date, data]) => ({ date, ...data }))
          .sort((a, b) => a.date.localeCompare(b.date)),
        monthly: Array.from(donationsByMonth.entries())
          .map(([month, data]) => ({ month, ...data }))
          .sort((a, b) => a.month.localeCompare(b.month)),
      },
      orphanages: {
        registrations: Array.from(orphanageRegistrations.entries())
          .map(([month, count]) => ({ month, count }))
          .sort((a, b) => a.month.localeCompare(b.month)),
      },
      volunteers: {
        applications: Array.from(volunteerApplications.entries())
          .map(([month, count]) => ({ month, count }))
          .sort((a, b) => a.month.localeCompare(b.month)),
      },
    };
  } catch (error) {
    console.error("Error getting growth metrics:", error);
    throw error;
  }
}

// --------------------
// EXPORT FUNCTIONS
// --------------------

export async function exportData(
  collection: string,
  format: "json" | "csv",
  filters?: ExportFilters
): Promise<{ data: string; filename: string }> {
  try {
    let data: (Donation | Orphanage | Issue | Volunteer | ContactInquiry)[] =
      [];
    let filename = "";

    switch (collection) {
      case "donations":
        data = await getDonationsByDateRange(
          filters?.startDate || new Date(0),
          filters?.endDate || new Date()
        );
        filename = `donations_${new Date().toISOString().split("T")[0]}`;
        break;
      case "orphanages":
        data = await getOrphanages();
        filename = `orphanages_${new Date().toISOString().split("T")[0]}`;
        break;
      case "issues":
        data = await getIssues(filters);
        filename = `issues_${new Date().toISOString().split("T")[0]}`;
        break;
      case "volunteers":
        data = await getVolunteers(
          filters
            ? {
                ...filters,
                status: filters.status as
                  | "pending"
                  | "approved"
                  | "rejected"
                  | "suspended"
                  | undefined,
              }
            : undefined
        );
        filename = `volunteers_${new Date().toISOString().split("T")[0]}`;
        break;
      case "inquiries":
        data = await getContactInquiries(
          filters
            ? {
                ...filters,
                status: filters.status as
                  | "closed"
                  | "new"
                  | "read"
                  | "replied"
                  | undefined,
              }
            : undefined
        );
        filename = `inquiries_${new Date().toISOString().split("T")[0]}`;
        break;
      default:
        throw new Error(`Unknown collection: ${collection}`);
    }

    let exportData: string;
    if (format === "json") {
      exportData = JSON.stringify(data, null, 2);
      filename += ".json";
    } else if (format === "csv") {
      exportData = convertToCSV(data);
      filename += ".csv";
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }

    return { data: exportData, filename };
  } catch (error) {
    console.error("Error exporting data:", error);
    throw error;
  }
}

// --------------------
// HELPER FUNCTIONS
// --------------------

function convertToCSV(
  data: (Donation | Orphanage | Issue | Volunteer | ContactInquiry)[]
): string {
  if (data.length === 0) return "";

  const firstRow = data[0] as unknown as Record<string, unknown>;
  const headers = Object.keys(firstRow);
  const csvRows = [headers.join(",")];

  for (const row of data) {
    const rowData = row as unknown as Record<string, unknown>;
    const values = headers.map((header) => {
      const value = rowData[header];
      if (value === null || value === undefined) return "";
      if (typeof value === "object")
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      if (typeof value === "string" && value.includes(","))
        return `"${value.replace(/"/g, '""')}"`;
      return String(value);
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}
