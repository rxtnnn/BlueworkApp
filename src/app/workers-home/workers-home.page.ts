import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';

export interface JobCard {
  id: string;
  title: string;
  company: string;
  location: string;
  postedTime: string;
  description: string;
  image: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  isVerified?: boolean;
}

@Component({
  selector: 'app-worker-home',
  templateUrl: './workers-home.page.html',
  styleUrls: ['./workers-home.page.scss'],
  standalone: false
})
export class WorkersHomePage implements OnInit {
  selectedCategory = 'Construction';
  categories = ['Construction', 'Electrical Work', 'Carpenter', 'Plumber', 'Cleaner'];

  jobCards: JobCard[] = [
    {
      id: '1',
      title: 'Construction',
      company: 'ABC Company',
      location: 'Anywhere',
      postedTime: '1h ago',
      description: 'Experienced construction workers with professional certification and experience in residential and commercial construction.',
      image: '/assets/images/construction-1.jpg',
      clientName: 'Anna Clark',
      clientAvatar: '/assets/images/avatar-1.jpg',
      rating: 4.9,
      isVerified: true
    },
    {
      id: '2',
      title: 'Construction',
      company: 'ABC Company',
      location: 'Anywhere',
      postedTime: '2h ago',
      description: 'Dedicated construction workers with expertise in heavy construction projects and commercial building construction.',
      image: '/assets/images/construction-2.jpg',
      clientName: 'Super Agent',
      clientAvatar: '/assets/images/avatar-2.jpg',
      rating: 4.8
    },
    {
      id: '3',
      title: 'Construction',
      company: 'ABC Company',
      location: 'Anywhere',
      postedTime: '3h ago',
      description: 'Skilled construction workers with experience in residential construction, focusing on high-quality workmanship.',
      image: '/assets/images/construction-3.jpg',
      clientName: 'Constructor',
      clientAvatar: '/assets/images/avatar-3.jpg',
      rating: 4.7
    },
    {
      id: '4',
      title: 'Construction',
      company: 'ABC Company',
      location: 'Anywhere',
      postedTime: '4h ago',
      description: 'Professional construction workers with extensive experience in commercial and residential construction projects.',
      image: '/assets/images/construction-4.jpg',
      clientName: 'Super Agent',
      clientAvatar: '/assets/images/avatar-4.jpg',
      rating: 4.9
    },
    {
      id: '5',
      title: 'Construction',
      company: 'ABC Company',
      location: 'Anywhere',
      postedTime: '5h ago',
      description: 'Experienced construction workers with commercial certification and expertise in delivering high-quality commercial construction projects.',
      image: '/blueworkApp/src/assets/construction.jpg',
      clientName: 'Constructor',
      clientAvatar: '/assets/images/avatar-5.jpg',
      rating: 4.6
    },
    {
      id: '6',
      title: 'Construction',
      company: 'ABC Company',
      location: 'Anywhere',
      postedTime: '6h ago',
      description: 'Professional construction workers with commercial certification and experience, delivering high-quality commercial construction projects.',
      image: '/assets/images/construction-6.jpg',
      clientName: 'Anna Clark',
      clientAvatar: '/assets/images/avatar-6.jpg',
      rating: 4.8
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  viewJobDetails(job: JobCard) {
    console.log('View job details:', job);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
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

    goToProfile() {
      // Navigate to profile page
      console.log('Go to profile');
    }

    goToMessages() {
      // Navigate to messages page
      console.log('Go to messages');
    }

  goToBookings() {
    // Navigate to bookings page
    console.log('Go to bookings');
  }

  goToSearch() {
    // Navigate to search page
    console.log('Go to search');
  }
}
