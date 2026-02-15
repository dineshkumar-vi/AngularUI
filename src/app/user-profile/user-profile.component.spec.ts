import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profile.component';
import { UserProfileService, UserProfile } from '../user-profile.service';
import { of, throwError } from 'rxjs';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let mockUserProfileService: jasmine.SpyObj<UserProfileService>;

  const mockProfile: UserProfile = {
    id: '123',
    userName: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date('2024-01-01')
  };

  beforeEach(async () => {
    const userProfileServiceSpy = jasmine.createSpyObj('UserProfileService', [
      'getUserProfile',
      'updateUserProfile',
      'deleteUserProfile'
    ]);

    await TestBed.configureTestingModule({
      declarations: [ UserProfileComponent ],
      imports: [ FormsModule ],
      providers: [
        { provide: UserProfileService, useValue: userProfileServiceSpy }
      ]
    }).compileComponents();

    mockUserProfileService = TestBed.inject(UserProfileService) as jasmine.SpyObj<UserProfileService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load user profile if userId exists in localStorage', () => {
      spyOn(localStorage, 'getItem').and.returnValue('123');
      mockUserProfileService.getUserProfile.and.returnValue(of(mockProfile));

      component.ngOnInit();

      expect(localStorage.getItem).toHaveBeenCalledWith('userId');
      expect(mockUserProfileService.getUserProfile).toHaveBeenCalledWith('123');
      expect(component.userProfile).toEqual(mockProfile);
    });

    it('should not load user profile if userId does not exist', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      component.ngOnInit();

      expect(mockUserProfileService.getUserProfile).not.toHaveBeenCalled();
    });
  });

  describe('loadUserProfile', () => {
    it('should load user profile successfully', () => {
      mockUserProfileService.getUserProfile.and.returnValue(of(mockProfile));

      component.loadUserProfile('123');

      expect(component.isLoading).toBe(false);
      expect(component.userProfile).toEqual(mockProfile);
      expect(component.editForm).toEqual(mockProfile);
      expect(component.errorMessage).toBeNull();
    });

    it('should handle error when loading user profile', () => {
      const error = new Error('Failed to load');
      mockUserProfileService.getUserProfile.and.returnValue(throwError(() => error));

      component.loadUserProfile('123');

      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toContain('Failed to load user profile');
    });
  });

  describe('toggleEditMode', () => {
    it('should toggle edit mode to true', () => {
      component.isEditMode = false;

      component.toggleEditMode();

      expect(component.isEditMode).toBe(true);
    });

    it('should toggle edit mode to false and reset form', () => {
      component.userProfile = mockProfile;
      component.isEditMode = true;
      component.editForm = { email: 'changed@example.com' };

      component.toggleEditMode();

      expect(component.isEditMode).toBe(false);
      expect(component.editForm).toEqual(mockProfile);
    });
  });

  describe('saveProfile', () => {
    beforeEach(() => {
      component.userProfile = mockProfile;
      component.editForm = { email: 'newemail@example.com' };
    });

    it('should save profile successfully', () => {
      const updatedProfile = { ...mockProfile, email: 'newemail@example.com' };
      mockUserProfileService.updateUserProfile.and.returnValue(of(updatedProfile));

      component.saveProfile();

      expect(mockUserProfileService.updateUserProfile).toHaveBeenCalledWith('123', component.editForm);
      expect(component.userProfile).toEqual(updatedProfile);
      expect(component.successMessage).toBe('Profile updated successfully!');
      expect(component.isEditMode).toBe(false);
    });

    it('should handle error when saving profile', () => {
      const error = new Error('Update failed');
      mockUserProfileService.updateUserProfile.and.returnValue(throwError(() => error));

      component.saveProfile();

      expect(component.errorMessage).toContain('Failed to update profile');
      expect(component.isLoading).toBe(false);
    });

    it('should not save if userProfile is null', () => {
      component.userProfile = null;

      component.saveProfile();

      expect(mockUserProfileService.updateUserProfile).not.toHaveBeenCalled();
    });
  });

  describe('deleteProfile', () => {
    beforeEach(() => {
      component.userProfile = mockProfile;
    });

    it('should delete profile successfully when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const deleteResponse = { success: true, message: 'Profile deleted' };
      mockUserProfileService.deleteUserProfile.and.returnValue(of(deleteResponse));

      component.deleteProfile();

      expect(window.confirm).toHaveBeenCalled();
      expect(mockUserProfileService.deleteUserProfile).toHaveBeenCalledWith('123');
      expect(component.successMessage).toBe('Profile deleted');
      expect(component.userProfile).toBeNull();
    });

    it('should not delete profile when not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.deleteProfile();

      expect(mockUserProfileService.deleteUserProfile).not.toHaveBeenCalled();
    });

    it('should handle error when deleting profile', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      const error = new Error('Delete failed');
      mockUserProfileService.deleteUserProfile.and.returnValue(throwError(() => error));

      component.deleteProfile();

      expect(component.errorMessage).toContain('Failed to delete profile');
      expect(component.isLoading).toBe(false);
    });

    it('should not delete if userProfile is null', () => {
      component.userProfile = null;

      component.deleteProfile();

      expect(mockUserProfileService.deleteUserProfile).not.toHaveBeenCalled();
    });
  });
});
