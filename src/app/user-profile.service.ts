import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from } from 'rxjs';

export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor() { }

  /**
   * Get user profile by user ID
   * @param userId - The unique identifier for the user
   * @returns Observable of UserProfile
   */
  getUserProfile(userId: string): Observable<UserProfile> {
    return from(
      axios.get<UserProfile>(`${this.apiUrl}/${userId}`)
        .then(response => response.data)
    );
  }

  /**
   * Update user profile information
   * @param userId - The unique identifier for the user
   * @param profile - Partial user profile data to update
   * @returns Observable of updated UserProfile
   */
  updateUserProfile(userId: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    return from(
      axios.put<UserProfile>(`${this.apiUrl}/${userId}`, profile)
        .then(response => response.data)
    );
  }

  /**
   * Delete user profile
   * @param userId - The unique identifier for the user
   * @returns Observable of deletion status
   */
  deleteUserProfile(userId: string): Observable<{ success: boolean; message: string }> {
    return from(
      axios.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${userId}`)
        .then(response => response.data)
    );
  }

  /**
   * Get all user profiles (admin only)
   * @returns Observable of UserProfile array
   */
  getAllProfiles(): Observable<UserProfile[]> {
    return from(
      axios.get<UserProfile[]>(`${this.apiUrl}/all`)
        .then(response => response.data)
    );
  }
}
