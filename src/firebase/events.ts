/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import type { Event } from "@/common/types";

const EVENTS_COLLECTION = "events";

// Safely convert Firestore Timestamp | Date | string | number to Date
function toDateSafe(value: any): Date | undefined {
  if (!value) return undefined;
  if (typeof value?.toDate === "function") return value.toDate(); // Firestore Timestamp
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
}

function mapDocToEvent(doc: any): Event {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    startDate: toDateSafe(data.startDate),
    endDate: toDateSafe(data.endDate),
    registrationDeadline: toDateSafe(data.registrationDeadline),
    createdAt: toDateSafe(data.createdAt)!,
    updatedAt: toDateSafe(data.updatedAt)!,
  } as Event;
}

export async function getAllEvents(limitCount?: number): Promise<Event[]> {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      orderBy("startDate", "asc"),
      limitCount ? limit(limitCount) : limit(20)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToEvent) as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return mapDocToEvent({ id: docSnap.id, data: () => docSnap.data() });
    }
    return null;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw error;
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where("slug", "==", slug),
      where("published", "==", true)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return mapDocToEvent(doc);
  } catch (error) {
    console.error("Error fetching event by slug:", error);
    throw error;
  }
}

export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const now = new Date();
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where("published", "==", true),
      where("startDate", ">=", now),
      orderBy("startDate", "asc"),
      limit(10)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToEvent) as Event[];
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }
}

export async function getFeaturedEvents(): Promise<Event[]> {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where("published", "==", true),
      where("featured", "==", true),
      orderBy("startDate", "asc"),
      limit(3)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToEvent) as Event[];
  } catch (error) {
    console.error("Error fetching featured events:", error);
    throw error;
  }
}

export async function getEventsByCategory(category: string): Promise<Event[]> {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where("published", "==", true),
      where("category", "==", category),
      orderBy("startDate", "asc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDocToEvent) as Event[];
  } catch (error) {
    console.error("Error fetching events by category:", error);
    throw error;
  }
}

export async function searchEvents(searchTerm: string): Promise<Event[]> {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where("published", "==", true),
      orderBy("startDate", "asc")
    );

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map(mapDocToEvent) as Event[];

    // Filter events by search term (title, description, location)
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching events:", error);
    throw error;
  }
}

export async function incrementEventViews(id: string): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    await updateDoc(docRef, {
      views: increment(1),
    });
  } catch (error) {
    console.error("Error incrementing event views:", error);
    throw error;
  }
}

export async function incrementEventAttendees(id: string): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    await updateDoc(docRef, {
      currentAttendees: increment(1),
    });
  } catch (error) {
    console.error("Error incrementing event attendees:", error);
    throw error;
  }
}

export async function createEvent(
  event: Omit<Event, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...event,
      views: 0,
      currentAttendees: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function updateEvent(
  id: string,
  updates: Partial<Event>
): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
}
