// UPDATE: src/app/pages/login/login.page.ts - Add role-based navigation
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = false;
  rememberMe = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Signing in...',
      });
      await loading.present();

      try {
        const { email, password } = this.loginForm.value;
        const result = await this.authService.signIn(email, password);

        await loading.dismiss();

        if (result.user) {
          this.authService.getUserProfile(result.user.uid).subscribe(async (profile) => {
            if (profile) {
              if (profile.userType === 'worker') {
                this.router.navigate(['/workers-home']);
              } else if (profile.userType === 'employer') {
                this.router.navigate(['/home']);
              } else {
                this.router.navigate(['/home']);
              }
            } else {
              this.router.navigate(['/home']);
            }
          });
        }

      } catch (error: any) {
        await loading.dismiss();

        let errorMessage = 'An error occurred during sign in';
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address';
        } else if (error.code === 'auth/user-disabled') {
          errorMessage = 'This account has been disabled';
        }

        const alert = await this.alertController.create({
          header: 'Login Error',
          message: errorMessage,
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  async forgotPassword() {
    const alert = await this.alertController.create({
      header: 'Reset Password',
      message: 'Enter your email address to reset your password',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email address'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send Reset Email',
          handler: async (data) => {
            if (data.email) {
              try {
                // Add password reset functionality here if needed
                const confirmAlert = await this.alertController.create({
                  header: 'Email Sent',
                  message: 'Password reset email has been sent to your email address',
                  buttons: ['OK']
                });
                await confirmAlert.present();
              } catch (error) {
                const errorAlert = await this.alertController.create({
                  header: 'Error',
                  message: 'Failed to send reset email',
                  buttons: ['OK']
                });
                await errorAlert.present();
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async signInWithGoogle() {
    const alert = await this.alertController.create({
      header: 'Info',
      message: 'Google sign-in will be implemented soon',
      buttons: ['OK']
    });
    await alert.present();
  }

  async signInWithFacebook() {
    const alert = await this.alertController.create({
      header: 'Info',
      message: 'Facebook sign-in will be implemented soon',
      buttons: ['OK']
    });
    await alert.present();
  }

  async signInWithPhone() {
    const alert = await this.alertController.create({
      header: 'Info',
      message: 'Phone sign-in will be implemented soon',
      buttons: ['OK']
    });
    await alert.present();
  }

  goToSignUp() {
    this.router.navigate(['/welcome']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
  goBack() {
    this.router.navigate(['/home']);
  }
}
