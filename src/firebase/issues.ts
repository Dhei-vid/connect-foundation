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
import type { Issue } from "@/common/types";

// --------------------
// ISSUES CRUD OPERATIONS
// --------------------

// Create a new issue
export async function createIssue(
  issueData: Omit<Issue, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "issues"), {
      ...issueData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
}

// Update an issue
export async function updateIssue(
  issueId: string,
  updates: Partial<Issue>
): Promise<void> {
  try {
    const issueRef = doc(db, "issues", issueId);
    await updateDoc(issueRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error updating issue:", error);
    throw error;
  }
}

// Delete an issue
export async function deleteIssue(issueId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "issues", issueId));
  } catch (error) {
    console.error("Error deleting issue:", error);
    throw error;
  }
}

// Get a single issue by ID
export async function getIssue(issueId: string): Promise<Issue | null> {
  try {
    const docRef = doc(db, "issues", issueId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
        deadline: data.deadline?.toDate?.(),
        resolvedAt: data.resolvedAt?.toDate?.(),
      } as Issue;
    }

    return null;
  } catch (error) {
    console.error("Error getting issue:", error);
    throw error;
  }
}

// Get issues with optional filters
export async function getIssues(filters?: {
  status?: string;
  priority?: string;
  category?: string;
  orphanageId?: string;
  limitCount?: number;
}): Promise<Issue[]> {
  try {
    const issuesRef = collection(db, "issues");
    const constraints = [];

    // Apply filters
    if (filters?.status) {
      constraints.push(where("status", "==", filters.status));
    }
    if (filters?.priority) {
      constraints.push(where("priority", "==", filters.priority));
    }
    if (filters?.category) {
      constraints.push(where("category", "==", filters.category));
    }
    if (filters?.orphanageId) {
      constraints.push(where("orphanageId", "==", filters.orphanageId));
    }

    // Always order by creation date (newest first)
    constraints.push(orderBy("createdAt", "desc"));

    // Apply limit if specified
    if (filters?.limitCount) {
      constraints.push(limit(filters.limitCount));
    }

    const q = query(issuesRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const issues = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.(),
        updatedAt: data.updatedAt?.toDate?.(),
        deadline: data.deadline?.toDate?.(),
        resolvedAt: data.resolvedAt?.toDate?.(),
      } as Issue;
    });

    return issues;
  } catch (error) {
    console.error("Error getting issues:", error);
    throw error;
  }
}

// Update issue status
export async function updateIssueStatus(
  issueId: string,
  status: Issue["status"],
  resolvedAt?: Date
): Promise<void> {
  try {
    const updates: Partial<Issue> = {
      status,
      updatedAt: new Date(),
    };

    if (status === "resolved" || status === "closed") {
      updates.resolvedAt = resolvedAt || new Date();
    }

    await updateIssue(issueId, updates);
  } catch (error) {
    console.error("Error updating issue status:", error);
    throw error;
  }
}


// Get statistics on issues
export async function getIssueStats(): Promise<{
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  urgent: number;
  totalRaised: number;
  totalNeeded: number;
}> {
  try {
    const allIssues = await getIssues();

    return {
      total: allIssues.length,
      open: allIssues.filter((i) => i.status === "open").length,
      inProgress: allIssues.filter((i) => i.status === "in-progress").length,
      resolved: allIssues.filter((i) => i.status === "resolved").length,
      closed: allIssues.filter((i) => i.status === "closed").length,
      urgent: allIssues.filter((i) => i.priority === "urgent").length,
      totalRaised: allIssues.reduce((sum, issue) => sum + issue.raisedAmount, 0),
      totalNeeded: allIssues.reduce((sum, issue) => sum + issue.estimatedCost, 0),
    };
  } catch (error) {
    console.error("Error getting issue stats:", error);
    throw error;
  }
}
