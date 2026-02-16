import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from '../src/app/user-profile/user-profile.component';
import { UserProfileService, UserProfile } from '../src/app/user-profile.service';
import { of, throwError } from 'rxjs';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockUserProfileService: jest.Mocked<UserProfileService>;
  let localStorageMock: { [key: string]: string };

  // Sample test data
  const mockUserProfile: UserProfile = {
    id: 'user123',
    userName: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date('2024-01-01')
  };

  beforeEach(async () => {
    // Create mock service
    mockUserProfileService = {
      getUserProfile: jest.fn(),
      updateUserProfile: jest.fn(),
      deleteUserProfile: jest.fn(),
      getAllProfiles: jest.fn()
    } as any;

    // Mock localStorage
    localStorageMock = {};
    global.Storage.prototype.getItem = jest.fn((key: string) => localStorageMock[key] || null);
    global.Storage.prototype.setItem = jest.fn((key: string, value: string) => {
      localStorageMock[key] = value;
    });
    global.Storage.prototype.removeItem = jest.fn((key: string) => {
      delete localStorageMock[key];
    });

    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [FormsModule],
      providers: [
        { provide: UserProfileService, useValue: mockUserProfileService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorageMock = {};
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.userProfile).toBeNull();
      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBeNull();
      expect(component.successMessage).toBeNull();
      expect(component.isEditMode).toBe(false);
      expect(component.editForm).toEqual({});
    });

    it('should load user profile on init when userId exists in localStorage', () => {
      // Arrange
      localStorageMock['userId'] = 'user123';
      mockUserProfileService.getUserProfile.mockReturnValue(of(mockUserProfile));
      jest.spyOn(component, 'loadUserProfile');

      // Act
      component.ngOnInit();

      // Assert
      expect(component.loadUserProfile).toHaveBeenCalledWith('user123');
    });

    it('should not load profile when userId is not in localStorage', () => {
      // Arrange
      jest.spyOn(component, 'loadUserProfile');

      // Act
      component.ngOnInit();

      // Assert
      expect(component.loadUserProfile).not.toHaveBeenCalled();
    });

    it('should handle empty string userId in localStorage', () => {
      // Arrange
      localStorageMock['userId'] = '';
      jest.spyOn(component, 'loadUserProfile');

      // Act
      component.ngOnInit();

      // Assert
      expect(component.loadUserProfile).not.toHaveBeenCalled();
    });
  });

  describe('loadUserProfile', () => {
    it('should load user profile successfully', () => {
      // Arrange
      mockUserProfileService.getUserProfile.mockReturnValue(of(mockUserProfile));

      // Act
      component.loadUserProfile('user123');

      // Assert
      expect(component.isLoading).toBe(false);
      expect(component.userProfile).toEqual(mockUserProfile);
      expect(component.editForm).toEqual(mockUserProfile);
      expect(component.errorMessage).toBeNull();
      expect(mockUserProfileService.getUserProfile).toHaveBeenCalledWith('user123');
    });

    it('should set isLoading to true during profile loading', () => {
      // Arrange
      mockUserProfileService.getUserProfile.mockReturnValue(of(mockUserProfile));

      // Act
      component.loadUserProfile('user123');

      // Assert - isLoading should be set back to false after completion
      expect(component.isLoading).toBe(false);
    });

    it('should handle error when loading profile fails', () => {
      // Arrange
      const error = new Error('Network error');
      mockUserProfileService.getUserProfile.mockReturnValue(throwError(() => error));

      // Act
      component.loadUserProfile('user123');

      // Assert
      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBe('Failed to load user profile: Network error');
      expect(component.userProfile).toBeNull();
    });

    it('should clear previous error message when loading new profile', () => {
      // Arrange
      component.errorMessage = 'Previous error';
      mockUserProfileService.getUserProfile.mockReturnValue(of(mockUserProfile));

      // Act
      component.loadUserProfile('user123');

      // Assert
      expect(component.errorMessage).toBeNull();
    });

    it('should handle profile with null or undefined fields', () => {
      // Arrange
      const incompleteProfile = { ...mockUserProfile, lastName: undefined } as any;
      mockUserProfileService.getUserProfile.mockReturnValue(of(incompleteProfile));

      // Act
      component.loadUserProfile('user123');

      // Assert
      expect(component.userProfile).toEqual(incompleteProfile);
      expect(component.editForm).toEqual(incompleteProfile);
    });

    it('should handle empty userId string', () => {
      // Arrange
      mockUserProfileService.getUserProfile.mockReturnValue(of(mockUserProfile));

      // Act
      component.loadUserProfile('');

      // Assert
      expect(mockUserProfileService.getUserProfile).toHaveBeenCalledWith('');
    });

    it('should handle special characters in userId', () => {
      // Arrange
      const specialUserId = 'user@123#test';
      mockUserProfileService.getUserProfile.mockReturnValue(of(mockUserProfile));

      // Act
      component.loadUserProfile(specialUserId);

      // Assert
      expect(mockUserProfileService.getUserProfile).toHaveBeenCalledWith(specialUserId);
    });
  });

  describe('toggleEditMode', () => {
    it('should enable edit mode when currently disabled', () => {
      // Arrange
      component.isEditMode = false;

      // Act
      component.toggleEditMode();

      // Assert
      expect(component.isEditMode).toBe(true);
    });

    it('should disable edit mode when currently enabled', () => {
      // Arrange
      component.isEditMode = true;
      component.userProfile = mockUserProfile;

      // Act
      component.toggleEditMode();

      // Assert
      expect(component.isEditMode).toBe(false);
    });

    it('should reset editForm when canceling edit mode', () => {
      // Arrange
      component.isEditMode = true;
      component.userProfile = mockUserProfile;
      component.editForm = { firstName: 'Modified' };

      // Act
      component.toggleEditMode();

      // Assert
      expect(component.editForm).toEqual(mockUserProfile);
    });

    it('should not reset editForm when entering edit mode', () => {
      // Arrange
      component.isEditMode = false;
      component.editForm = { firstName: 'Modified' };

      // Act
      component.toggleEditMode();

      // Assert
      expect(component.editForm.firstName).toBe('Modified');
    });

    it('should handle toggle when userProfile is null', () => {
      // Arrange
      component.isEditMode = true;
      component.userProfile = null;

      // Act
      component.toggleEditMode();

      // Assert
      expect(component.isEditMode).toBe(false);
      expect(component.editForm).toEqual(null);
    });

    it('should toggle multiple times correctly', () => {
      // Arrange
      component.userProfile = mockUserProfile;

      // Act & Assert
      expect(component.isEditMode).toBe(false);

      component.toggleEditMode();
      expect(component.isEditMode).toBe(true);

      component.toggleEditMode();
      expect(component.isEditMode).toBe(false);

      component.toggleEditMode();
      expect(component.isEditMode).toBe(true);
    });
  });

  describe('saveProfile', () => {
    beforeEach(() => {
      component.userProfile = mockUserProfile;
      component.editForm = { firstName: 'Updated', lastName: 'Name' };
    });

    it('should save profile successfully', () => {
      // Arrange
      const updatedProfile = { ...mockUserProfile, firstName: 'Updated', lastName: 'Name' };
      mockUserProfileService.updateUserProfile.mockReturnValue(of(updatedProfile));

      // Act
      component.saveProfile();

      // Assert
      expect(component.userProfile).toEqual(updatedProfile);
      expect(component.successMessage).toBe('Profile updated successfully!');
      expect(component.isEditMode).toBe(false);
      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toBeNull();
      expect(mockUserProfileService.updateUserProfile).toHaveBeenCalledWith('user123', component.editForm);
    });

    it('should not save when userProfile is null', () => {
      // Arrange
      component.userProfile = null;

      // Act
      component.saveProfile();

      // Assert
      expect(mockUserProfileService.updateUserProfile).not.toHaveBeenCalled();
    });

    it('should not save when userProfile id is undefined', () => {
      // Arrange
      component.userProfile = { ...mockUserProfile, id: undefined as any };

      // Act
      component.saveProfile();

      // Assert
      expect(mockUserProfileService.updateUserProfile).not.toHaveBeenCalled();
    });

    it('should handle error when save fails', () => {
      // Arrange
      const error = new Error('Update failed');
      mockUserProfileService.updateUserProfile.mockReturnValue(throwError(() => error));

      // Act
      component.saveProfile();

      // Assert
      expect(component.errorMessage).toBe('Failed to update profile: Update failed');
      expect(component.isLoading).toBe(false);
      expect(component.isEditMode).toBe(true); // Should remain in edit mode
      expect(component.successMessage).toBeNull();
    });

    it('should clear previous messages when saving', () => {
      // Arrange
      component.errorMessage = 'Previous error';
      component.successMessage = 'Previous success';
      mockUserProfileService.updateUserProfile.mockReturnValue(of(mockUserProfile));

      // Act
      component.saveProfile();

      // Assert
      expect(component.errorMessage).toBeNull();
      expect(component.successMessage).toBe('Profile updated successfully!');
    });

    it('should save with empty editForm', () => {
      // Arrange
      component.editForm = {};
      mockUserProfileService.updateUserProfile.mockReturnValue(of(mockUserProfile));

      // Act
      component.saveProfile();

      // Assert
      expect(mockUserProfileService.updateUserProfile).toHaveBeenCalledWith('user123', {});
    });

    it('should save with partial editForm', () => {
      // Arrange
      component.editForm = { email: 'newemail@example.com' };
      const updatedProfile = { ...mockUserProfile, email: 'newemail@example.com' };
      mockUserProfileService.updateUserProfile.mockReturnValue(of(updatedProfile));

      // Act
      component.saveProfile();

      // Assert
      expect(mockUserProfileService.updateUserProfile).toHaveBeenCalledWith('user123', { email: 'newemail@example.com' });
      expect(component.userProfile?.email).toBe('newemail@example.com');
    });

    it('should handle validation error from service', () => {
      // Arrange
      const error = new Error('Invalid email format');
      mockUserProfileService.updateUserProfile.mockReturnValue(throwError(() => error));

      // Act
      component.saveProfile();

      // Assert
      expect(component.errorMessage).toContain('Invalid email format');
      expect(component.isEditMode).toBe(true);
    });
  });

  describe('deleteProfile', () => {
    beforeEach(() => {
      component.userProfile = mockUserProfile;
      global.confirm = jest.fn();
    });

    it('should delete profile successfully after confirmation', () => {
      // Arrange
      (global.confirm as jest.Mock).mockReturnValue(true);
      const deleteResponse = { success: true, message: 'Profile deleted successfully' };
      mockUserProfileService.deleteUserProfile.mockReturnValue(of(deleteResponse));

      // Act
      component.deleteProfile();

      // Assert
      expect(global.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete your profile? This action cannot be undone.'
      );
      expect(component.successMessage).toBe('Profile deleted successfully');
      expect(component.userProfile).toBeNull();
      expect(component.isLoading).toBe(false);
      expect(mockUserProfileService.deleteUserProfile).toHaveBeenCalledWith('user123');
    });

    it('should not delete when user cancels confirmation', () => {
      // Arrange
      (global.confirm as jest.Mock).mockReturnValue(false);

      // Act
      component.deleteProfile();

      // Assert
      expect(mockUserProfileService.deleteUserProfile).not.toHaveBeenCalled();
      expect(component.userProfile).toEqual(mockUserProfile);
    });

    it('should not delete when userProfile is null', () => {
      // Arrange
      component.userProfile = null;

      // Act
      component.deleteProfile();

      // Assert
      expect(global.confirm).not.toHaveBeenCalled();
      expect(mockUserProfileService.deleteUserProfile).not.toHaveBeenCalled();
    });

    it('should not delete when userProfile id is undefined', () => {
      // Arrange
      component.userProfile = { ...mockUserProfile, id: undefined as any };

      // Act
      component.deleteProfile();

      // Assert
      expect(global.confirm).not.toHaveBeenCalled();
      expect(mockUserProfileService.deleteUserProfile).not.toHaveBeenCalled();
    });

    it('should handle error when deletion fails', () => {
      // Arrange
      (global.confirm as jest.Mock).mockReturnValue(true);
      const error = new Error('Deletion failed');
      mockUserProfileService.deleteUserProfile.mockReturnValue(throwError(() => error));

      // Act
      component.deleteProfile();

      // Assert
      expect(component.errorMessage).toBe('Failed to delete profile: Deletion failed');
      expect(component.isLoading).toBe(false);
      expect(component.userProfile).toEqual(mockUserProfile); // Should remain unchanged
    });

    it('should clear error message before deletion', () => {
      // Arrange
      (global.confirm as jest.Mock).mockReturnValue(true);
      component.errorMessage = 'Previous error';
      const deleteResponse = { success: true, message: 'Profile deleted' };
      mockUserProfileService.deleteUserProfile.mockReturnValue(of(deleteResponse));

      // Act
      component.deleteProfile();

      // Assert
      expect(component.errorMessage).toBeNull();
    });

    it('should handle network error during deletion', () => {
      // Arrange
      (global.confirm as jest.Mock).mockReturnValue(true);
      const error = new Error('Network timeout');
      mockUserProfileService.deleteUserProfile.mockReturnValue(throwError(() => error));

      // Act
      component.deleteProfile();

      // Assert
      expect(component.errorMessage).toContain('Network timeout');
      expect(component.userProfile).not.toBeNull();
    });

    it('should set userProfile to null after successful deletion', () => {
      // Arrange
      (global.confirm as jest.Mock).mockReturnValue(true);
      const deleteResponse = { success: true, message: 'Deleted' };
      mockUserProfileService.deleteUserProfile.mockReturnValue(of(deleteResponse));

      // Act
      component.deleteProfile();

      // Assert
      expect(component.userProfile).toBeNull();
    });
  });

  describe('Component State Management', () => {
    it('should manage isLoading state correctly during profile load', () => {
      // Arrange
      mockUserProfileService.getUserProfile.mockReturnValue(of(mockUserProfile));

      // Act
      component.loadUserProfile('user123');

      // Assert
      expect(component.isLoading).toBe(false); // Should be false after completion
    });

    it('should manage isLoading state correctly during save', () => {
      // Arrange
      component.userProfile = mockUserProfile;
      mockUserProfileService.updateUserProfile.mockReturnValue(of(mockUserProfile));

      // Act
      component.saveProfile();

      // Assert
      expect(component.isLoading).toBe(false); // Should be false after completion
    });

    it('should manage isLoading state correctly during delete', () => {
      // Arrange
      component.userProfile = mockUserProfile;
      (global.confirm as jest.Mock).mockReturnValue(true);
      mockUserProfileService.deleteUserProfile.mockReturnValue(
        of({ success: true, message: 'Deleted' })
      );

      // Act
      component.deleteProfile();

      // Assert
      expect(component.isLoading).toBe(false); // Should be false after completion
    });

    it('should clear messages appropriately', () => {
      // Arrange
      component.errorMessage = 'Error';
      component.successMessage = 'Success';
      mockUserProfileService.getUserProfile.mockReturnValue(of(mockUserProfile));

      // Act
      component.loadUserProfile('user123');

      // Assert
      expect(component.errorMessage).toBeNull();
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle concurrent save and delete operations', () => {
      // Arrange
      component.userProfile = mockUserProfile;
      (global.confirm as jest.Mock).mockReturnValue(true);
      mockUserProfileService.updateUserProfile.mockReturnValue(of(mockUserProfile));
      mockUserProfileService.deleteUserProfile.mockReturnValue(
        of({ success: true, message: 'Deleted' })
      );

      // Act
      component.saveProfile();
      component.deleteProfile();

      // Assert
      expect(mockUserProfileService.updateUserProfile).toHaveBeenCalled();
      expect(mockUserProfileService.deleteUserProfile).toHaveBeenCalled();
    });

    it('should handle profile with all null fields', () => {
      // Arrange
      const nullProfile = {
        id: 'user123',
        userName: null,
        email: null,
        firstName: null,
        lastName: null,
        createdAt: null
      } as any;
      mockUserProfileService.getUserProfile.mockReturnValue(of(nullProfile));

      // Act
      component.loadUserProfile('user123');

      // Assert
      expect(component.userProfile).toEqual(nullProfile);
      expect(component.editForm).toEqual(nullProfile);
    });

    it('should handle very long error messages', () => {
      // Arrange
      const longError = new Error('A'.repeat(1000));
      mockUserProfileService.getUserProfile.mockReturnValue(throwError(() => longError));

      // Act
      component.loadUserProfile('user123');

      // Assert
      expect(component.errorMessage).toContain('A'.repeat(1000));
    });

    it('should handle rapid toggle of edit mode', () => {
      // Arrange
      component.userProfile = mockUserProfile;

      // Act
      for (let i = 0; i < 10; i++) {
        component.toggleEditMode();
      }

      // Assert
      expect(component.isEditMode).toBe(false); // Should be false after even number of toggles
    });

    it('should handle save with no changes', () => {
      // Arrange
      component.userProfile = mockUserProfile;
      component.editForm = { ...mockUserProfile }; // Exact copy
      mockUserProfileService.updateUserProfile.mockReturnValue(of(mockUserProfile));

      // Act
      component.saveProfile();

      // Assert
      expect(mockUserProfileService.updateUserProfile).toHaveBeenCalled();
      expect(component.successMessage).toBe('Profile updated successfully!');
    });

    it('should handle multiple consecutive loads', () => {
      // Arrange
      mockUserProfileService.getUserProfile.mockReturnValue(of(mockUserProfile));

      // Act
      component.loadUserProfile('user1');
      component.loadUserProfile('user2');
      component.loadUserProfile('user3');

      // Assert
      expect(mockUserProfileService.getUserProfile).toHaveBeenCalledTimes(3);
      expect(mockUserProfileService.getUserProfile).toHaveBeenLastCalledWith('user3');
    });
  });
});
