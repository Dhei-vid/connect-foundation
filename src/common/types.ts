export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'orphanage' | 'donor';
  createdAt: Date;
  lastLoginAt: Date;
}

export interface Orphanage {
  id: string;
  name: string;
  location: string;
  description: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  logoURL?: string;
  coverImageURL?: string;
  childrenCount: number;
  staffCount: number;
  foundedYear: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Issue {
  id: string;
  orphanageId: string;
  orphanageName: string;
  title: string;
  description: string;
  category: 'medical' | 'education' | 'food' | 'shelter' | 'clothing' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
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
  title: string;
  description: string;
  impact: string;
  images: string[];
  beneficiaries: number;
  cost: number;
  completedAt: Date;
  createdAt: Date;
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
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: Date;
  receiptURL?: string;
  notes?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Theme {
  mode: 'light' | 'dark';
  primary: string;
  secondary: string;
  accent: string;
}
