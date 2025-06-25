import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController, ModalController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { JobService } from '../services/job.service';
import { Job } from '../interfaces/job.interface';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-employer-home',
  templateUrl: './employer-home.page.html',
  styleUrls: ['./employer-home.page.scss'],
  standalone: false
})
export class EmployerHomePage implements OnInit {
  jobForm: FormGroup;
  jobs: Job[] = [];
  showJobForm = false;
  isEditing = false;
  editingJobId: string | null = null;
  currentUser: any = null;
  isLoading = false;

  skillOptions = [
    'Construction', 'Carpentry', 'Plumbing', 'Electrical Work', 'Painting',
    'Roofing', 'Flooring', 'HVAC', 'Landscaping', 'Cleaning', 'Moving',
    'Handyman', 'Welding', 'Masonry', 'Demolition'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private jobService: JobService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private modalController: ModalController
  ) {
    this.jobForm = this.formBuilder.group({
      headline: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      skills: this.formBuilder.array([], [Validators.required]),
      budget: ['', [Validators.required, Validators.min(1)]],
      location: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.initializePage();
  }

  async initializePage() {
    await this.loadCurrentUser();
    await this.loadJobs();
  }

  async loadCurrentUser() {
    try {
      const user = await this.authService.getCurrentUser();
      if (user) {
        this.currentUser = user;
        console.log('Current user loaded:', user.uid); // Debug log
      } else {
        console.error('No authenticated user found');
        this.router.navigate(['/welcome']);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      this.router.navigate(['/welcome']);
    }
  }

  async loadJobs() {
    if (!this.currentUser) {
      await this.loadCurrentUser();
    }

    if (!this.currentUser) {
      console.error('No current user found');
      return;
    }

    this.isLoading = true;
    try {
      this.jobService.getJobsByEmployer(this.currentUser.uid).subscribe({
        next: (jobs) => {
          console.log('Loaded jobs:', jobs); // Debug log
          this.jobs = jobs;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading jobs:', error);
          this.showToast('Error loading jobs', 'danger');
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Error in loadJobs:', error);
      this.isLoading = false;
      this.showToast('Error loading jobs', 'danger');
    }
  }

  get skillsFormArray() {
    return this.jobForm.get('skills') as FormArray;
  }

  toggleSkill(skill: string) {
    const skillsArray = this.skillsFormArray;
    const index = skillsArray.value.indexOf(skill);

    if (index > -1) {
      skillsArray.removeAt(index);
    } else {
      skillsArray.push(this.formBuilder.control(skill));
    }
  }

  isSkillSelected(skill: string): boolean {
    return this.skillsFormArray.value.includes(skill);
  }

  toggleJobForm() {
    this.showJobForm = !this.showJobForm;
    if (!this.showJobForm) {
      this.resetForm();
    }
  }

  resetForm() {
    this.jobForm.reset();
    this.skillsFormArray.clear();
    this.isEditing = false;
    this.editingJobId = null;
  }

  async onSubmitJob() {
    if (this.jobForm.valid) {
      const loading = await this.loadingController.create({
        message: this.isEditing ? 'Updating job...' : 'Creating job...',
      });
      await loading.present();

      try {
        const jobData = {
          ...this.jobForm.value,
          skills: this.skillsFormArray.value
        };

        if (this.isEditing && this.editingJobId) {
          await this.jobService.updateJob(this.editingJobId, jobData);
          this.showToast('Job updated successfully!', 'success');
        } else {
          await this.jobService.createJob(jobData);
          this.showToast('Job created successfully!', 'success');
        }

        this.toggleJobForm();
        this.loadJobs();

      } catch (error) {
        console.error('Error saving job:', error);
        this.showToast('Error saving job', 'danger');
      } finally {
        await loading.dismiss();
      }
    } else {
      this.markFormGroupTouched();
      this.showToast('Please fill in all required fields', 'warning');
    }
  }

  editJob(job: Job) {
    this.isEditing = true;
    this.editingJobId = job.id!;
    this.showJobForm = true;

    // Clear existing skills
    this.skillsFormArray.clear();

    // Add selected skills
    job.skills.forEach(skill => {
      this.skillsFormArray.push(this.formBuilder.control(skill));
    });

    this.jobForm.patchValue({
      headline: job.headline,
      description: job.description,
      budget: job.budget,
      location: job.location
    });
  }

  async deleteJob(job: Job) {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete "${job.headline}"?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Deleting job...',
            });
            await loading.present();

            try {
              await this.jobService.deleteJob(job.id!);
              this.showToast('Job deleted successfully!', 'success');

              // Force reload after delete
              setTimeout(async () => {
                await this.loadJobs();
              }, 500);
            } catch (error) {
              console.error('Error deleting job:', error);
              this.showToast('Error deleting job', 'danger');
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: async () => {
            try {
              await this.authService.signOut();
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  markFormGroupTouched() {
    Object.keys(this.jobForm.controls).forEach(key => {
      const control = this.jobForm.get(key);
      control?.markAsTouched();
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  closeJobForm(event?: Event) {
    if (event && event.target === event.currentTarget) {
      this.toggleJobForm();
    }
  }

  // Force refresh jobs - public method for manual refresh
  async refreshJobs() {
    console.log('Manually refreshing jobs...');
    await this.loadJobs();
  }

  // Add method to check if jobs are displaying
  checkJobsDisplay() {
    console.log('Current jobs array:', this.jobs);
    console.log('Jobs length:', this.jobs.length);
    console.log('Is loading:', this.isLoading);
    console.log('Current user:', this.currentUser?.uid);
  }

  // Track by function for better performance
  trackByJobId(index: number, job: Job): string {
    return job.id || index.toString();
  }

  // Add duplicate job functionality
  duplicateJob(job: Job) {
    // Pre-fill form with job data for duplication
    this.isEditing = false; // Not editing, creating new
    this.editingJobId = null;

    // Fill form with job data
    this.jobForm.patchValue({
      headline: `Copy of ${job.headline}`,
      description: job.description,
      budget: job.budget,
      location: job.location
    });

    // Set selected skills
    this.skillsFormArray.clear();
    job.skills.forEach(skill => {
      this.skillsFormArray.push(this.formBuilder.control(skill));
    });

    // Update form UI
    document.getElementById('form-title')!.textContent = 'Duplicate Job';
    document.getElementById('submitBtn')!.textContent = 'Create Duplicate';

    // Show form
    if (!this.showJobForm) {
      this.toggleJobForm();
    }

    this.showToast('Job duplicated! Modify and save.', 'success');
  }
}

