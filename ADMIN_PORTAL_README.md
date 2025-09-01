# Admin Portal - Connect Foundation

A comprehensive admin portal for managing the Connect Foundation charity platform, built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Features

### 📊 Dashboard
- **Overview Statistics**: Total orphanages, donations, success stories, and active issues
- **Quick Actions**: Direct access to key management functions
- **Recent Activity**: Real-time updates on platform activities
- **Pending Actions**: Alerts for orphanage verifications and urgent issues

### 🏠 Orphanages Management
- **Orphanage List**: View all registered orphanages with verification status
- **Verification System**: Approve or reject orphanage registrations
- **Detailed Profiles**: Complete orphanage information including contact details, statistics, and images
- **Search & Filter**: Find orphanages by name, location, or verification status
- **Statistics**: Track total children, staff, and orphanage counts

### ❤️ Success Stories Management
- **Story Creation**: Add new success stories with images and impact details
- **Story Editing**: Update existing stories and their content
- **Impact Tracking**: Monitor beneficiaries helped and costs involved
- **Image Management**: Upload and manage story images
- **Statistics**: Track total stories, beneficiaries, and investment amounts

### 🚨 Issues & Requests Management
- **Issue Tracking**: Monitor all orphanage requests and their status
- **Priority Management**: Categorize issues by urgency (low, medium, high, urgent)
- **Status Updates**: Track progress from open to resolved
- **Financial Tracking**: Monitor estimated costs vs raised amounts
- **Category Filtering**: Filter by medical, education, food, shelter, clothing, or other
- **Deadline Management**: Track issue deadlines and completion dates

### 💰 Donations Management
- **Donation Tracking**: Monitor all incoming donations
- **Status Management**: Track pending, completed, and failed donations
- **Donor Information**: View donor details (with privacy controls)
- **Target Assignment**: Link donations to specific issues
- **Export Functionality**: Export donation data for reporting
- **Financial Analytics**: Track donation trends and patterns

### 📈 Financial Transparency Dashboard
- **Income Tracking**: Monitor all revenue sources (donations, grants, fundraising)
- **Expense Management**: Track all expenditures by category
- **Financial Records**: Detailed transaction history with receipts
- **Category Breakdown**: Visual representation of income and expense categories
- **Efficiency Metrics**: Calculate funds-to-programs ratio
- **Period Analysis**: View financial data by month, quarter, or year

### 📧 Contact Inquiries Management
- **Inquiry Tracking**: Manage all contact form submissions
- **Status Management**: Track new, read, replied, and closed inquiries
- **Response System**: Built-in reply functionality
- **Inquiry Types**: Handle volunteer requests, donation inquiries, partnership opportunities
- **Archive System**: Close and archive resolved inquiries

### 👥 Users Management
- **User Accounts**: Manage all platform users (admins, orphanages, donors)
- **Role Management**: Assign and modify user roles
- **Account Details**: View user profiles and activity
- **User Statistics**: Track user registrations and activity
- **Account Actions**: Edit, delete, or modify user accounts

### ⚙️ Settings & Configuration
- **Organization Settings**: Configure foundation details and contact information
- **Admin Settings**: Manage admin account information
- **Notification Preferences**: Configure email and SMS notifications
- **System Settings**: Set auto-approval rules, verification requirements
- **Security Settings**: Configure 2FA, session timeouts, password policies

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React hooks and local state
- **Authentication**: Role-based access control (ready for integration)

## 📁 File Structure

```
src/app/(admin)/
├── layout.tsx                 # Admin layout with sidebar navigation
├── page.tsx                   # Main dashboard
├── signin/
│   └── page.tsx              # Admin sign-in page
├── signup/
│   └── page.tsx              # Admin registration page
├── orphanages/
│   └── page.tsx              # Orphanages management
├── success-stories/
│   └── page.tsx              # Success stories management
├── issues/
│   └── page.tsx              # Issues and requests management
├── donations/
│   └── page.tsx              # Donations tracking
├── financial/
│   └── page.tsx              # Financial transparency dashboard
├── contact/
│   └── page.tsx              # Contact inquiries management
├── users/
│   └── page.tsx              # Users management
└── settings/
    └── page.tsx              # System settings
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Access the admin portal at:
   - Admin Sign-in: `http://localhost:3000/admin/signin`
   - Admin Dashboard: `http://localhost:3000/admin`

### Demo Credentials
For testing purposes, use the admin code `ADMIN2024` during registration.

## 🔐 Authentication & Security

### Admin Access
- **Sign-in**: `/admin/signin` - Secure admin authentication
- **Registration**: `/admin/signup` - Admin account creation with verification code
- **Role-based Access**: Admin-only features and data access

### Security Features
- Password visibility toggle
- Form validation
- Admin code verification
- Session management (ready for implementation)
- Role-based permissions

## 📊 Data Management

### Mock Data
The admin portal currently uses mock data for demonstration purposes. In production, this would be connected to:
- Firebase Firestore for data storage
- Firebase Authentication for user management
- Real-time updates for live data

### Data Types
- **Orphanages**: Complete orphanage profiles with verification status
- **Success Stories**: Impact stories with images and metrics
- **Issues**: Orphanage requests with priority and status tracking
- **Donations**: Financial transactions with donor information
- **Users**: Admin, orphanage, and donor accounts
- **Financial Records**: Income and expense tracking

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Collapsible sidebar navigation
- Touch-friendly interface

### Dark Mode Support
- Automatic theme detection
- Manual theme toggle
- Consistent dark/light mode across all pages

### Interactive Elements
- Hover effects and transitions
- Loading states
- Modal dialogs for detailed views
- Form validation and feedback
- Search and filter functionality

## 🔄 Future Enhancements

### Planned Features
- **Real-time Notifications**: Live updates for new donations, issues, etc.
- **Advanced Analytics**: Charts and graphs for data visualization
- **Bulk Operations**: Mass actions for managing multiple records
- **Export/Import**: CSV/Excel export functionality
- **Audit Logs**: Track all admin actions and changes
- **API Integration**: Connect to payment gateways and external services

### Integration Ready
- Firebase Authentication
- Firebase Firestore
- Payment processing APIs
- Email service providers
- SMS notification services
- File storage services

## 📝 Usage Guidelines

### Admin Responsibilities
1. **Orphanage Verification**: Review and approve orphanage registrations
2. **Issue Management**: Monitor and resolve orphanage requests
3. **Financial Oversight**: Track donations and expenses for transparency
4. **User Management**: Manage platform users and their roles
5. **Content Moderation**: Review and approve success stories

### Best Practices
- Regular verification of orphanage information
- Timely response to urgent issues
- Maintain financial transparency
- Keep user data secure and private
- Document all significant actions

## 🆘 Support

For technical support or feature requests, please contact the development team or create an issue in the project repository.

---

**Connect Foundation Admin Portal** - Empowering charity management through technology.
