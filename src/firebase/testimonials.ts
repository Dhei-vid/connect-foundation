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
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/config/firebase";

export type TestimonialType = "text" | "video";

export type TestimonialRecord = {
  id: string;
  name: string;
  role: string;
  email?: string;
  organization?: string;
  type: TestimonialType;
  content?: string;
  avatar?: string; // initial letters or URL to avatar
  avatarImageUrl?: string; // uploaded avatar image URL
  imageUrl?: string; // hero/cover image for card
  videoUrl?: string; // mp4 URL when type === "video"
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const COLLECTION = "testimonials";

export async function createTestimonial(
  data: Omit<TestimonialRecord, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateTestimonial(
  id: string,
  updates: Partial<TestimonialRecord>
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, { ...updates, updatedAt: Timestamp.now() });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export async function getTestimonial(
  id: string
): Promise<TestimonialRecord | null> {
  const ref = doc(db, COLLECTION, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.(),
    updatedAt: data.updatedAt?.toDate?.(),
  } as TestimonialRecord;
}

export async function getTestimonials(filters?: {
  publishedOnly?: boolean;
  limitCount?: number;
  type?: TestimonialType;
}): Promise<TestimonialRecord[]> {
  const base = collection(db, COLLECTION);
  const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];
  if (filters?.publishedOnly)
    constraints.unshift(where("published", "==", true));
  if (filters?.type) constraints.unshift(where("type", "==", filters.type));
  if (filters?.limitCount) constraints.push(limit(filters.limitCount));
  const q = query(base, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      ...data,
      createdAt: data.createdAt?.toDate?.(),
      updatedAt: data.updatedAt?.toDate?.(),
    } as TestimonialRecord;
  });
}
