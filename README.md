# FlexJob - سوق العمل المرن

FlexJob is a full-stack job marketplace platform that connects **workers** with **companies** for flexible and temporary work opportunities. Built with Next.js 16, Supabase, and Tailwind CSS, the application supports Arabic (RTL) out of the box and provides role-based dashboards for workers, companies, and administrators.

---

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [User Roles](#user-roles)
- [License](#license)
- [Contact](#contact)

---

## Introduction

FlexJob was designed to make it easy for businesses to find reliable temporary workers and for workers to discover flexible job opportunities. The platform handles the full lifecycle of a job posting, from creation and application to acceptance and completion, along with a rating system for trust and accountability.

The entire interface is in Arabic with full right-to-left (RTL) support, making it ideal for the Saudi Arabian and broader Arabic-speaking markets.

---

## Key Features

- **Role-Based Authentication** -- Users sign up as either a Worker or a Company, each with their own tailored dashboard and experience.
- **Job Listings** -- Browse, search, and filter open job opportunities with details like city, salary, dates, and number of workers needed.
- **Application System** -- Workers can apply to jobs with a single click. Companies can accept or reject applications from their dashboard.
- **Company Dashboard** -- Post new jobs, manage existing listings, and review incoming applications.
- **Worker Dashboard** -- Track submitted applications, view their statuses, and monitor personal ratings.
- **Admin Panel** -- A dedicated dashboard for platform administrators to oversee all users, companies, jobs, and applications, with the ability to verify user profiles.
- **Profile Management** -- Users can update their personal information, including name, phone, and city.
- **Arabic (RTL) Interface** -- Full Arabic language support with right-to-left layout and IBM Plex Sans Arabic font.
- **Robust Security** -- Critical security measures including dual-layer RLS policies and database triggers to prevent role escalation.
- **Responsive Design** -- Works on desktop, tablet, and mobile devices.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework (App Router) |
| **React 19** | UI library |
| **Supabase** | Authentication, PostgreSQL database, and RLS |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Reusable UI component library |
| **SWR** | Client-side data fetching and caching |
| **Lucide React** | Icon library |
| **TypeScript** | Type safety |

---

## Project Structure

```
flexjob/
├── app/
│   ├── layout.tsx                          # Root layout (Arabic, RTL)
│   ├── page.tsx                            # Landing page
│   ├── auth/
│   │   ├── login/page.tsx                  # Login page
│   │   ├── sign-up/page.tsx                # Sign-up with role selection
│   │   ├── sign-up-success/page.tsx        # Email confirmation prompt
│   │   ├── error/page.tsx                  # Auth error page
│   │   └── callback/route.ts              # OAuth/email callback handler
│   └── (dashboard)/
│       ├── layout.tsx                      # Shared dashboard layout with navbar
│       ├── jobs/
│       │   ├── page.tsx                    # Job listings (browse all jobs)
│       │   └── [id]/page.tsx              # Job detail page
│       ├── profile/page.tsx               # User profile management
│       └── dashboard/
│           ├── worker/page.tsx            # Worker dashboard
│           ├── company/
│           │   ├── page.tsx               # Company dashboard
│           │   ├── post-job/page.tsx       # Post a new job form
│           │   └── jobs/[id]/page.tsx     # Manage applications for a job
│           └── admin/page.tsx             # Admin panel
├── components/
│   ├── navbar.tsx                          # Responsive navigation bar
│   ├── job-card.tsx                        # Job listing card component
│   ├── apply-button.tsx                    # Apply-to-job button
│   ├── application-actions.tsx             # Accept/reject application buttons
│   └── verify-button.tsx                   # Admin verify/unverify toggle
├── lib/
│   └── supabase/
│       ├── client.ts                       # Browser-side Supabase client
│       ├── server.ts                       # Server-side Supabase client
│       └── middleware.ts                   # Supabase session refresh logic
├── middleware.ts                            # Root middleware for auth
└── scripts/
    ├── 001_create_tables.sql              # Core database schema
    ├── 002_profile_trigger.sql            # Auto-create profile on signup
    └── 003_admin_policies.sql             # Admin-level RLS policies
```

---

## Database Schema

The application uses five main tables:

| Table | Description |
|---|---|
| **profiles** | User profiles linked to Supabase Auth. Stores role (worker/company/admin), name, phone, city, rating, and verification status. |
| **companies** | Company details linked to a profile. Stores company name, CR number, description, and logo. |
| **jobs** | Job postings created by companies. Includes title, description, city, dates, salary, workers needed, and status. |
| **applications** | Tracks worker applications to jobs. Stores status (pending, accepted, rejected). |
| **ratings** | Star ratings (1-5) between users after job completion. |

All tables have Row Level Security (RLS) enabled, and a database trigger automatically creates a profile row (and a company row if applicable) whenever a new user signs up.

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Abdoocoder/flexjob-w3.git
   cd flexjob-w3
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

   > If you prefer npm or yarn, use `npm install` or `yarn install` instead.

3. **Set up environment variables** (see the next section).

4. **Run the database migrations** (see [Database Setup](#database-setup)).

5. **Start the development server:**

   ```bash
   pnpm dev
   ```

6. **Open your browser** and navigate to `http://localhost:3000`.

---

## Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under **Settings > API**.

If deploying on Vercel with the Supabase integration, these variables are set automatically.

---

## Database Setup

Run the SQL migration scripts in order against your Supabase database. You can execute them through the Supabase SQL Editor or any PostgreSQL client connected to your project:

1. **`scripts/001_create_tables.sql`** -- Creates the profiles, companies, jobs, applications, and ratings tables with RLS policies.
2. **`scripts/002_profile_trigger.sql`** -- Sets up a trigger to auto-create profile and company rows when a user signs up.
3. **`scripts/003_admin_policies.sql`** -- Adds admin-level RLS policies for managing users and viewing all data.

> If you are using this project via v0.dev, these scripts are executed automatically during setup.

---

## Usage

### Signing Up

1. Visit the app and click **"ابدأ الآن"** (Get Started) or navigate to `/auth/sign-up`.
2. Choose your role: **عامل** (Worker) or **شركة** (Company).
3. Fill in the required information (email, password, name, phone, city).
4. Companies must also provide a company name and optional CR number.
5. After submitting, check your email for a confirmation link.

### For Workers

- **Browse Jobs** -- Visit `/jobs` to see all available job listings.
- **Apply** -- Click on a job to view details, then click **"التقديم على الوظيفة"** (Apply for Job).
- **Track Applications** -- Visit your dashboard at `/dashboard/worker` to see the status of all your applications.
- **Edit Profile** -- Update your personal information at `/profile`.

### For Companies

- **Post Jobs** -- From your dashboard at `/dashboard/company`, click **"نشر وظيفة جديدة"** (Post New Job).
- **Manage Applications** -- Click on any of your posted jobs to see applicants and accept or reject them.
- **Edit Profile** -- Update your company information at `/profile`.

### For Admins

- Admins access their panel at `/dashboard/admin`.
- The admin panel has tabs for **Users**, **Companies**, **Jobs**, and **Applications**.
- Admins can **verify** or **unverify** user profiles.

> To make a user an admin, manually update their `role` to `'admin'` in the `profiles` table via the Supabase dashboard.

---

## User Roles

| Role | Capabilities |
|---|---|
| **Worker** (`worker`) | Browse jobs, apply to jobs, track applications, manage profile |
| **Company** (`company`) | Post jobs, manage applications (accept/reject), manage profile and company info |
| **Admin** (`admin`) | View all platform data, verify/unverify user profiles |

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Contact

- **GitHub:** [Abdoocoder](https://github.com/Abdoocoder)
- **Repository:** [flexjob-w3](https://github.com/Abdoocoder/flexjob-w3)

For questions, suggestions, or bug reports, please open an issue on the GitHub repository.
