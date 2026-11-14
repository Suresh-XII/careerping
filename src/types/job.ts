export type JobStatus = 'published' | 'draft' | 'expired';

export type JobCategory = 
  | 'IT & Software'
  | 'Cybersecurity'
  | 'Freshers'
  | 'Internships'
  | 'Government Jobs'
  | 'Work From Home'
  | 'Banking & Finance'
  | 'Core Engineering';

export interface Job {
  id: string;
  slug: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  qualification: string;
  experience: string;
  employment_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  salary: string;
  category: JobCategory;
  description: string;
  responsibilities: string[];
  required_skills: string[];
  eligibility: string[];
  selection_process?: string[];
  application_deadline: string;
  apply_url: string;
  source_url?: string;
  status: JobStatus;
  published_at: string;
  created_at: string;
  updated_at: string;
  last_verified_at: string;
  featured?: boolean;
}

export interface JobFilterParams {
  search?: string;
  category?: string;
  location?: string;
  experience?: string;
  status?: JobStatus;
}
