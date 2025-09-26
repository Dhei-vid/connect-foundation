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
import type { VolunteerOpportunity } from "@/common/types";

// --------------------
// VOLUNTEER OPPORTUNITIES CRUD OPERATIONS
// --------------------

// Create a new volunteer opportunity
export async function createVolunteerOpportunity(
  opportunityData: Omit<VolunteerOpportunity, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "volunteerOpportunities"), {
      ...opportunityData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating volunteer opportunity:", error);
    throw error;
  }
}

// Update a volunteer opportunity
export async function updateVolunteerOpportunity(
  opportunityId: string,
  updates: Partial<VolunteerOpportunity>
): Promise<void> {
  try {
    const opportunityRef = doc(db, "volunteerOpportunities", opportunityId);
    await updateDoc(opportunityRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating volunteer opportunity:", error);
    throw error;
  }
}

// Delete a volunteer opportunity
export async function deleteVolunteerOpportunity(
  opportunityId: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, "volunteerOpportunities", opportunityId));
  } catch (error) {
    console.error("Error deleting volunteer opportunity:", error);
    throw error;
  }
}

// Get a single volunteer opportunity by ID
export async function getVolunteerOpportunity(
  opportunityId: string
): Promise<VolunteerOpportunity | null> {
  try {
    const docRef = doc(db, "volunteerOpportunities", opportunityId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
      } as VolunteerOpportunity;
    }

    return null;
  } catch (error) {
    console.error("Error getting volunteer opportunity:", error);
    throw error;
  }
}

// Get volunteer opportunities with optional filters
export async function getVolunteerOpportunities(filters?: {
  isActive?: boolean;
  location?: string;
  limitCount?: number;
}): Promise<VolunteerOpportunity[]> {
  try {
    const opportunitiesRef = collection(db, "volunteerOpportunities");
    const constraints = [];

    // Apply filters
    if (filters?.isActive !== undefined) {
      constraints.push(where("isActive", "==", filters.isActive));
    }
    if (filters?.location) {
      constraints.push(where("location", "==", filters.location));
    }

    // Always order by creation date
    constraints.push(orderBy("createdAt", "desc"));

    // Apply limit if specified
    if (filters?.limitCount) {
      constraints.push(limit(filters.limitCount));
    }

    const q = query(opportunitiesRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const opportunities = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
      } as VolunteerOpportunity;
    });

    return opportunities;
  } catch (error) {
    console.error("Error getting volunteer opportunities:", error);
    throw error;
  }
}

// Get only active volunteer opportunities
export async function getActiveVolunteerOpportunities(): Promise<
  VolunteerOpportunity[]
> {
  return getVolunteerOpportunities({ isActive: true });
}

// Toggle the active status of a volunteer opportunity
export async function toggleVolunteerOpportunityStatus(
  opportunityId: string
): Promise<void> {
  try {
    const opportunity = await getVolunteerOpportunity(opportunityId);
    if (opportunity) {
      await updateVolunteerOpportunity(opportunityId, {
        isActive: !opportunity.isActive,
      });
    }
  } catch (error) {
    console.error("Error toggling volunteer opportunity status:", error);
    throw error;
  }
}

// Search volunteer opportunities by title, description, or location
export async function searchVolunteerOpportunities(
  searchTerm: string
): Promise<VolunteerOpportunity[]> {
  try {
    const allOpportunities = await getVolunteerOpportunities();

    return allOpportunities.filter(
      (opportunity) =>
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        opportunity.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching volunteer opportunities:", error);
    throw error;
  }
}

// Get statistics on volunteer opportunities
export async function getVolunteerOpportunityStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
}> {
  try {
    const allOpportunities = await getVolunteerOpportunities();

    return {
      total: allOpportunities.length,
      active: allOpportunities.filter((o) => o.isActive).length,
      inactive: allOpportunities.filter((o) => !o.isActive).length,
    };
  } catch (error) {
    console.error("Error getting volunteer opportunity stats:", error);
    throw error;
  }
}
