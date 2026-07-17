# Coopvest Africa Admin Dashboard

Enterprise-grade admin dashboard for managing the Coopvest Africa mobile application.

## Features

### Dashboard Overview
- Real-time statistics and metrics
- Transaction volume charts
- User growth analytics
- Recent activity feed

### User Management
- View and manage all registered users
- User details with wallet and savings information
- Account suspension and flagging
- KYC verification status

### KYC Verification
- Review pending KYC applications
- View document details and selfies
- Approve or reject applications with reasons
- Track verification progress

### Loan Management
- View all loan applications
- Approve/reject loan requests
- Disburse approved loans
- Track repayment status

### Transaction Management
- View all financial transactions
- Filter by type, status, and date
- Transaction analytics
- Export capabilities

### Savings Management
- Monitor member savings
- Track consecutive contributions
- Identify top savers

### Support Tickets
- Manage support tickets
- Assign tickets to staff
- Resolve and close tickets

### Investment Pools
- View and manage investment pools
- Track pool performance
- Monitor participation

### Announcements
- Create system-wide announcements
- Target specific user groups
- Schedule announcements

### Reports & Analytics
- Generate comprehensive reports
- Multiple export formats (PDF, Excel, CSV)
- Custom date ranges

### Audit Logs
- Track all administrative actions
- Monitor system changes
- Security compliance

### Settings
- Profile management
- Security settings (2FA)
- Notification preferences
- API keys management
- Webhooks configuration

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React + Tailwind CSS
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/teejayfpi/Latest-admin-website.git
cd Latest-admin-website

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard overview
│   ├── users/             # User management
│   ├── kyc/               # KYC verification
│   ├── loans/             # Loan management
│   ├── transactions/       # Transaction history
│   ├── savings/           # Savings management
│   ├── tickets/           # Support tickets
│   ├── investments/       # Investment pools
│   ├── announcements/     # Announcements
│   ├── reports/           # Reports & analytics
│   ├── settings/          # Settings
│   ├── audit-logs/        # Audit logs
│   └── login/             # Login page
├── components/
│   ├── ui/               # Reusable UI components
│   ├── layout/            # Layout components
│   └── dashboard/         # Dashboard widgets
├── lib/
│   ├── supabase.ts        # Supabase client
│   ├── db-service.ts      # Database operations
│   └── utils.ts           # Utility functions
└── types/
    └── index.ts           # TypeScript types
```

## Enterprise Features

### Security
- Role-based access control
- Two-factor authentication support
- Session management
- Audit logging

### Scalability
- Server-side rendering with Next.js
- Optimized database queries
- Pagination and lazy loading

### User Experience
- Responsive design
- Dark/Light mode
- Real-time updates
- Toast notifications

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## License

Private - All rights reserved
