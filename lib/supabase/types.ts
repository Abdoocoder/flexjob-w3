// Database type definitions for FlexJob
// These mirror the schema defined in scripts/001_create_tables.sql and scripts/004_notifications.sql

export interface Profile {
    id: string
    role: 'worker' | 'company' | 'admin'
    full_name: string | null
    phone: string | null
    city: string | null
    avatar_url: string | null
    rating: number | null
    ratings_count: number
    is_verified: boolean
    created_at: string
}

export interface Company {
    id: string
    profile_id: string
    company_name: string
    cr_number: string | null
    description: string | null
    logo_url: string | null
    created_at: string
    // Joined fields
    profiles?: Pick<Profile, 'full_name'>
}

export interface Job {
    id: string
    company_id: string
    title: string
    description: string | null
    city: string | null
    location: string | null
    start_date: string | null
    end_date: string | null
    salary: number | null
    workers_needed: number
    status: 'open' | 'closed' | 'completed'
    created_at: string
    // Joined fields
    companies?: Pick<Company, 'company_name' | 'logo_url'> & { profile_id: string }
}

export interface Application {
    id: string
    job_id: string
    worker_id: string
    status: 'pending' | 'accepted' | 'rejected'
    created_at: string
    // Joined fields
    jobs?: Pick<Job, 'id' | 'title' | 'city' | 'salary' | 'status' | 'start_date'> & {
        companies?: Pick<Company, 'company_name'>
    }
    profiles?: Pick<Profile, 'id' | 'full_name' | 'phone' | 'city' | 'rating' | 'ratings_count'>
}

export interface Rating {
    id: string
    job_id: string
    from_user: string
    to_user: string
    score: number
    comment: string | null
    created_at: string
}

export interface Notification {
    id: string
    user_id: string
    type: 'application_update' | 'new_application' | 'new_job'
    title: string
    description: string
    read: boolean
    link: string | null
    created_at: string
}
