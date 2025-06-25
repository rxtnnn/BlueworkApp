import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage implements OnInit {
  signupForm: FormGroup;
  userType: 'employer' | 'worker' = 'employer';
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['userType']) {
        this.userType = params['userType'];
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  async onSignUp() {
    if (this.signupForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Creating account...',
      });
      await loading.present();

      try {
        const { email, password } = this.signupForm.value;
        await this.authService.signUp(email, password, this.userType);

        await loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Account created successfully!',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.router.navigate(['/login']);
            }
          }]
        });
        await alert.present();

      } catch (error: any) {
        await loading.dismiss();

        const alert = await this.alertController.create({
          header: 'Error',
          message: error.message || 'An error occurred during sign up',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  async signUpWithGoogle() {
    const alert = await this.alertController.create({
      header: 'Info',
      message: 'Google sign-up will be implemented soon',
      buttons: ['OK']
    });
    await alert.present();
  }

  async signUpWithFacebook() {
    const alert = await this.alertController.create({
      header: 'Info',
      message: 'Facebook sign-up will be implemented soon',
      buttons: ['OK']
    });
    await alert.present();
  }

  async signUpWithPhone() {
    const alert = await this.alertController.create({
      header: 'Info',
      message: 'Phone sign-up will be implemented soon',
      buttons: ['OK']
    });
    await alert.present();
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
  goBack() {
    this.router.navigate(['/role']);
  }
}
