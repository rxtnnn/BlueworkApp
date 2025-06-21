import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-role',
  templateUrl: './role.page.html',
  styleUrls: ['./role.page.scss'],
  standalone: false
})
export class RolePage implements OnInit {

  ngOnInit() {
  }
  constructor(private router: Router) { }

  selectUserType(userType: 'employer' | 'worker') {
    this.router.navigate(['/signup'], { queryParams: { userType } });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
  goToSignup() {
    this.router.navigate(['/signup']);
  }

}
