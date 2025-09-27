import { Gender } from "./enums";

export interface User {
  uid: string;
  email: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  country?: string;
  gender?: Gender;
  displayName?: string;
  photoURL?: string;
  role: "ADMIN" | "ORPHANAGE";
  onboardingCompleted: boolean;
  verified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface Orphanage {
  id: string;
  name: string;
  location: string;
  address: string;
  state: string;
  city: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  website?: string;
  logoURL?: string;
  coverImageURL?: string;
  childrenCount: number;
  staffCount: number;
  foundedYear: number;
  verified: boolean;
  // Contact person details
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonEmail: string;
  contactPersonPhone: string;
  contactPersonPosition: string;
  // Additional details
  registrationNumber?: string;
  licenseNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  accountName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Issue {
  id: string;
  orphanageId: string;
  orphanageName: string;
  title: string;
  description: string;
  category: "medical" | "education" | "food" | "shelter" | "clothing" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  images: string[];
  estimatedCost: number;
  raisedAmount: number;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface SuccessStory {
  id: string;
  orphanageId: string;
  orphanageName: string;
  issueId: string; // Link to the resolved issue
  issueTitle: string; // Title of the resolved issue
  title: string;
  description: string;
  impact: string;
  images: string[];
  beneficiaries: number;
  cost: number;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Donation {
  id: string;
  donorId?: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  message?: string;
  anonymous: boolean;
  targetIssueId?: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}

export interface FinancialRecord {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: Date;
  receiptURL?: string;
  notes?: string;
}

export interface ContactInquiry {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

export interface Volunteer {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: Gender;
  address: string;
  city: string;
  state: string;
  country: string;
  skills: string[];
  interests: string[];
  availability: "weekdays" | "weekends" | "both" | "flexible";
  experience: "none" | "beginner" | "intermediate" | "advanced";
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  backgroundCheckCompleted: boolean;
  status: "pending" | "approved" | "rejected" | "suspended";
  assignedOrphanageId?: string;
  assignedOrphanageName?: string;
  notes?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  timeCommitment: string;
  location: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  mode: "light" | "dark";
  primary: string;
  secondary: string;
  accent: string;
}
