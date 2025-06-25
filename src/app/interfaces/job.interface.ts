export interface Job {
  id?: string;
  headline: string;
  description: string;
  skills: string[];
  budget: number;
  location: string;
  employerId: string;
  employerName: string;
  employerEmail: string;
  datePosted: Date;
  status: 'active' | 'closed' | 'draft';
  proposals?: number;  // Changed from applicants
  messaged?: number;   // Added
  hired?: number;      // Added
}
