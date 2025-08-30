import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type {
  User,
  Donation,
  ContactInquiry,
  FinancialRecord,
} from "@/common/types";

// --------------------
// USER MANAGEMENT
// --------------------
export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...updates,
      lastLoginAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function getUser(userId: string): Promise<User | null> {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.(),
        lastLoginAt: data.lastLoginAt?.toDate?.(),
      } as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

// --------------------
// DONATIONS
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
    await updateDoc(donationRef, { status });
  } catch (error) {
    console.error("Error updating donation status:", error);
    throw error;
  }
}

export async function getDonations(filters?: {
  status?: Donation["status"];
  donorId?: string;
  targetIssueId?: string;
}): Promise<Donation[]> {
  try {
    const donationsRef = collection(db, "donations");
    const constraints = [];

    if (filters?.status) {
      constraints.push(where("status", "==", filters.status));
    }
    if (filters?.donorId) {
      constraints.push(where("donorId", "==", filters.donorId));
    }
    if (filters?.targetIssueId) {
      constraints.push(where("targetIssueId", "==", filters.targetIssueId));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(donationsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
      } as Donation;
    });
  } catch (error) {
    console.error("Error getting donations:", error);
    throw error;
  }
}

// --------------------
// CONTACT INQUIRIES
// --------------------
export async function createContactInquiry(
  inquiryData: Omit<ContactInquiry, "id" | "status" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "contactInquiries"), {
      ...inquiryData,
      status: "new",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating contact inquiry:", error);
    throw error;
  }
}

export async function updateContactInquiryStatus(
  inquiryId: string,
  status: ContactInquiry["status"]
): Promise<void> {
  try {
    const inquiryRef = doc(db, "contactInquiries", inquiryId);
    await updateDoc(inquiryRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating contact inquiry status:", error);
    throw error;
  }
}

export async function getContactInquiries(filters?: {
  status?: ContactInquiry["status"];
}): Promise<ContactInquiry[]> {
  try {
    const inquiriesRef = collection(db, "contactInquiries");
    const constraints = [];

    if (filters?.status) {
      constraints.push(where("status", "==", filters.status));
    }

    constraints.push(orderBy("createdAt", "desc"));

    const q = query(inquiriesRef, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
      } as ContactInquiry;
    });
  } catch (error) {
    console.error("Error getting contact inquiries:", error);
    throw error;
  }
}

// --------------------
// FINANCIAL RECORDS
// --------------------
export async function createFinancialRecord(
  recordData: Omit<FinancialRecord, "id" | "date">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "financialRecords"), {
      ...recordData,
      date: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating financial record:", error);
    throw error;
  }
}

export async function getFinancialRecords(filters?: {
  type?: FinancialRecord["type"];
  category?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<FinancialRecord[]> {
  try {
    const recordsRef = collection(db, "financialRecords");
    const constraints = [];

    if (filters?.type) {
      constraints.push(where("type", "==", filters.type));
    }
    if (filters?.category) {
      constraints.push(where("category", "==", filters.category));
    }

    constraints.push(orderBy("date", "desc"));

    const q = query(recordsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    let records = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate?.(),
      } as FinancialRecord;
    });

    // Apply client-side date filtering if provided
    if (filters?.startDate) {
      records = records.filter((record) => record.date >= filters.startDate!);
    }
    if (filters?.endDate) {
      records = records.filter((record) => record.date <= filters.endDate!);
    }

    return records;
  } catch (error) {
    console.error("Error getting financial records:", error);
    throw error;
  }
}
