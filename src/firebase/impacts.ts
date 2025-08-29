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
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Issue, SuccessStory } from '@/common/types';

// Issues
export async function createIssue(issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'issues'), {
      ...issueData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating issue:', error);
    throw error;
  }
}

export async function updateIssue(issueId: string, updates: Partial<Issue>): Promise<void> {
  try {
    const issueRef = doc(db, 'issues', issueId);
    await updateDoc(issueRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating issue:', error);
    throw error;
  }
}

export async function deleteIssue(issueId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'issues', issueId));
  } catch (error) {
    console.error('Error deleting issue:', error);
    throw error;
  }
}

export async function getIssues(filters?: {
  status?: Issue['status'];
  category?: Issue['category'];
  priority?: Issue['priority'];
  orphanageId?: string;
}): Promise<Issue[]> {
  try {
    let q = collection(db, 'issues');
    
    if (filters) {
      if (filters.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters.category) {
        q = query(q, where('category', '==', filters.category));
      }
      if (filters.priority) {
        q = query(q, where('priority', '==', filters.priority));
      }
      if (filters.orphanageId) {
        q = query(q, where('orphanageId', '==', filters.orphanageId));
      }
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      deadline: doc.data().deadline?.toDate(),
      resolvedAt: doc.data().resolvedAt?.toDate(),
    })) as Issue[];
  } catch (error) {
    console.error('Error getting issues:', error);
    throw error;
  }
}

export async function getIssue(issueId: string): Promise<Issue | null> {
  try {
    const docRef = doc(db, 'issues', issueId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        deadline: data.deadline?.toDate(),
        resolvedAt: data.resolvedAt?.toDate(),
      } as Issue;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting issue:', error);
    throw error;
  }
}

// Success Stories
export async function createSuccessStory(storyData: Omit<SuccessStory, 'id' | 'createdAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'successStories'), {
      ...storyData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating success story:', error);
    throw error;
  }
}

export async function getSuccessStories(limitCount: number = 10): Promise<SuccessStory[]> {
  try {
    const q = query(
      collection(db, 'successStories'),
      orderBy('completedAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      completedAt: doc.data().completedAt.toDate(),
    })) as SuccessStory[];
  } catch (error) {
    console.error('Error getting success stories:', error);
    throw error;
  }
}

export async function getSuccessStory(storyId: string): Promise<SuccessStory | null> {
  try {
    const docRef = doc(db, 'successStories', storyId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        completedAt: data.completedAt.toDate(),
      } as SuccessStory;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting success story:', error);
    throw error;
  }
}
