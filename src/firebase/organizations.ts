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
import type { Orphanage } from '@/common/types';

export async function createOrphanage(orphanageData: Omit<Orphanage, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'orphanages'), {
      ...orphanageData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating orphanage:', error);
    throw error;
  }
}

export async function updateOrphanage(orphanageId: string, updates: Partial<Orphanage>): Promise<void> {
  try {
    const orphanageRef = doc(db, 'orphanages', orphanageId);
    await updateDoc(orphanageRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating orphanage:', error);
    throw error;
  }
}

export async function deleteOrphanage(orphanageId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'orphanages', orphanageId));
  } catch (error) {
    console.error('Error deleting orphanage:', error);
    throw error;
  }
}

export async function getOrphanage(orphanageId: string): Promise<Orphanage | null> {
  try {
    const docRef = doc(db, 'orphanages', orphanageId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Orphanage;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting orphanage:', error);
    throw error;
  }
}

export async function getOrphanages(filters?: {
  verified?: boolean;
  location?: string;
}): Promise<Orphanage[]> {
  try {
    let q = collection(db, 'orphanages');
    
    if (filters) {
      if (filters.verified !== undefined) {
        q = query(q, where('verified', '==', filters.verified));
      }
      if (filters.location) {
        q = query(q, where('location', '==', filters.location));
      }
    }
    
    q = query(q, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Orphanage[];
  } catch (error) {
    console.error('Error getting orphanages:', error);
    throw error;
  }
}

export async function getVerifiedOrphanages(limitCount: number = 10): Promise<Orphanage[]> {
  try {
    const q = query(
      collection(db, 'orphanages'),
      where('verified', '==', true),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Orphanage[];
  } catch (error) {
    console.error('Error getting verified orphanages:', error);
    throw error;
  }
}

export async function verifyOrphanage(orphanageId: string): Promise<void> {
  try {
    const orphanageRef = doc(db, 'orphanages', orphanageId);
    await updateDoc(orphanageRef, {
      verified: true,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error verifying orphanage:', error);
    throw error;
  }
}
