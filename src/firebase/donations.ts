import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Donation } from "@/common/types";

// --------------------
// DONATIONS CRUD OPERATIONS
// --------------------

export async function createDonation(
  donationData: Omit<Donation, "id" | "createdAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "donations"), {
      ...donationData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating donation:", error);
    throw error;
  }
}

export async function updateDonationStatus(
  donationId: string,
  status: Donation["status"]
): Promise<void> {
  try {
    const donationRef = doc(db, "donations", donationId);
    await updateDoc(donationRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating donation status:", error);
    throw error;
  }
}

export async function updateDonation(
  donationId: string,
  updates: Partial<Donation>
): Promise<void> {
  try {
    const donationRef = doc(db, "donations", donationId);
    await updateDoc(donationRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating donation:", error);
    throw error;
  }
}

export async function deleteDonation(donationId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "donations", donationId));
  } catch (error) {
    console.error("Error deleting donation:", error);
    throw error;
  }
}

export async function getDonation(donationId: string): Promise<Donation | null> {
  try {
    const docRef = doc(db, "donations", donationId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
      } as Donation;
    }

    return null;
  } catch (error) {
    console.error("Error getting donation:", error);
    throw error;
  }
}

export async function getDonations(filters?: {
  status?: Donation["status"];
  donorId?: string;
  donorEmail?: string;
  targetIssueId?: string;
  anonymous?: boolean;
  startDate?: Date;
  endDate?: Date;
  limitCount?: number;
}): Promise<Donation[]> {
  try {
    const donationsRef = collection(db, "donations");
    const constraints = [];

    // Apply filters
    if (filters?.status) {
      constraints.push(where("status", "==", filters.status));
    }
    if (filters?.donorId) {
      constraints.push(where("donorId", "==", filters.donorId));
    }
    if (filters?.donorEmail) {
      constraints.push(where("donorEmail", "==", filters.donorEmail));
    }
    if (filters?.targetIssueId) {
      constraints.push(where("targetIssueId", "==", filters.targetIssueId));
    }
    if (filters?.anonymous !== undefined) {
      constraints.push(where("anonymous", "==", filters.anonymous));
    }

    // Always order by creation date
    constraints.push(orderBy("createdAt", "desc"));

    // Apply limit if specified
    if (filters?.limitCount) {
      constraints.push(limit(filters.limitCount));
    }

    const q = query(donationsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    let donations = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
      } as Donation;
    });

    // Apply client-side date filtering if provided
    if (filters?.startDate) {
      donations = donations.filter(donation => donation.createdAt >= filters.startDate!);
    }
    if (filters?.endDate) {
      donations = donations.filter(donation => donation.createdAt <= filters.endDate!);
    }

    return donations;
  } catch (error) {
    console.error("Error getting donations:", error);
    throw error;
  }
}

export async function getCompletedDonations(): Promise<Donation[]> {
  return getDonations({ status: "completed" });
}

export async function getPendingDonations(): Promise<Donation[]> {
  return getDonations({ status: "pending" });
}

export async function getFailedDonations(): Promise<Donation[]> {
  return getDonations({ status: "failed" });
}

export async function getDonationsByDonor(donorId: string): Promise<Donation[]> {
  return getDonations({ donorId });
}

export async function getDonationsByEmail(donorEmail: string): Promise<Donation[]> {
  return getDonations({ donorEmail });
}

export async function getDonationsByIssue(issueId: string): Promise<Donation[]> {
  return getDonations({ targetIssueId: issueId });
}

export async function getDonationsByDateRange(startDate: Date, endDate: Date): Promise<Donation[]> {
  return getDonations({ startDate, endDate });
}

export async function getRecentDonations(limitCount: number = 10): Promise<Donation[]> {
  return getDonations({ limitCount });
}

// --------------------
// ANALYTICS AND STATISTICS
// --------------------

export async function getDonationStats(filters?: {
  status?: Donation["status"];
  startDate?: Date;
  endDate?: Date;
  targetIssueId?: string;
}): Promise<{
  totalDonations: number;
  totalAmount: number;
  averageAmount: number;
  completedDonations: number;
  pendingDonations: number;
  failedDonations: number;
  anonymousDonations: number;
  targetedDonations: number;
  generalDonations: number;
}> {
  try {
    const donations = await getDonations(filters);
    
    const completedDonations = donations.filter(d => d.status === "completed");
    const pendingDonations = donations.filter(d => d.status === "pending");
    const failedDonations = donations.filter(d => d.status === "failed");
    const anonymousDonations = donations.filter(d => d.anonymous);
    const targetedDonations = donations.filter(d => d.targetIssueId);
    const generalDonations = donations.filter(d => !d.targetIssueId);

    const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const completedAmount = completedDonations.reduce((sum, donation) => sum + donation.amount, 0);

    return {
      totalDonations: donations.length,
      totalAmount: completedAmount,
      averageAmount: completedDonations.length > 0 ? completedAmount / completedDonations.length : 0,
      completedDonations: completedDonations.length,
      pendingDonations: pendingDonations.length,
      failedDonations: failedDonations.length,
      anonymousDonations: anonymousDonations.length,
      targetedDonations: targetedDonations.length,
      generalDonations: generalDonations.length,
    };
  } catch (error) {
    console.error("Error getting donation stats:", error);
    throw error;
  }
}

export async function getDonationStatsByTimeframe(timeframe: "day" | "week" | "month" | "year"): Promise<{
  donations: Donation[];
  totalAmount: number;
  count: number;
}> {
  try {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case "day":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0);
    }

    const donations = await getDonationsByDateRange(startDate, now);
    const completedDonations = donations.filter(d => d.status === "completed");
    const totalAmount = completedDonations.reduce((sum, donation) => sum + donation.amount, 0);

    return {
      donations: completedDonations,
      totalAmount,
      count: completedDonations.length,
    };
  } catch (error) {
    console.error("Error getting donation stats by timeframe:", error);
    throw error;
  }
}

export async function getTopDonors(limitCount: number = 10): Promise<Array<{
  donorEmail: string;
  donorName: string;
  totalAmount: number;
  donationCount: number;
  lastDonationDate: Date;
}>> {
  try {
    const completedDonations = await getCompletedDonations();
    
    const donorMap = new Map<string, {
      donorEmail: string;
      donorName: string;
      totalAmount: number;
      donationCount: number;
      lastDonationDate: Date;
    }>();

    completedDonations.forEach(donation => {
      const key = donation.donorEmail;
      if (!donorMap.has(key)) {
        donorMap.set(key, {
          donorEmail: donation.donorEmail,
          donorName: donation.donorName,
          totalAmount: 0,
          donationCount: 0,
          lastDonationDate: donation.createdAt,
        });
      }

      const donor = donorMap.get(key)!;
      donor.totalAmount += donation.amount;
      donor.donationCount += 1;
      if (donation.createdAt > donor.lastDonationDate) {
        donor.lastDonationDate = donation.createdAt;
      }
    });

    return Array.from(donorMap.values())
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, limitCount);
  } catch (error) {
    console.error("Error getting top donors:", error);
    throw error;
  }
}

// --------------------
// SEARCH AND FILTER FUNCTIONS
// --------------------

export async function searchDonations(searchTerm: string): Promise<Donation[]> {
  try {
    const allDonations = await getDonations();
    
    return allDonations.filter(donation =>
      donation.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.message && donation.message.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  } catch (error) {
    console.error("Error searching donations:", error);
    throw error;
  }
}

export async function getDonationsByAmountRange(minAmount: number, maxAmount: number): Promise<Donation[]> {
  try {
    const allDonations = await getDonations();
    
    return allDonations.filter(donation =>
      donation.amount >= minAmount && donation.amount <= maxAmount
    );
  } catch (error) {
    console.error("Error getting donations by amount range:", error);
    throw error;
  }
}

// --------------------
// BULK OPERATIONS
// --------------------

export async function updateMultipleDonationStatus(
  donationIds: string[],
  status: Donation["status"]
): Promise<void> {
  try {
    const updatePromises = donationIds.map(id => updateDonationStatus(id, status));
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error updating multiple donation statuses:", error);
    throw error;
  }
}

export async function deleteMultipleDonations(donationIds: string[]): Promise<void> {
  try {
    const deletePromises = donationIds.map(id => deleteDonation(id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting multiple donations:", error);
    throw error;
  }
}
