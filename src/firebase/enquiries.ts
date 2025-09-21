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
import type { ContactInquiry } from "@/common/types";

// --------------------
// CONTACT INQUIRIES CRUD OPERATIONS
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

export async function deleteContactInquiry(inquiryId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "contactInquiries", inquiryId));
  } catch (error) {
    console.error("Error deleting contact inquiry:", error);
    throw error;
  }
}

export async function getContactInquiry(inquiryId: string): Promise<ContactInquiry | null> {
  try {
    const docRef = doc(db, "contactInquiries", inquiryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
      } as ContactInquiry;
    }

    return null;
  } catch (error) {
    console.error("Error getting contact inquiry:", error);
    throw error;
  }
}

export async function getContactInquiries(filters?: {
  status?: ContactInquiry["status"];
  email?: string;
  limitCount?: number;
}): Promise<ContactInquiry[]> {
  try {
    const inquiriesRef = collection(db, "contactInquiries");
    const constraints = [];

    // Apply filters
    if (filters?.status) {
      constraints.push(where("status", "==", filters.status));
    }
    if (filters?.email) {
      constraints.push(where("email", "==", filters.email));
    }

    // Always order by creation date
    constraints.push(orderBy("createdAt", "desc"));

    // Apply limit if specified
    if (filters?.limitCount) {
      constraints.push(limit(filters.limitCount));
    }

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

export async function getNewContactInquiries(): Promise<ContactInquiry[]> {
  return getContactInquiries({ status: "new" });
}

export async function getContactInquiryStats(): Promise<{
  total: number;
  new: number;
  read: number;
  replied: number;
  closed: number;
}> {
  try {
    const allInquiries = await getContactInquiries();
    
    return {
      total: allInquiries.length,
      new: allInquiries.filter(i => i.status === "new").length,
      read: allInquiries.filter(i => i.status === "read").length,
      replied: allInquiries.filter(i => i.status === "replied").length,
      closed: allInquiries.filter(i => i.status === "closed").length,
    };
  } catch (error) {
    console.error("Error getting contact inquiry stats:", error);
    throw error;
  }
}

// --------------------
// BULK OPERATIONS
// --------------------

export async function markMultipleInquiriesAsRead(inquiryIds: string[]): Promise<void> {
  try {
    const updatePromises = inquiryIds.map(id => 
      updateContactInquiryStatus(id, "read")
    );
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error marking multiple inquiries as read:", error);
    throw error;
  }
}

export async function markMultipleInquiriesAsClosed(inquiryIds: string[]): Promise<void> {
  try {
    const updatePromises = inquiryIds.map(id => 
      updateContactInquiryStatus(id, "closed")
    );
    await Promise.all(updatePromises);
  } catch (error) {
    console.error("Error marking multiple inquiries as closed:", error);
    throw error;
  }
}
