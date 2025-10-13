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
import type { FinancialRecord } from "@/common/types";

// --------------------
// FINANCIAL RECORDS CRUD OPERATIONS
// --------------------

// Create a new financial record
export async function createFinancialRecord(
  recordData: Omit<FinancialRecord, "id">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "financial-records"), {
      ...recordData,
      date: Timestamp.fromDate(recordData.date),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating financial record:", error);
    throw error;
  }
}

// Update a financial record
export async function updateFinancialRecord(
  recordId: string,
  updates: Partial<FinancialRecord>
): Promise<void> {
  try {
    const recordRef = doc(db, "financial-records", recordId);
    const updateData: Record<string, unknown> = { ...updates };
    
    // Convert date to Timestamp if it exists in updates
    if (updates.date) {
      updateData.date = Timestamp.fromDate(updates.date);
    }
    
    await updateDoc(recordRef, updateData);
  } catch (error) {
    console.error("Error updating financial record:", error);
    throw error;
  }
}

// Delete a financial record
export async function deleteFinancialRecord(recordId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "financial-records", recordId));
  } catch (error) {
    console.error("Error deleting financial record:", error);
    throw error;
  }
}

// Get a single financial record by ID
export async function getFinancialRecord(recordId: string): Promise<FinancialRecord | null> {
  try {
    const docRef = doc(db, "financial-records", recordId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        date: data.date?.toDate?.() || new Date(),
      } as FinancialRecord;
    }

    return null;
  } catch (error) {
    console.error("Error getting financial record:", error);
    throw error;
  }
}

// Get financial records with optional filters
export async function getFinancialRecords(filters?: {
  type?: "income" | "expense";
  category?: string;
  startDate?: Date;
  endDate?: Date;
  limitCount?: number;
}): Promise<FinancialRecord[]> {
  try {
    const recordsRef = collection(db, "financial-records");
    const constraints = [];

    // Apply filters
    if (filters?.type) {
      constraints.push(where("type", "==", filters.type));
    }
    if (filters?.category) {
      constraints.push(where("category", "==", filters.category));
    }
    if (filters?.startDate) {
      constraints.push(where("date", ">=", Timestamp.fromDate(filters.startDate)));
    }
    if (filters?.endDate) {
      constraints.push(where("date", "<=", Timestamp.fromDate(filters.endDate)));
    }

    // Always order by date (newest first)
    constraints.push(orderBy("date", "desc"));

    // Apply limit if specified
    if (filters?.limitCount) {
      constraints.push(limit(filters.limitCount));
    }

    const q = query(recordsRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const records = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        date: data.date?.toDate?.() || new Date(),
      } as FinancialRecord;
    });

    return records;
  } catch (error) {
    console.error("Error getting financial records:", error);
    throw error;
  }
}

// Get financial statistics
export async function getFinancialStats(filters?: {
  startDate?: Date;
  endDate?: Date;
}): Promise<{
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  incomeByCategory: { [category: string]: number };
  expensesByCategory: { [category: string]: number };
  recordCount: number;
}> {
  try {
    const records = await getFinancialRecords(filters);

    const incomeByCategory: { [category: string]: number } = {};
    const expensesByCategory: { [category: string]: number } = {};
    let totalIncome = 0;
    let totalExpenses = 0;

    records.forEach((record) => {
      if (record.type === "income") {
        totalIncome += record.amount;
        incomeByCategory[record.category] = 
          (incomeByCategory[record.category] || 0) + record.amount;
      } else {
        totalExpenses += record.amount;
        expensesByCategory[record.category] = 
          (expensesByCategory[record.category] || 0) + record.amount;
      }
    });

    return {
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      incomeByCategory,
      expensesByCategory,
      recordCount: records.length,
    };
  } catch (error) {
    console.error("Error getting financial stats:", error);
    throw error;
  }
}

// Get records for a specific period
export async function getRecordsByPeriod(
  period: "month" | "quarter" | "year"
): Promise<FinancialRecord[]> {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "quarter":
      const currentQuarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
  }

  return getFinancialRecords({
    startDate,
    endDate: now,
  });
}
