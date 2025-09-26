// This script adds dummy data to test the admin dashboard
// Run this in the browser console or as a separate script

import { db } from "@/config/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

// Dummy data for testing
const dummyDonations = [
  {
    donorName: "John Smith",
    donorEmail: "john@example.com",
    amount: 5000,
    status: "completed",
    anonymous: false,
    message: "Happy to help the children",
    createdAt: Timestamp.now(),
  },
  {
    donorName: "Sarah Johnson",
    donorEmail: "sarah@example.com",
    amount: 2500,
    status: "completed",
    anonymous: false,
    message: "Keep up the great work!",
    createdAt: Timestamp.now(),
  },
  {
    donorName: "Anonymous",
    donorEmail: "anonymous@example.com",
    amount: 1000,
    status: "completed",
    anonymous: true,
    message: "For the children",
    createdAt: Timestamp.now(),
  },
];

const dummyVolunteers = [
  {
    firstName: "Alice",
    lastName: "Brown",
    email: "alice@example.com",
    phone: "+1234567890",
    dateOfBirth: Timestamp.fromDate(new Date("1990-01-01")),
    address: "123 Main St",
    city: "Lagos",
    state: "Lagos",
    skills: ["Teaching", "Cooking", "Childcare"],
    interests: ["Education", "Arts and Crafts"],
    availability: "weekends",
    experience: "intermediate",
    motivation: "Want to help children in need",
    status: "pending",
    backgroundCheckCompleted: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    firstName: "Bob",
    lastName: "Wilson",
    email: "bob@example.com",
    phone: "+1234567891",
    dateOfBirth: Timestamp.fromDate(new Date("1985-05-15")),
    address: "456 Oak Ave",
    city: "Abuja",
    state: "FCT",
    skills: ["Medical", "Counseling", "Sports"],
    interests: ["Healthcare", "Sports"],
    availability: "weekdays",
    experience: "expert",
    motivation: "Professional with medical background",
    status: "pending",
    backgroundCheckCompleted: false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

const dummyInquiries = [
  {
    name: "Michael Davis",
    email: "michael@example.com",
    subject: "Partnership Inquiry",
    message: "I would like to discuss partnership opportunities with your foundation.",
    status: "new",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    name: "Lisa Anderson",
    email: "lisa@example.com",
    subject: "Volunteer Information",
    message: "I'm interested in volunteering. Can you provide more information?",
    status: "new",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

const dummyIssues = [
  {
    orphanageId: "test-orphanage-1",
    orphanageName: "Hope Children's Home",
    title: "Medical Supplies Needed",
    description: "We need medical supplies for our children's health center.",
    category: "medical",
    priority: "urgent",
    status: "open",
    images: [],
    estimatedCost: 50000,
    raisedAmount: 15000,
    deadline: Timestamp.fromDate(new Date("2024-12-31")),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
  {
    orphanageId: "test-orphanage-2",
    orphanageName: "Grace Orphanage",
    title: "Educational Materials",
    description: "We need books and educational materials for our school.",
    category: "education",
    priority: "high",
    status: "open",
    images: [],
    estimatedCost: 30000,
    raisedAmount: 8000,
    deadline: Timestamp.fromDate(new Date("2024-11-30")),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  },
];

export async function seedAdminDashboard() {
  try {
    console.log("Starting to seed admin dashboard data...");

    // Add donations
    for (const donation of dummyDonations) {
      await addDoc(collection(db, "donations"), donation);
      console.log("Added donation:", donation.donorName);
    }

    // Add volunteers
    for (const volunteer of dummyVolunteers) {
      await addDoc(collection(db, "volunteers"), volunteer);
      console.log("Added volunteer:", volunteer.firstName, volunteer.lastName);
    }

    // Add inquiries
    for (const inquiry of dummyInquiries) {
      await addDoc(collection(db, "contactInquiries"), inquiry);
      console.log("Added inquiry:", inquiry.name);
    }

    // Add issues
    for (const issue of dummyIssues) {
      await addDoc(collection(db, "issues"), issue);
      console.log("Added issue:", issue.title);
    }

    console.log("Admin dashboard data seeded successfully!");
  } catch (error) {
    console.error("Error seeding admin dashboard data:", error);
  }
}

// Uncomment the line below to run the seeding function
// seedAdminDashboard();

