import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import type { User, Orphanage } from '@/common/types';

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: 'orphanage' | 'donor' = 'donor'
): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    const userData: User = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return userData;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    const userData = userDoc.data() as User;

    // Update last login
    await updateDoc(doc(db, 'users', user.uid), {
      lastLoginAt: new Date(),
    });

    return { ...userData, lastLoginAt: new Date() };
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          callback(userDoc.data() as User);
        } else {
          callback(null);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}

export async function createOrphanageProfile(
  userId: string,
  orphanageData: Omit<Orphanage, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  try {
    const orphanage: Orphanage = {
      id: userId,
      ...orphanageData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'orphanages', userId), orphanage);
  } catch (error) {
    console.error('Error creating orphanage profile:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const user = auth.currentUser;
  if (!user) return null;

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
  } catch (error) {
    console.error('Error getting current user:', error);
  }

  return null;
}
