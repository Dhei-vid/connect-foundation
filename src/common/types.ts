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
  images: string[]; // Multiple images of the orphanage, children, facilities
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
  deadline?: Date | null;
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
  age: number;
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

// Content Block Types
export interface ContentBlock {
  id: string;
  type: "heading" | "paragraph" | "image" | "quote" | "embed" | "list" | "code";
  order: number;
}

export interface HeadingBlock extends ContentBlock {
  type: "heading";
  level: 1 | 2 | 3 | 4;
  text: string;
}

export interface ParagraphBlock extends ContentBlock {
  type: "paragraph";
  text: string;
}

export interface ImageBlock extends ContentBlock {
  type: "image";
  image: string;
  caption?: string;
  alt?: string;
}

export interface QuoteBlock extends ContentBlock {
  type: "quote";
  text: string;
  cite?: string;
}

export interface EmbedBlock extends ContentBlock {
  type: "embed";
  provider: "youtube" | "vimeo" | "other";
  src: string;
  title?: string;
}

export interface ListBlock extends ContentBlock {
  type: "list";
  items: string[];
  ordered: boolean;
}

export interface CodeBlock extends ContentBlock {
  type: "code";
  code: string;
  language?: string;
}

// Author Interface
export interface Author {
  name: string;
  role?: string;
  email?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[]; // Changed from string to ContentBlock array
  featuredImage?: string;
  author: Author; // Updated to use Author interface
  categories: string[];
  tags: string[];
  published: boolean;
  featured: boolean;
  readingTime: number; // in minutes
  views: number;
  likes: number;
  publishedAt: Date | string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  featuredImage?: string;
  startDate: Date;
  endDate: Date;
  location: {
    name: string;
    address: string;
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  organizer: {
    name: string;
    email: string;
    phone?: string;
  };
  category: "fundraising" | "volunteer" | "awareness" | "community" | "other";
  type: "online" | "physical" | "hybrid";
  maxAttendees?: number;
  currentAttendees: number;
  registrationRequired: boolean;
  registrationDeadline?: Date;
  registrationUrl?: string;
  cost: {
    amount: number;
    currency: string;
    free: boolean;
  };
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  featured: boolean;
  published: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  mode: "light" | "dark";
  primary: string;
  secondary: string;
  accent: string;
}
