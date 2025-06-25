import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
  Timestamp
} from '@angular/fire/firestore';
import { Observable, from, map, catchError } from 'rxjs';
import { Job } from '../interfaces/job.interface';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private jobsCollection;

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.jobsCollection = collection(this.firestore, 'jobs');
  }

  // Create job
  async createJob(job: Omit<Job, 'id' | 'datePosted' | 'employerId' | 'employerName' | 'employerEmail' | 'status' | 'proposals' | 'messaged' | 'hired'>): Promise<string> {
    try {
      const user = await this.authService.getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      // Get user profile with error handling
      let userProfile: any = null;
      try {
        userProfile = await this.authService.getUserProfile(user.uid).pipe(take(1)).toPromise();
      } catch (profileError) {
        console.warn('Could not load user profile:', profileError);
      }

      const newJob: Omit<Job, 'id'> = {
        headline: job.headline,
        description: job.description,
        skills: job.skills,
        budget: job.budget,
        location: job.location,
        employerId: user.uid,
        employerName: userProfile?.displayName || userProfile?.email?.split('@')[0] || user.email?.split('@')[0] || 'Anonymous Employer',
        employerEmail: user.email || '',
        datePosted: new Date(),
        status: 'active',
        proposals: 0,
        messaged: 0,
        hired: 0
      };

      console.log('Creating job:', newJob);
      const docRef = await addDoc(this.jobsCollection, newJob);
      console.log('Job created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }

  // Add a Promise-based method for better control
  async getJobsByEmployerPromise(employerId: string): Promise<Job[]> {
    console.log('Fetching jobs for employer (Promise):', employerId);

    try {
      const jobs = await this.fetchJobsByEmployer(employerId);
      return jobs;
    } catch (error) {
      console.error('Error in getJobsByEmployerPromise:', error);
      throw error;
    }
  }

  // Keep the original Observable method for compatibility
  getJobsByEmployer(employerId: string): Observable<Job[]> {
    console.log('Fetching jobs for employer:', employerId);

    return from(this.fetchJobsByEmployer(employerId)).pipe(
      catchError(error => {
        console.error('Error in getJobsByEmployer:', error);
        throw error;
      })
    );
  }

  private async fetchJobsByEmployer(employerId: string): Promise<Job[]> {
    try {
      // Try simple query first
      const q = query(
        this.jobsCollection,
        where('employerId', '==', employerId)
      );

      const snapshot = await getDocs(q);
      console.log('Query snapshot size:', snapshot.size);

      const jobs: Job[] = [];
      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        console.log('Raw job data:', data);

        // Convert Firestore Timestamp to Date if needed
        let datePosted = data['datePosted'];
        if (datePosted && typeof datePosted.toDate === 'function') {
          datePosted = datePosted.toDate();
        } else if (datePosted && typeof datePosted === 'string') {
          datePosted = new Date(datePosted);
        } else if (!datePosted) {
          datePosted = new Date();
        }

        const job: Job = {
          id: doc.id,
          headline: data['headline'] || '',
          description: data['description'] || '',
          skills: data['skills'] || [],
          budget: data['budget'] || 0,
          location: data['location'] || '',
          employerId: data['employerId'] || '',
          employerName: data['employerName'] || 'Anonymous',
          employerEmail: data['employerEmail'] || '',
          datePosted: datePosted,
          status: data['status'] || 'active',
          proposals: data['proposals'] || 0,
          messaged: data['messaged'] || 0,
          hired: data['hired'] || 0
        };

        jobs.push(job);
      });

      // Sort by date (newest first)
      jobs.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());

      console.log('Processed jobs:', jobs);
      return jobs;

    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }

  // Update job
  async updateJob(jobId: string, updates: Partial<Job>): Promise<void> {
    try {
      console.log('Updating job:', jobId, updates);
      const jobDoc = doc(this.firestore, 'jobs', jobId);
      await updateDoc(jobDoc, updates);
      console.log('Job updated successfully');
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  // Delete job
  async deleteJob(jobId: string): Promise<void> {
    try {
      console.log('Deleting job:', jobId);
      const jobDoc = doc(this.firestore, 'jobs', jobId);
      await deleteDoc(jobDoc);
      console.log('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // Get all jobs (for workers to view)
  getAllActiveJobs(): Observable<Job[]> {
    return from(this.fetchAllActiveJobs()).pipe(
      catchError(error => {
        console.error('Error in getAllActiveJobs:', error);
        throw error;
      })
    );
  }

  private async fetchAllActiveJobs(): Promise<Job[]> {
    try {
      const q = query(
        this.jobsCollection,
        where('status', '==', 'active')
      );

      const snapshot = await getDocs(q);
      const jobs: Job[] = [];

      snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();

        let datePosted = data['datePosted'];
        if (datePosted && typeof datePosted.toDate === 'function') {
          datePosted = datePosted.toDate();
        } else if (datePosted && typeof datePosted === 'string') {
          datePosted = new Date(datePosted);
        } else {
          datePosted = new Date();
        }

        jobs.push({
          id: doc.id,
          ...data,
          datePosted: datePosted
        } as Job);
      });

      return jobs.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
    } catch (error) {
      console.error('Error fetching all active jobs:', error);
      throw error;
    }
  }
}
