import { TestBed } from '@angular/core/testing';
import axios from 'axios';
import { UserProfileService, UserProfile } from '../src/app/user-profile.service';
import { firstValueFrom } from 'rxjs';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('UserProfileService', () => {
  let service: UserProfileService;
  const mockApiUrl = 'http://localhost:8080/api/user';

  // Sample test data
  const mockUserProfile: UserProfile = {
    id: 'user123',
    userName: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date('2024-01-01')
  };

  const mockUserProfiles: UserProfile[] = [
    mockUserProfile,
    {
      id: 'user456',
      userName: 'janedoe',
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      createdAt: new Date('2024-01-02')
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserProfileService]
    });
    service = TestBed.inject(UserProfileService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should have correct API URL', () => {
      expect(service['apiUrl']).toBe(mockApiUrl);
    });

    it('should be a singleton instance', () => {
      const service2 = TestBed.inject(UserProfileService);
      expect(service).toBe(service2);
    });
  });

  describe('getUserProfile', () => {
    it('should fetch user profile successfully', async () => {
      // Arrange
      const userId = 'user123';
      mockedAxios.get.mockResolvedValue({ data: mockUserProfile });

      // Act
      const result = await firstValueFrom(service.getUserProfile(userId));

      // Assert
      expect(result).toEqual(mockUserProfile);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${mockApiUrl}/${userId}`);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should handle error when fetching user profile', async () => {
      // Arrange
      const userId = 'user123';
      const errorMessage = 'User not found';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(firstValueFrom(service.getUserProfile(userId)))
        .rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${mockApiUrl}/${userId}`);
    });

    it('should handle empty userId', async () => {
      // Arrange
      const userId = '';
      mockedAxios.get.mockResolvedValue({ data: mockUserProfile });

      // Act
      await firstValueFrom(service.getUserProfile(userId));

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(`${mockApiUrl}/`);
    });

    it('should handle special characters in userId', async () => {
      // Arrange
      const userId = 'user@123#test';
      mockedAxios.get.mockResolvedValue({ data: mockUserProfile });

      // Act
      await firstValueFrom(service.getUserProfile(userId));

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(`${mockApiUrl}/${userId}`);
    });

    it('should return Observable that can be subscribed multiple times', async () => {
      // Arrange
      const userId = 'user123';
      mockedAxios.get.mockResolvedValue({ data: mockUserProfile });

      // Act
      const observable = service.getUserProfile(userId);
      const result1 = await firstValueFrom(observable);

      mockedAxios.get.mockResolvedValue({ data: { ...mockUserProfile, userName: 'updated' } });
      const result2 = await firstValueFrom(service.getUserProfile(userId));

      // Assert
      expect(result1).toEqual(mockUserProfile);
      expect(result2.userName).toBe('updated');
    });

    it('should handle network timeout error', async () => {
      // Arrange
      const userId = 'user123';
      mockedAxios.get.mockRejectedValue(new Error('Network timeout'));

      // Act & Assert
      await expect(firstValueFrom(service.getUserProfile(userId)))
        .rejects.toThrow('Network timeout');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const userId = 'user123';
      const updates: Partial<UserProfile> = {
        firstName: 'Johnny',
        lastName: 'Doe Jr'
      };
      const updatedProfile = { ...mockUserProfile, ...updates };
      mockedAxios.put.mockResolvedValue({ data: updatedProfile });

      // Act
      const result = await firstValueFrom(service.updateUserProfile(userId, updates));

      // Assert
      expect(result).toEqual(updatedProfile);
      expect(mockedAxios.put).toHaveBeenCalledWith(`${mockApiUrl}/${userId}`, updates);
      expect(mockedAxios.put).toHaveBeenCalledTimes(1);
    });

    it('should handle update with empty partial profile', async () => {
      // Arrange
      const userId = 'user123';
      const updates: Partial<UserProfile> = {};
      mockedAxios.put.mockResolvedValue({ data: mockUserProfile });

      // Act
      const result = await firstValueFrom(service.updateUserProfile(userId, updates));

      // Assert
      expect(result).toEqual(mockUserProfile);
      expect(mockedAxios.put).toHaveBeenCalledWith(`${mockApiUrl}/${userId}`, updates);
    });

    it('should handle update with single field', async () => {
      // Arrange
      const userId = 'user123';
      const updates: Partial<UserProfile> = { email: 'newemail@example.com' };
      const updatedProfile = { ...mockUserProfile, ...updates };
      mockedAxios.put.mockResolvedValue({ data: updatedProfile });

      // Act
      const result = await firstValueFrom(service.updateUserProfile(userId, updates));

      // Assert
      expect(result.email).toBe('newemail@example.com');
      expect(mockedAxios.put).toHaveBeenCalledWith(`${mockApiUrl}/${userId}`, updates);
    });

    it('should handle error when updating profile', async () => {
      // Arrange
      const userId = 'user123';
      const updates: Partial<UserProfile> = { firstName: 'Johnny' };
      const errorMessage = 'Update failed';
      mockedAxios.put.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(firstValueFrom(service.updateUserProfile(userId, updates)))
        .rejects.toThrow(errorMessage);
      expect(mockedAxios.put).toHaveBeenCalledWith(`${mockApiUrl}/${userId}`, updates);
    });

    it('should handle validation error from server', async () => {
      // Arrange
      const userId = 'user123';
      const updates: Partial<UserProfile> = { email: 'invalid-email' };
      mockedAxios.put.mockRejectedValue(new Error('Invalid email format'));

      // Act & Assert
      await expect(firstValueFrom(service.updateUserProfile(userId, updates)))
        .rejects.toThrow('Invalid email format');
    });

    it('should handle unauthorized error', async () => {
      // Arrange
      const userId = 'user123';
      const updates: Partial<UserProfile> = { firstName: 'Johnny' };
      mockedAxios.put.mockRejectedValue(new Error('Unauthorized'));

      // Act & Assert
      await expect(firstValueFrom(service.updateUserProfile(userId, updates)))
        .rejects.toThrow('Unauthorized');
    });
  });

  describe('deleteUserProfile', () => {
    it('should delete user profile successfully', async () => {
      // Arrange
      const userId = 'user123';
      const mockResponse = { success: true, message: 'Profile deleted successfully' };
      mockedAxios.delete.mockResolvedValue({ data: mockResponse });

      // Act
      const result = await firstValueFrom(service.deleteUserProfile(userId));

      // Assert
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Profile deleted successfully');
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${mockApiUrl}/${userId}`);
      expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
    });

    it('should handle error when deleting profile', async () => {
      // Arrange
      const userId = 'user123';
      const errorMessage = 'Delete failed';
      mockedAxios.delete.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(firstValueFrom(service.deleteUserProfile(userId)))
        .rejects.toThrow(errorMessage);
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${mockApiUrl}/${userId}`);
    });

    it('should handle empty userId for deletion', async () => {
      // Arrange
      const userId = '';
      const mockResponse = { success: false, message: 'Invalid user ID' };
      mockedAxios.delete.mockResolvedValue({ data: mockResponse });

      // Act
      const result = await firstValueFrom(service.deleteUserProfile(userId));

      // Assert
      expect(mockedAxios.delete).toHaveBeenCalledWith(`${mockApiUrl}/`);
    });

    it('should handle not found error', async () => {
      // Arrange
      const userId = 'nonexistent';
      mockedAxios.delete.mockRejectedValue(new Error('User not found'));

      // Act & Assert
      await expect(firstValueFrom(service.deleteUserProfile(userId)))
        .rejects.toThrow('User not found');
    });

    it('should handle server error during deletion', async () => {
      // Arrange
      const userId = 'user123';
      mockedAxios.delete.mockRejectedValue(new Error('Internal server error'));

      // Act & Assert
      await expect(firstValueFrom(service.deleteUserProfile(userId)))
        .rejects.toThrow('Internal server error');
    });

    it('should handle successful deletion with custom message', async () => {
      // Arrange
      const userId = 'user123';
      const mockResponse = { success: true, message: 'User account has been permanently removed' };
      mockedAxios.delete.mockResolvedValue({ data: mockResponse });

      // Act
      const result = await firstValueFrom(service.deleteUserProfile(userId));

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toContain('permanently removed');
    });
  });

  describe('getAllProfiles', () => {
    it('should fetch all user profiles successfully', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValue({ data: mockUserProfiles });

      // Act
      const result = await firstValueFrom(service.getAllProfiles());

      // Assert
      expect(result).toEqual(mockUserProfiles);
      expect(result.length).toBe(2);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${mockApiUrl}/all`);
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should handle empty profiles list', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValue({ data: [] });

      // Act
      const result = await firstValueFrom(service.getAllProfiles());

      // Assert
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${mockApiUrl}/all`);
    });

    it('should handle error when fetching all profiles', async () => {
      // Arrange
      const errorMessage = 'Fetch all profiles failed';
      mockedAxios.get.mockRejectedValue(new Error(errorMessage));

      // Act & Assert
      await expect(firstValueFrom(service.getAllProfiles()))
        .rejects.toThrow(errorMessage);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${mockApiUrl}/all`);
    });

    it('should handle unauthorized access error', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValue(new Error('Unauthorized: Admin access required'));

      // Act & Assert
      await expect(firstValueFrom(service.getAllProfiles()))
        .rejects.toThrow('Unauthorized: Admin access required');
    });

    it('should return array with multiple profiles', async () => {
      // Arrange
      const largeProfileList = Array.from({ length: 100 }, (_, i) => ({
        ...mockUserProfile,
        id: `user${i}`,
        userName: `user${i}`
      }));
      mockedAxios.get.mockResolvedValue({ data: largeProfileList });

      // Act
      const result = await firstValueFrom(service.getAllProfiles());

      // Assert
      expect(result.length).toBe(100);
      expect(result[0].id).toBe('user0');
      expect(result[99].id).toBe('user99');
    });

    it('should handle server timeout error', async () => {
      // Arrange
      mockedAxios.get.mockRejectedValue(new Error('Request timeout'));

      // Act & Assert
      await expect(firstValueFrom(service.getAllProfiles()))
        .rejects.toThrow('Request timeout');
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    it('should handle null response data', async () => {
      // Arrange
      const userId = 'user123';
      mockedAxios.get.mockResolvedValue({ data: null });

      // Act
      const result = await firstValueFrom(service.getUserProfile(userId));

      // Assert
      expect(result).toBeNull();
    });

    it('should handle malformed response structure', async () => {
      // Arrange
      const userId = 'user123';
      mockedAxios.get.mockResolvedValue({ wrongKey: mockUserProfile });

      // Act
      const result = await firstValueFrom(service.getUserProfile(userId));

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle concurrent requests', async () => {
      // Arrange
      mockedAxios.get.mockResolvedValue({ data: mockUserProfile });

      // Act
      const promise1 = firstValueFrom(service.getUserProfile('user1'));
      const promise2 = firstValueFrom(service.getUserProfile('user2'));
      const promise3 = firstValueFrom(service.getUserProfile('user3'));

      const results = await Promise.all([promise1, promise2, promise3]);

      // Assert
      expect(results.length).toBe(3);
      expect(mockedAxios.get).toHaveBeenCalledTimes(3);
    });

    it('should handle very long userId strings', async () => {
      // Arrange
      const longUserId = 'a'.repeat(1000);
      mockedAxios.get.mockResolvedValue({ data: mockUserProfile });

      // Act
      await firstValueFrom(service.getUserProfile(longUserId));

      // Assert
      expect(mockedAxios.get).toHaveBeenCalledWith(`${mockApiUrl}/${longUserId}`);
    });

    it('should handle special unicode characters in updates', async () => {
      // Arrange
      const userId = 'user123';
      const updates: Partial<UserProfile> = {
        firstName: '🎉',
        lastName: '你好'
      };
      const updatedProfile = { ...mockUserProfile, ...updates };
      mockedAxios.put.mockResolvedValue({ data: updatedProfile });

      // Act
      const result = await firstValueFrom(service.updateUserProfile(userId, updates));

      // Assert
      expect(result.firstName).toBe('🎉');
      expect(result.lastName).toBe('你好');
    });
  });
});
