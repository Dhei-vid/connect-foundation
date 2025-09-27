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
import type { Volunteer } from "@/common/types";

// --------------------
// VOLUNTEERS CRUD OPERATIONS
// --------------------

export async function createVolunteer(
  volunteerData: Omit<Volunteer, "id" | "status" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "volunteers"), {
      ...volunteerData,
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating volunteer:", error);
    throw error;
  }
}

export async function updateVolunteer(
  volunteerId: string,
  updates: Partial<Volunteer>
): Promise<void> {
  try {
    const volunteerRef = doc(db, "volunteers", volunteerId);
    await updateDoc(volunteerRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating volunteer:", error);
    throw error;
  }
}

export async function deleteVolunteer(volunteerId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "volunteers", volunteerId));
  } catch (error) {
    console.error("Error deleting volunteer:", error);
    throw error;
  }
}

export async function getVolunteer(
  volunteerId: string
): Promise<Volunteer | null> {
  try {
    const docRef = doc(db, "volunteers", volunteerId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
      } as Volunteer;
    }

    return null;
  } catch (error) {
    console.error("Error getting volunteer:", error);
    throw error;
  }
}

export async function getVolunteers(filters?: {
  status?: Volunteer["status"];
  assignedOrphanageId?: string;
  skills?: string[];
  availability?: Volunteer["availability"];
  experience?: Volunteer["experience"];
  city?: string;
  state?: string;
  limitCount?: number;
}): Promise<Volunteer[]> {
  try {
    const volunteersRef = collection(db, "volunteers");
    const constraints = [];

    // Apply filters
    if (filters?.status) {
      constraints.push(where("status", "==", filters.status));
    }
    if (filters?.assignedOrphanageId) {
      constraints.push(
        where("assignedOrphanageId", "==", filters.assignedOrphanageId)
      );
    }
    if (filters?.availability) {
      constraints.push(where("availability", "==", filters.availability));
    }
    if (filters?.experience) {
      constraints.push(where("experience", "==", filters.experience));
    }
    if (filters?.city) {
      constraints.push(where("city", "==", filters.city));
    }
    if (filters?.state) {
      constraints.push(where("state", "==", filters.state));
    }

    // Always order by creation date
    constraints.push(orderBy("createdAt", "desc"));

    // Apply limit if specified
    if (filters?.limitCount) {
      constraints.push(limit(filters.limitCount));
    }

    const q = query(volunteersRef, ...constraints);
    const querySnapshot = await getDocs(q);

    let volunteers = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
      } as Volunteer;
    });

    // Apply client-side filtering for array fields
    if (filters?.skills && filters.skills.length > 0) {
      volunteers = volunteers.filter((volunteer) =>
        filters.skills!.some((skill) => volunteer.skills.includes(skill))
      );
    }

    return volunteers;
  } catch (error) {
    console.error("Error getting volunteers:", error);
    throw error;
  }
}

export async function getPendingVolunteers(): Promise<Volunteer[]> {
  return getVolunteers({ status: "pending" });
}

export async function getApprovedVolunteers(): Promise<Volunteer[]> {
  return getVolunteers({ status: "approved" });
}

export async function getVolunteersByOrphanage(
  orphanageId: string
): Promise<Volunteer[]> {
  return getVolunteers({ assignedOrphanageId: orphanageId });
}

export async function approveVolunteer(
  volunteerId: string,
  assignedOrphanageId?: string,
  assignedOrphanageName?: string,
  notes?: string
): Promise<void> {
  try {
    await updateVolunteer(volunteerId, {
      status: "approved",
      assignedOrphanageId,
      assignedOrphanageName,
      notes,
    });
  } catch (error) {
    console.error("Error approving volunteer:", error);
    throw error;
  }
}

export async function rejectVolunteer(
  volunteerId: string,
  notes?: string
): Promise<void> {
  try {
    await updateVolunteer(volunteerId, {
      status: "rejected",
      notes,
    });
  } catch (error) {
    console.error("Error rejecting volunteer:", error);
    throw error;
  }
}

export async function suspendVolunteer(
  volunteerId: string,
  notes?: string
): Promise<void> {
  try {
    await updateVolunteer(volunteerId, {
      status: "suspended",
      notes,
    });
  } catch (error) {
    console.error("Error suspending volunteer:", error);
    throw error;
  }
}

export async function updateBackgroundCheckStatus(
  volunteerId: string,
  completed: boolean
): Promise<void> {
  try {
    await updateVolunteer(volunteerId, {
      backgroundCheckCompleted: completed,
    });
  } catch (error) {
    console.error("Error updating background check status:", error);
    throw error;
  }
}

export async function assignVolunteerToOrphanage(
  volunteerId: string,
  orphanageId: string,
  orphanageName: string
): Promise<void> {
  try {
    await updateVolunteer(volunteerId, {
      assignedOrphanageId: orphanageId,
      assignedOrphanageName: orphanageName,
    });
  } catch (error) {
    console.error("Error assigning volunteer to orphanage:", error);
    throw error;
  }
}

export async function unassignVolunteerFromOrphanage(
  volunteerId: string
): Promise<void> {
  try {
    await updateVolunteer(volunteerId, {
      assignedOrphanageId: undefined,
      assignedOrphanageName: undefined,
    });
  } catch (error) {
    console.error("Error unassigning volunteer from orphanage:", error);
    throw error;
  }
}

export async function getVolunteerStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  suspended: number;
  withBackgroundCheck: number;
  assigned: number;
}> {
  try {
    const allVolunteers = await getVolunteers();

    return {
      total: allVolunteers.length,
      pending: allVolunteers.filter((v) => v.status === "pending").length,
      approved: allVolunteers.filter((v) => v.status === "approved").length,
      rejected: allVolunteers.filter((v) => v.status === "rejected").length,
      suspended: allVolunteers.filter((v) => v.status === "suspended").length,
      withBackgroundCheck: allVolunteers.filter(
        (v) => v.backgroundCheckCompleted
      ).length,
      assigned: allVolunteers.filter((v) => v.assignedOrphanageId).length,
    };
  } catch (error) {
    console.error("Error getting volunteer stats:", error);
    throw error;
  }
}

// --------------------
// SEARCH AND FILTER FUNCTIONS
// --------------------

export async function searchVolunteers(
  searchTerm: string
): Promise<Volunteer[]> {
  try {
    const allVolunteers = await getVolunteers();

    return allVolunteers.filter(
      (volunteer) =>
        volunteer.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        volunteer.interests.some((interest) =>
          interest.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  } catch (error) {
    console.error("Error searching volunteers:", error);
    throw error;
  }
}

export async function getVolunteersBySkills(
  skills: string[]
): Promise<Volunteer[]> {
  try {
    const allVolunteers = await getVolunteers();

    return allVolunteers.filter((volunteer) =>
      skills.some((skill) => volunteer.skills.includes(skill))
    );
  } catch (error) {
    console.error("Error getting volunteers by skills:", error);
    throw error;
  }
}

export async function getVolunteersByLocation(
  city?: string,
  state?: string
): Promise<Volunteer[]> {
  return getVolunteers({ city, state });
}
