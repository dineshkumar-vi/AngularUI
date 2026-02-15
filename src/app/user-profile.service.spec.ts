import { TestBed } from '@angular/core/testing';
import { UserProfileService, UserProfile } from './user-profile.service';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserProfileService', () => {
  let service: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserProfileService]
    });
    service = TestBed.inject(UserProfileService);
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserProfile', () => {
    it('should fetch user profile successfully', (done) => {
      const mockProfile: UserProfile = {
        id: '123',
        userName: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date('2024-01-01')
      };

      mockedAxios.get.mockResolvedValue({ data: mockProfile });

      service.getUserProfile('123').subscribe(profile => {
        expect(profile).toEqual(mockProfile);
        expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/user/123');
        done();
      });
    });

    it('should handle error when fetching user profile', (done) => {
      const errorMessage = 'User not found';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      service.getUserProfile('999').subscribe(
        () => fail('should have failed'),
        error => {
          expect(error.message).toBe(errorMessage);
          done();
        }
      );
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', (done) => {
      const updatedProfile: UserProfile = {
        id: '123',
        userName: 'testuser',
        email: 'newemail@example.com',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date('2024-01-01')
      };

      mockedAxios.put.mockResolvedValue({ data: updatedProfile });

      service.updateUserProfile('123', { email: 'newemail@example.com' }).subscribe(profile => {
        expect(profile.email).toBe('newemail@example.com');
        expect(mockedAxios.put).toHaveBeenCalledWith(
          'http://localhost:8080/api/user/123',
          { email: 'newemail@example.com' }
        );
        done();
      });
    });

    it('should handle error when updating user profile', (done) => {
      const errorMessage = 'Update failed';
      mockedAxios.put.mockRejectedValue(new Error(errorMessage));

      service.updateUserProfile('123', { email: 'test@test.com' }).subscribe(
        () => fail('should have failed'),
        error => {
          expect(error.message).toBe(errorMessage);
          done();
        }
      );
    });
  });

  describe('deleteUserProfile', () => {
    it('should delete user profile successfully', (done) => {
      const deleteResponse = { success: true, message: 'User deleted successfully' };
      mockedAxios.delete.mockResolvedValue({ data: deleteResponse });

      service.deleteUserProfile('123').subscribe(response => {
        expect(response.success).toBe(true);
        expect(response.message).toBe('User deleted successfully');
        expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:8080/api/user/123');
        done();
      });
    });

    it('should handle error when deleting user profile', (done) => {
      const errorMessage = 'Delete failed';
      mockedAxios.delete.mockRejectedValue(new Error(errorMessage));

      service.deleteUserProfile('123').subscribe(
        () => fail('should have failed'),
        error => {
          expect(error.message).toBe(errorMessage);
          done();
        }
      );
    });
  });

  describe('getAllProfiles', () => {
    it('should fetch all user profiles successfully', (done) => {
      const mockProfiles: UserProfile[] = [
        {
          id: '123',
          userName: 'user1',
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          createdAt: new Date('2024-01-01')
        },
        {
          id: '456',
          userName: 'user2',
          email: 'user2@example.com',
          firstName: 'User',
          lastName: 'Two',
          createdAt: new Date('2024-01-02')
        }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockProfiles });

      service.getAllProfiles().subscribe(profiles => {
        expect(profiles.length).toBe(2);
        expect(profiles).toEqual(mockProfiles);
        expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:8080/api/user/all');
        done();
      });
    });

    it('should handle error when fetching all profiles', (done) => {
      const errorMessage = 'Unauthorized';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      service.getAllProfiles().subscribe(
        () => fail('should have failed'),
        error => {
          expect(error.message).toBe(errorMessage);
          done();
        }
      );
    });
  });
});
