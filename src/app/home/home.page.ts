import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  searchQuery: string = '';

  categories = [
    'Popular',
    'Carpenter',
    'Plumber',
    'Electronics'
  ];

  features = [
    {
      icon: 'checkmark-circle',
      title: 'Stick to your budget',
      description: 'Find the right service for every budget. Hourly or fixed'
    },
    {
      icon: 'happy',
      title: 'Pay when you\'re happy',
      description: 'Upfront quotes mean no surprises. Pay when you\'re 100% satisfied.'
    },
    {
      icon: 'flash',
      title: 'Get quality work done quickly',
      description: 'Hand-picked talent for every budget and timeline to get any job done.'
    },
    {
      icon: 'headset',
      title: 'Count on 24/7 support',
      description: 'Find peace of mind with our support team. We\'ve got you covered.'
    }
  ];

  footerSections = [
    {
      title: 'Categories',
      links: ['Carpentry Jobs', 'Plumbing', 'Electronics', 'Domestic Work']
    },
    {
      title: 'About',
      links: ['Careers', 'Press and News', 'Partnerships', 'Privacy Policy']
    },
    {
      title: 'Support',
      links: ['Help & Support', 'Trust and Safety', 'LaboLink Guides']
    }
  ];

  communitySection = {
    title: 'Community',
    links: ['Community Hub', 'Forum', 'Events', 'Community Standards']
  };

  moreFromSection = {
    title: 'More from BlueWork',
    links: ['LaboLink Business', 'LaboLink Enterprise', 'Get Inspired', 'Learn']
  };

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onSearch() {
    console.log('Search query:', this.searchQuery);
    // Implement search functionality
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToSignUp() {
    this.router.navigate(['/role']);
  }

  selectCategory(category: string) {
    console.log('Selected category:', category);
    // Implement category filter
  }
}

