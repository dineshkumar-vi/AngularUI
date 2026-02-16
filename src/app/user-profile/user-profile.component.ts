import { Component, OnInit } from '@angular/core';
import { UserProfileService, UserProfile } from '../user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  isEditMode: boolean = false;

  editForm: Partial<UserProfile> = {};

  constructor(private userProfileService: UserProfileService) { }

  ngOnInit(): void {
    // Load user profile on initialization
    // In a real application, you would get the userId from authentication service
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.loadUserProfile(userId);
    }
  }

  loadUserProfile(userId: string): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.userProfileService.getUserProfile(userId).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.editForm = { ...profile };
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user profile: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // Reset form if canceling edit
      this.editForm = { ...this.userProfile };
    }
  }

  saveProfile(): void {
    if (!this.userProfile?.id) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.userProfileService.updateUserProfile(this.userProfile.id, this.editForm).subscribe({
      next: (updatedProfile) => {
        this.userProfile = updatedProfile;
        this.successMessage = 'Profile updated successfully!';
        this.isEditMode = false;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to update profile: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  deleteProfile(): void {
    if (!this.userProfile?.id) {
      return;
    }

    if (!confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.userProfileService.deleteUserProfile(this.userProfile.id).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.userProfile = null;
        this.isLoading = false;
        // In a real application, you would redirect to login or home page
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete profile: ' + error.message;
        this.isLoading = false;
      }
    });
  }
}
