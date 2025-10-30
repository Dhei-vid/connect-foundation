import type { SuccessStory, Orphanage } from "./types";

// Mock Orphanages Data
export const mockOrphanages: Omit<
  Orphanage,
  "logoURLFile" | "coverImageFile" | "imageFiles"
>[] = [
  {
    id: "1",
    name: "Hope Children's Home",
    location: "Lagos, Nigeria",
    address: "123 Hope Street, Ikeja",
    state: "Lagos",
    city: "Ikeja",
    description:
      "A caring home providing shelter, education, and love to orphaned children since 2010. We focus on holistic development and preparing children for successful futures.",
    contactEmail: "info@hopechildrenshome.org",
    contactPhone: "+234 801 234 5678",
    website: "https://hopechildrenshome.org",
    logoURL:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&auto=format&fit=crop&q=60",
    coverImageURL:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&auto=format&fit=crop&q=80",
    ],
    childrenCount: 150,
    staffCount: 25,
    foundedYear: 2010,
    verified: true,
    contactPersonFirstName: "Adewale",
    contactPersonLastName: "Johnson",
    contactPersonEmail: "adewale@hopechildrenshome.org",
    contactPersonPhone: "+234 801 234 5678",
    contactPersonPosition: "Director",
    registrationNumber: "RC-123456",
    licenseNumber: "LIC-789012",
    bankAccountNumber: "1234567890",
    bankName: "First Bank of Nigeria",
    accountName: "Hope Children's Home",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-10-10"),
    periodicMonitoring: false,
    communityService: false,
    agerange: "",
  },
  {
    id: "2",
    name: "Bright Future Orphanage",
    location: "Abuja, Nigeria",
    address: "456 Future Avenue, Garki",
    state: "FCT",
    city: "Garki",
    description:
      "Committed to providing quality education and healthcare to vulnerable children. Our mission is to ensure every child has a bright future ahead.",
    contactEmail: "contact@brightfuture.org",
    contactPhone: "+234 802 345 6789",
    logoURL:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&auto=format&fit=crop&q=60",
    coverImageURL:
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&auto=format&fit=crop&q=80",
    ],
    childrenCount: 200,
    staffCount: 30,
    foundedYear: 2012,
    verified: true,
    contactPersonFirstName: "Chioma",
    contactPersonLastName: "Okafor",
    contactPersonEmail: "chioma@brightfuture.org",
    contactPersonPhone: "+234 802 345 6789",
    contactPersonPosition: "Founder & CEO",
    registrationNumber: "RC-234567",
    licenseNumber: "LIC-890123",
    bankAccountNumber: "2345678901",
    bankName: "GTBank",
    accountName: "Bright Future Orphanage",
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2024-10-11"),
    periodicMonitoring: false,
    communityService: false,
    agerange: "",
  },
  {
    id: "3",
    name: "Grace Foundation",
    location: "Port Harcourt, Nigeria",
    address: "789 Grace Road, GRA",
    state: "Rivers",
    city: "Port Harcourt",
    description:
      "Dedicated to rescuing and rehabilitating abandoned children. We provide medical care, education, and emotional support to help children thrive.",
    contactEmail: "info@gracefoundation.org",
    contactPhone: "+234 803 456 7890",
    logoURL:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&auto=format&fit=crop&q=60",
    coverImageURL:
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&auto=format&fit=crop&q=80",
    ],
    childrenCount: 100,
    staffCount: 18,
    foundedYear: 2015,
    verified: true,
    contactPersonFirstName: "Emmanuel",
    contactPersonLastName: "Nwosu",
    contactPersonEmail: "emmanuel@gracefoundation.org",
    contactPersonPhone: "+234 803 456 7890",
    contactPersonPosition: "Director",
    registrationNumber: "RC-345678",
    licenseNumber: "LIC-901234",
    bankAccountNumber: "3456789012",
    bankName: "Zenith Bank",
    accountName: "Grace Foundation",
    createdAt: new Date("2023-05-10"),
    updatedAt: new Date("2024-10-12"),
    periodicMonitoring: false,
    communityService: false,
    agerange: "",
  },
  {
    id: "4",
    name: "Little Angels Home",
    location: "Kano, Nigeria",
    address: "321 Angels Street, Nassarawa",
    state: "Kano",
    city: "Nassarawa",
    description:
      "A safe haven for orphaned and vulnerable children. We focus on education, skill development, and creating a loving family environment.",
    contactEmail: "contact@littleangels.org",
    contactPhone: "+234 804 567 8901",
    logoURL:
      "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400&auto=format&fit=crop&q=60",
    coverImageURL:
      "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=1200&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&auto=format&fit=crop&q=80",
    ],
    childrenCount: 120,
    staffCount: 22,
    foundedYear: 2013,
    verified: true,
    contactPersonFirstName: "Fatima",
    contactPersonLastName: "Abdullahi",
    contactPersonEmail: "fatima@littleangels.org",
    contactPersonPhone: "+234 804 567 8901",
    contactPersonPosition: "Executive Director",
    registrationNumber: "RC-456789",
    licenseNumber: "LIC-012345",
    bankAccountNumber: "4567890123",
    bankName: "UBA",
    accountName: "Little Angels Home",
    createdAt: new Date("2023-07-05"),
    updatedAt: new Date("2024-10-09"),
    periodicMonitoring: true,
    communityService: false,
    agerange: "",
  },
];

// Mock Success Stories Data
export const mockSuccessStories: SuccessStory[] = [
  {
    id: "1",
    orphanageId: "1",
    orphanageName: "Hope Children's Home",
    issueId: "issue-1",
    issueTitle: "Medical Equipment for Clinic",
    title: "New Medical Clinic Transforms Healthcare Access",
    description:
      "With the generous support of donors, Hope Children's Home successfully established a fully-equipped medical clinic. The clinic now serves all 150 children with regular checkups, immunizations, and emergency care. Before this project, children had to travel long distances for basic medical attention, often resulting in delayed treatment and complications.",
    impact:
      "The new medical clinic has dramatically improved the health outcomes of children at Hope Children's Home. Within the first six months, we've seen a 75% reduction in hospital visits, 100% immunization coverage, and early detection of several treatable conditions. The clinic also serves the surrounding community, providing healthcare to over 300 additional children monthly. This investment in healthcare has created a foundation for the children's long-term wellbeing and development.",
    images: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516841273335-e39b37888115?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80",
    ],
    beneficiaries: 150,
    cost: 2500000,
    completedAt: new Date("2024-05-15"),
    createdAt: new Date("2024-05-20"),
    updatedAt: new Date("2024-05-20"),
  },
  {
    id: "2",
    orphanageId: "2",
    orphanageName: "Bright Future Orphanage",
    issueId: "issue-2",
    issueTitle: "Computer Lab and Internet Access",
    title: "Digital Education Lab Bridges Technology Gap",
    description:
      "Bright Future Orphanage received funding to build a state-of-the-art computer lab with 50 computers, high-speed internet, and educational software. The project also included training for staff and students on digital literacy, coding, and online learning platforms. This has opened up a world of opportunities for children who previously had no access to technology.",
    impact:
      "The digital education lab has revolutionized learning at Bright Future Orphanage. All 200 children now have access to computers and the internet, enabling them to develop crucial 21st-century skills. Students have completed over 1,000 online courses, learned basic coding, and improved their academic performance by 40%. Several older students have already secured internships with tech companies. The lab also hosts weekend coding clubs and has become a community resource center.",
    images: [
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80",
    ],
    beneficiaries: 200,
    cost: 3200000,
    completedAt: new Date("2024-06-20"),
    createdAt: new Date("2024-06-25"),
    updatedAt: new Date("2024-06-25"),
  },
  {
    id: "3",
    orphanageId: "3",
    orphanageName: "Grace Foundation",
    issueId: "issue-3",
    issueTitle: "Renovation of Dormitories",
    title: "Dormitory Renovation Creates Safe, Comfortable Homes",
    description:
      "Grace Foundation's dormitories were in dire need of repair, with leaking roofs, broken windows, and inadequate beds. Thanks to donor support, we completed a comprehensive renovation including new roofing, fresh paint, proper ventilation, comfortable beds, and adequate lighting. The project also included creating separate spaces for different age groups and study areas.",
    impact:
      "The dormitory renovation has significantly improved the living conditions and wellbeing of all 100 children at Grace Foundation. Children now sleep in comfortable, safe beds in well-ventilated rooms. The improved living conditions have led to better sleep quality, reduced illness rates, and improved academic performance. Children report feeling more at home and secure. The dedicated study areas have created quiet spaces for homework, resulting in a 50% improvement in test scores. Parents visiting for adoptions have noted the warm, homelike environment.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80",
    ],
    beneficiaries: 100,
    cost: 1800000,
    completedAt: new Date("2024-07-10"),
    createdAt: new Date("2024-07-15"),
    updatedAt: new Date("2024-07-15"),
  },
  {
    id: "4",
    orphanageId: "4",
    orphanageName: "Little Angels Home",
    issueId: "issue-4",
    issueTitle: "Vocational Training Center",
    title: "Vocational Training Center Empowers Youth for Employment",
    description:
      "Little Angels Home established a vocational training center offering courses in tailoring, carpentry, catering, and computer skills. The center provides older children with practical skills and certification, preparing them for employment or entrepreneurship. The project included purchasing equipment, hiring skilled instructors, and creating partnerships with local businesses for internships.",
    impact:
      "The vocational training center has transformed the futures of teenagers at Little Angels Home. Over 80 young people have completed training programs, with 65% securing employment or starting their own businesses within three months of graduation. Success stories include a former resident who now runs a successful catering business employing five people, and three graduates who work as professional tailors. The center has become self-sustaining through paid training programs for community members, generating income that supports the orphanage's operations.",
    images: [
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
    ],
    beneficiaries: 120,
    cost: 2800000,
    completedAt: new Date("2024-08-05"),
    createdAt: new Date("2024-08-10"),
    updatedAt: new Date("2024-08-10"),
  },
  {
    id: "5",
    orphanageId: "1",
    orphanageName: "Hope Children's Home",
    issueId: "issue-5",
    issueTitle: "Library and Reading Program",
    title: "Modern Library Ignites Love for Reading and Learning",
    description:
      "Hope Children's Home created a vibrant library with over 2,000 books, comfortable reading spaces, and a reading program facilitated by trained volunteers. The library includes books for all age groups, educational materials, and access to digital books. Regular storytelling sessions, book clubs, and reading competitions encourage children to develop a love for reading.",
    impact:
      "The library has become the heart of learning at Hope Children's Home. Reading levels have improved by an average of two grades within one year. Children who struggled with literacy now read confidently. The library hosts 15 reading sessions weekly, with 100% participation from children. Test scores in English and comprehension have improved by 60%. Children have developed creativity through writing clubs, with several winning national essay competitions. The library has also become a quiet sanctuary for children, promoting mental wellbeing and imagination.",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&auto=format&fit=crop&q=80",
    ],
    beneficiaries: 150,
    cost: 1200000,
    completedAt: new Date("2024-09-12"),
    createdAt: new Date("2024-09-17"),
    updatedAt: new Date("2024-09-17"),
  },
  {
    id: "6",
    orphanageId: "2",
    orphanageName: "Bright Future Orphanage",
    issueId: "issue-6",
    issueTitle: "Solar Power Installation",
    title: "Solar Energy System Provides Reliable Power and Savings",
    description:
      "Bright Future Orphanage installed a comprehensive solar power system to address frequent power outages and high electricity costs. The system includes solar panels, battery storage, and backup systems ensuring 24/7 power supply. This enables uninterrupted education, refrigeration for food and medicine, and better security with outdoor lighting.",
    impact:
      "The solar power installation has been a game-changer for Bright Future Orphanage. Power is now available 24/7, enabling children to study at night and improving safety with well-lit premises. The orphanage saves ₦150,000 monthly on electricity bills, funds now redirected to feeding and education. Food spoilage has reduced by 90% with reliable refrigeration. The computer lab operates without interruption, medical equipment works reliably, and security cameras function continuously. The environmental impact is significant, reducing carbon emissions by 15 tons annually.",
    images: [
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=800&auto=format&fit=crop&q=80",
    ],
    beneficiaries: 200,
    cost: 4500000,
    completedAt: new Date("2024-04-25"),
    createdAt: new Date("2024-04-30"),
    updatedAt: new Date("2024-04-30"),
  },
  {
    id: "7",
    orphanageId: "3",
    orphanageName: "Grace Foundation",
    issueId: "issue-7",
    issueTitle: "Nutrition and Kitchen Upgrade",
    title: "Modern Kitchen and Nutrition Program Improves Health",
    description:
      "Grace Foundation upgraded their kitchen facilities and implemented a comprehensive nutrition program. The project included modern cooking equipment, food storage facilities, and hiring a nutritionist to develop balanced meal plans. The kitchen now meets health standards and can efficiently prepare nutritious meals for all children.",
    impact:
      "The nutrition program has dramatically improved the health and development of children at Grace Foundation. Cases of malnutrition have dropped from 40% to zero. Children have gained healthy weight, and growth charts show 95% of children now meeting age-appropriate development markers. Illness rates have decreased by 60%. The children enjoy varied, nutritious meals three times daily, plus healthy snacks. Energy levels have improved, leading to better participation in school and activities. Cooking classes for older children teach life skills and healthy eating habits.",
    images: [
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    ],
    beneficiaries: 100,
    cost: 1500000,
    completedAt: new Date("2024-03-18"),
    createdAt: new Date("2024-03-23"),
    updatedAt: new Date("2024-03-23"),
  },
  {
    id: "8",
    orphanageId: "4",
    orphanageName: "Little Angels Home",
    issueId: "issue-8",
    issueTitle: "Sports and Recreation Facilities",
    title: "Sports Complex Promotes Health and Teamwork",
    description:
      "Little Angels Home built a multi-purpose sports complex including a football field, basketball court, playground equipment, and covered recreation area. The project also provided sports equipment, uniforms, and coaching from professional trainers. Regular sports activities, tournaments, and physical education classes are now part of the daily routine.",
    impact:
      "The sports complex has transformed physical and mental health at Little Angels Home. Physical fitness levels have improved significantly, with obesity rates dropping from 25% to 5%. Children participate in organized sports daily, developing teamwork, discipline, and leadership skills. The orphanage football team won the regional championship, boosting confidence and pride. Sports have provided a positive outlet for energy and emotions, reducing behavioral issues by 70%. Inter-orphanage tournaments have created friendships and networks. Several talented athletes have been scouted for sports academies.",
    images: [
      "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&auto=format&fit=crop&q=80",
    ],
    beneficiaries: 120,
    cost: 3500000,
    completedAt: new Date("2024-02-14"),
    createdAt: new Date("2024-02-19"),
    updatedAt: new Date("2024-02-19"),
  },
];

// Mock statistics
export const mockSuccessStoryStats = {
  total: mockSuccessStories.length,
  totalBeneficiaries: mockSuccessStories.reduce(
    (sum, story) => sum + story.beneficiaries,
    0
  ),
  totalCost: mockSuccessStories.reduce((sum, story) => sum + story.cost, 0),
  byOrphanage: mockSuccessStories.reduce((acc, story) => {
    acc[story.orphanageId] = (acc[story.orphanageId] || 0) + 1;
    return acc;
  }, {} as { [orphanageId: string]: number }),
};

// Helper function to get orphanage by ID
export const getMockOrphanageById = (
  id: string
): Omit<Orphanage, "logoURLFile" | "coverImageFile" | "imageFiles"> | null => {
  return mockOrphanages.find((orphanage) => orphanage.id === id) || null;
};

// Helper function to get success stories with optional filters
export const getMockSuccessStories = (filters?: {
  orphanageId?: string;
  issueId?: string;
  limitCount?: number;
}): SuccessStory[] => {
  let stories = [...mockSuccessStories];

  if (filters?.orphanageId) {
    stories = stories.filter(
      (story) => story.orphanageId === filters.orphanageId
    );
  }

  if (filters?.issueId) {
    stories = stories.filter((story) => story.issueId === filters.issueId);
  }

  if (filters?.limitCount) {
    stories = stories.slice(0, filters.limitCount);
  }

  return stories;
};
