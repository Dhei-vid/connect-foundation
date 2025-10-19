import { doc, updateDoc, getDoc, collection, getDocs, query, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Orphanage } from "@/common/types";

/**
 * Update Orphanages profile data
 * @param orphanageId - The ID of the orphanage to update
 * @param orphanageData - Partial data to update the orphanage profile
 */
export async function updateOrphanageProfile(
  orphanageId: string,
  orphanageData: Partial<Orphanage>
): Promise<void> {
  try {
    const orphanageRef = doc(db, "orphanages", orphanageId);

    // Get current data to preserve timestamps
    const currentDoc = await getDoc(orphanageRef);
    if (!currentDoc.exists()) {
      throw new Error("Orphanage not found");
    }

    const currentData = currentDoc.data() as Orphanage;

    // Update with new data while preserving created timestamp
    const updatedData = {
      ...currentData,
      ...orphanageData,
      updatedAt: new Date(),
    };

    await updateDoc(orphanageRef, updatedData);
  } catch (error) {
    console.error("Error updating orphanage profile:", error);
    throw error;
  }
}

/**
 * Get Orphanage profile data by ID
 * @param orphanageId - The ID of the orphanage to retrieve
 * @returns
 */
export async function getOrphanageProfile(
  orphanageId: string
): Promise<Orphanage | null> {
  try {
    const orphanageDoc = await getDoc(doc(db, "orphanages", orphanageId));
    if (orphanageDoc.exists()) {
      return orphanageDoc.data() as Orphanage;
    }
    return null;
  } catch (error) {
    console.error("Error getting orphanage profile:", error);
    throw error;
  }
}

/**
 * Get all orphanages
 * @returns Array of all orphanages
 */
export async function getOrphanages(): Promise<Orphanage[]> {
  try {
    const orphanagesRef = collection(db, "orphanages");
    
    // Try with orderBy first, fallback to simple query if index doesn't exist
    let querySnapshot;
    try {
      const q = query(orphanagesRef, orderBy("createdAt", "desc"));
      querySnapshot = await getDocs(q);
    } catch (orderByError) {
      console.warn("OrderBy index not found, fetching without ordering:", orderByError);
      querySnapshot = await getDocs(orphanagesRef);
    }

    const orphanages = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
      } as Orphanage;
    });

    // Sort in memory if we couldn't use orderBy
    return orphanages.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Descending order
    });
  } catch (error) {
    console.error("Error getting orphanages:", error);
    throw error;
  }
}

/**
 * Update Orphanage data (alias for updateOrphanageProfile for consistency)
 * @param orphanageId - The ID of the orphanage to update
 * @param orphanageData - Partial data to update the orphanage profile
 */
export async function updateOrphanage(
  orphanageId: string,
  orphanageData: Partial<Orphanage>
): Promise<void> {
  return updateOrphanageProfile(orphanageId, orphanageData);
}

/**
 * Delete an orphanage
 * @param orphanageId - The ID of the orphanage to delete
 */
export async function deleteOrphanage(orphanageId: string): Promise<void> {
  try {
    const orphanageRef = doc(db, "orphanages", orphanageId);
    
    // Check if orphanage exists before deleting
    const orphanageDoc = await getDoc(orphanageRef);
    if (!orphanageDoc.exists()) {
      throw new Error("Orphanage not found");
    }
    
    await deleteDoc(orphanageRef);
  } catch (error) {
    console.error("Error deleting orphanage:", error);
    throw error;
  }
}
