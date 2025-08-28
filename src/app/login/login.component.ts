import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SellerService } from '../services/seller.service';

declare const google: any;

@Component({
  selector: 'app-seller-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  signupForm: FormGroup;
  loginForm: FormGroup;
  isLoginMode = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
      private sellerService: SellerService 
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngAfterViewInit(): void {
    this.renderGoogleButton();
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    setTimeout(() => this.renderGoogleButton(), 0);
  }

  renderGoogleButton() {
    const el = document.getElementById('google-signin-button');
    if (el) {
      el.innerHTML = '';

      google.accounts.id.initialize({
        client_id: '119199213414-t2vsbo1ulvrakrm39qod45prormjbr2g.apps.googleusercontent.com', // Replace with your client ID
        callback: this.handleCredentialResponse.bind(this),
      });

      google.accounts.id.renderButton(el, {
        theme: 'outline',
        size: 'large',
        text: this.isLoginMode ? 'signin_with' : 'signup_with', 
      });
    }
  }

 handleCredentialResponse(response: any) {
  const token = response.credential;
  const endpoint = this.isLoginMode ? 'google-signin' : 'google-signup';

  this.authService.googleAuth(endpoint, token).subscribe({
    next: (res: any) => {
      if (res.token) {
        localStorage.setItem('token', res.token);
        this.sellerService.login(res.token);
        alert(`${this.isLoginMode ? 'Login' : 'Sign-Up'} with Google successful!`);
        this.router.navigate(['/home']);
      } else {
        alert('Authentication failed: no token received.');
      }
    },
    error: (err: HttpErrorResponse) => {
      console.error(`Google ${this.isLoginMode ? 'Login' : 'Signup'} error:`, err.message);
      alert(`Google ${this.isLoginMode ? 'signin' : 'signup'} failed.`);
    }
  });
}


  onSubmitSignup(): void {
  if (this.signupForm.valid) {
    this.authService.register(this.signupForm.value).subscribe({
      next: (res: any) => {
        const token = res?.token;

        if (token) {
          localStorage.setItem('token', token);             // ✅ Optional but consistent
          this.sellerService.login(token);                   // ✅ Set login status for navbar
          alert('Sign-up successful!');
          this.router.navigate(['/seller-home']);            // ✅ Now navbar will show correct links
        } else {
          alert('Sign-up failed: No token received.');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Sign-up error:', err.message);
        alert('Sign-up failed.');
      }
    });
  } else {
    this.signupForm.markAllAsTouched();
  }
}


  onSubmitLogin(): void {
  if (this.loginForm.valid) {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.sellerService.login(res.token);  // ✅ FIXED: notify Navbar!
          alert('Sign-in successful!');
          this.router.navigate(['/seller-home']);
        } else {
          alert('Sign-in failed: no token received.');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Login error:', err.message);
        alert('Sign-in failed.');
      }
    });
  } else {
    this.loginForm.markAllAsTouched();
  }
}


  // Form control getters for template convenience
  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get loginEmail() { return this.loginForm.get('email'); }
  get loginPassword() { return this.loginForm.get('password'); }
}
