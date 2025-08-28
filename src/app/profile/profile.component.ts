import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',  
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  changePasswordMode = false;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private profileService: ProfileService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [{ value: '********', disabled: true }],
      newPassword: ['']
    });

    this.profileService.getProfile().subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
        this.previewUrl = user.profilePic || null;

        // For development/demo only
        localStorage.setItem('seller', JSON.stringify(user));
      },
      error: (err) => {
        console.error('Failed to load profile', err);
      }
    });
  }

  enablePasswordChange(): void {
    this.changePasswordMode = true;
    const newPasswordControl = this.profileForm.get('newPassword');
    if (newPasswordControl) {
      newPasswordControl.setValidators([Validators.required, Validators.minLength(6)]);
      newPasswordControl.updateValueAndValidity();
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      alert('Please fix the form errors.');
      return;
    }

    const payload: any = {
      name: this.profileForm.get('name')?.value,
      email: this.profileForm.get('email')?.value
    };

    if (this.changePasswordMode) {
      payload.newPassword = this.profileForm.get('newPassword')?.value;
    }

    if (this.previewUrl) {
      payload.profilePic = this.previewUrl;
    }

    this.profileService.updateProfile(payload).subscribe({
      next: () => {
        alert('Profile updated successfully!');
        this.changePasswordMode = false;
        const newPasswordControl = this.profileForm.get('newPassword');
        if (newPasswordControl) {
          newPasswordControl.clearValidators();
          newPasswordControl.reset();
          newPasswordControl.updateValueAndValidity();
        }
      },
      error: (err) => {
        console.error('Update failed', err);
        alert('Profile update failed.');
      }
    });
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;

        // Optional: Save base64 in localStorage for demo
        const seller = JSON.parse(localStorage.getItem('seller') || '{}');
        seller.profilePic = reader.result;
        localStorage.setItem('seller', JSON.stringify(seller));
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
