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
import type { SuccessStory } from "@/common/types";

// --------------------
// SUCCESS STORIES CRUD OPERATIONS
// --------------------

// Create a new success story
export async function createSuccessStory(
  successStoryData: Omit<SuccessStory, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "success-stories"), {
      ...successStoryData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating success story:", error);
    throw error;
  }
}

// Update a success story
export async function updateSuccessStory(
  successStoryId: string,
  updates: Partial<SuccessStory>
): Promise<void> {
  try {
    const successStoryRef = doc(db, "success-stories", successStoryId);
    await updateDoc(successStoryRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating success story:", error);
    throw error;
  }
}

// Delete a success story
export async function deleteSuccessStory(successStoryId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "success-stories", successStoryId));
  } catch (error) {
    console.error("Error deleting success story:", error);
    throw error;
  }
}

// Get a single success story by ID
export async function getSuccessStory(successStoryId: string): Promise<SuccessStory | null> {
  try {
    const docRef = doc(db, "success-stories", successStoryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
        completedAt: data.completedAt?.toDate?.(),
      } as SuccessStory;
    }

    return null;
  } catch (error) {
    console.error("Error getting success story:", error);
    throw error;
  }
}

// Get success stories with optional filters
export async function getSuccessStories(filters?: {
  orphanageId?: string;
  issueId?: string;
  limitCount?: number;
}): Promise<SuccessStory[]> {
  try {
    const successStoriesRef = collection(db, "success-stories");
    const constraints = [];

    // Apply filters
    if (filters?.orphanageId) {
      constraints.push(where("orphanageId", "==", filters.orphanageId));
    }
    if (filters?.issueId) {
      constraints.push(where("issueId", "==", filters.issueId));
    }

    // Always order by creation date (newest first)
    constraints.push(orderBy("createdAt", "desc"));

    // Apply limit if specified
    if (filters?.limitCount) {
      constraints.push(limit(filters.limitCount));
    }

    const q = query(successStoriesRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const successStories = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
        completedAt: data.completedAt?.toDate?.(),
      } as SuccessStory;
    });

    return successStories;
  } catch (error) {
    console.error("Error getting success stories:", error);
    throw error;
  }
}



// Get statistics on success stories
export async function getSuccessStoryStats(): Promise<{
  total: number;
  totalBeneficiaries: number;
  totalCost: number;
  byOrphanage: { [orphanageId: string]: number };
}> {
  try {
    const allSuccessStories = await getSuccessStories();

    const byOrphanage = allSuccessStories.reduce((acc, story) => {
      acc[story.orphanageId] = (acc[story.orphanageId] || 0) + 1;
      return acc;
    }, {} as { [orphanageId: string]: number });

    return {
      total: allSuccessStories.length,
      totalBeneficiaries: allSuccessStories.reduce((sum, story) => sum + story.beneficiaries, 0),
      totalCost: allSuccessStories.reduce((sum, story) => sum + story.cost, 0),
      byOrphanage,
    };
  } catch (error) {
    console.error("Error getting success story stats:", error);
    throw error;
  }
}


// --------------------
// SUCCESS STORIES FROM FUNDED ISSUES
// --------------------

// Generate success stories from fully funded issues
export async function generateSuccessStoriesFromFundedIssues(): Promise<SuccessStory[]> {
  try {
    // Import here to avoid circular dependencies
    const { getIssues } = await import("./issues");
    const { getDonations } = await import("./donations");
    const { getOrphanages } = await import("./orphanages");
    
    // Get all resolved issues
    const resolvedIssues = await getIssues({ status: "resolved" });
    const orphanages = await getOrphanages();
    
    const successStories: SuccessStory[] = [];
    
    for (const issue of resolvedIssues) {
      // Get all completed donations for this issue
      const donations = await getDonations({ 
        targetIssueId: issue.id,
        status: "completed"
      });
      
      const totalRaised = donations.reduce((sum, donation) => sum + donation.amount, 0);
      
      // Check if the issue is fully funded
      if (totalRaised >= issue.estimatedCost) {
        const orphanage = orphanages.find(o => o.id === issue.orphanageId);
        
        if (orphanage) {
          const successStory: Omit<SuccessStory, "id" | "createdAt" | "updatedAt"> = {
            orphanageId: issue.orphanageId,
            orphanageName: issue.orphanageName,
            issueId: issue.id,
            issueTitle: issue.title,
            title: `Successfully funded: ${issue.title}`,
            description: `The ${issue.category} issue "${issue.title}" has been fully funded and resolved. ${issue.description}`,
            impact: `This funding has directly impacted ${orphanage.childrenCount} children at ${orphanage.name}. The ${issue.category} needs have been met, improving the quality of life and care for the children.`,
            images: issue.images || [],
            beneficiaries: orphanage.childrenCount,
            cost: totalRaised,
            completedAt: issue.resolvedAt || new Date(),
          };
          
          // Check if success story already exists for this issue
          const existingStories = await getSuccessStories({ issueId: issue.id });
          if (existingStories.length === 0) {
            // Create the success story
            const storyId = await createSuccessStory(successStory);
            const createdStory = await getSuccessStory(storyId);
            if (createdStory) {
              successStories.push(createdStory);
            }
          } else {
            // Update existing story with latest data
            const existingStory = existingStories[0];
            await updateSuccessStory(existingStory.id, {
              cost: totalRaised,
              completedAt: issue.resolvedAt || new Date(),
              updatedAt: new Date(),
            });
            successStories.push(existingStory);
          }
        }
      }
    }
    
    return successStories;
  } catch (error) {
    console.error("Error generating success stories from funded issues:", error);
    throw error;
  }
}

// Get success stories that are automatically generated from funded issues
export async function getAutoGeneratedSuccessStories(): Promise<SuccessStory[]> {
  try {
    const allStories = await getSuccessStories();
    // Filter stories that have an issueId (indicating they were auto-generated)
    return allStories.filter(story => story.issueId);
  } catch (error) {
    console.error("Error getting auto-generated success stories:", error);
    throw error;
  }
}

// Sync success stories with current funded issues
export async function syncSuccessStoriesWithFundedIssues(): Promise<{
  created: number;
  updated: number;
  total: number;
}> {
  try {
    const generatedStories = await generateSuccessStoriesFromFundedIssues();
    const existingStories = await getAutoGeneratedSuccessStories();
    
    return {
      created: generatedStories.length - existingStories.length,
      updated: existingStories.length,
      total: generatedStories.length,
    };
  } catch (error) {
    console.error("Error syncing success stories with funded issues:", error);
    throw error;
  }
}
