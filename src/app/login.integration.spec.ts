import { TestBed, ComponentFixture, fakeAsync, tick, flush } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

const mockAxios = {
  get: jest.fn(),
  post: jest.fn()
};

jest.mock('axios', () => mockAxios);

describe('Login Integration Tests', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Full Login Flow Integration', () => {
    it('should complete full captcha fetch and login flow', fakeAsync(() => {
      // Mock IP fetch
      const mockIpResponse = {
        data: 'callback({"ip":"10.0.0.1"});'
      };
      mockAxios.get.mockResolvedValue(mockIpResponse);

      // Mock captcha fetch
      const mockCaptchaResponse = {
        data: { captcha: 'XYZ789' }
      };
      mockAxios.post.mockResolvedValueOnce(mockCaptchaResponse);

      // Initialize component (triggers getCaptcha)
      component.ngOnInit();
      tick();

      expect(component.ipAddress).toBe('10.0.0.1');
      expect(component.captcha).toBe('XYZ789');

      // Now perform login
      component.loginModel = {
        userName: 'integrationUser',
        password: 'integrationPass',
        captcha: 'XYZ789'
      };

      const mockLoginResponse = { data: 'Login successful' };
      mockAxios.post.mockResolvedValueOnce(mockLoginResponse);

      component.submit();
      tick();

      expect(component.hasError).toBe(false);
      expect(component.successMessage).toBe('User validated successfully!');
      expect(mockAxios.post).toHaveBeenCalledWith('http://localhost:8080/login', {
        userName: 'integrationUser',
        password: 'integrationPass',
        captcha: 'XYZ789',
        ipAddress: '10.0.0.1'
      });
    }));

    it('should handle captcha refresh during login flow', fakeAsync(() => {
      // Initial captcha fetch
      const mockIpResponse = { data: 'callback({"ip":"10.0.0.1"});' };
      const mockCaptchaResponse1 = { data: { captcha: 'FIRST123' } };

      mockAxios.get.mockResolvedValue(mockIpResponse);
      mockAxios.post.mockResolvedValueOnce(mockCaptchaResponse1);

      component.ngOnInit();
      tick();

      expect(component.captcha).toBe('FIRST123');

      // Refresh captcha
      const mockCaptchaResponse2 = { data: { captcha: 'SECOND456' } };
      mockAxios.post.mockResolvedValueOnce(mockCaptchaResponse2);

      component.refreshCaptcha();
      tick();

      expect(component.captcha).toBe('SECOND456');
      expect(mockAxios.get).toHaveBeenCalledTimes(2);
    }));
  });

  describe('Form Validation Integration', () => {
    it('should validate all fields before submission', () => {
      component.loginModel = {};
      component.submit();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Please enter valid username');

      component.loginModel.userName = 'testuser';
      component.submit();

      expect(component.errorMessage).toBe('Please enter valid password');

      component.loginModel.password = 'testpass';
      component.submit();

      expect(component.errorMessage).toBe('Please enter valid captcha');
    });

    it('should clear previous messages on new submission', () => {
      component.hasError = false;
      component.successMessage = 'Previous success';
      component.loginModel = {};

      component.submit();

      expect(component.successMessage).toBeNull();
      expect(component.hasError).toBe(true);
    });
  });

  describe('Error Recovery Flow', () => {
    it('should recover from network error and allow retry', fakeAsync(() => {
      component.loginModel = {
        userName: 'testuser',
        password: 'testpass',
        captcha: 'ABC123'
      };
      component.ipAddress = '10.0.0.1';

      // First attempt fails
      const mockError = { message: 'Network timeout' };
      mockAxios.post.mockRejectedValueOnce(mockError);

      component.submit();
      tick();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Network timeout');

      // Second attempt succeeds
      const mockSuccess = { data: 'Success' };
      mockAxios.post.mockResolvedValueOnce(mockSuccess);

      component.submit();
      tick();

      expect(component.hasError).toBe(false);
      expect(component.successMessage).toBe('User validated successfully!');
    }));

    it('should handle invalid captcha and allow refresh', fakeAsync(() => {
      component.loginModel = {
        userName: 'testuser',
        password: 'testpass',
        captcha: 'WRONG'
      };
      component.ipAddress = '10.0.0.1';

      const mockError = {
        response: { data: 'Invalid captcha' }
      };
      mockAxios.post.mockRejectedValueOnce(mockError);

      component.submit();
      tick();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Invalid captcha');

      // Refresh captcha
      const mockIpResponse = { data: 'callback({"ip":"10.0.0.1"});' };
      const mockNewCaptcha = { data: { captcha: 'NEWCAPTCHA' } };

      mockAxios.get.mockResolvedValue(mockIpResponse);
      mockAxios.post.mockResolvedValueOnce(mockNewCaptcha);

      component.refreshCaptcha();
      tick();

      expect(component.captcha).toBe('NEWCAPTCHA');
    }));
  });

  describe('IP Address Parsing', () => {
    it('should correctly parse IP address from various formats', fakeAsync(() => {
      const testCases = [
        { input: 'callback({"ip":"192.168.1.1"});', expected: '192.168.1.1' },
        { input: 'callback({"ip":"10.0.0.1"});', expected: '10.0.0.1' },
        { input: 'callback({"ip":"172.16.0.1"});', expected: '172.16.0.1' }
      ];

      for (const testCase of testCases) {
        mockAxios.get.mockResolvedValue({ data: testCase.input });
        mockAxios.post.mockResolvedValue({ data: { captcha: 'TEST' } });

        component.getCaptcha();
        tick();

        expect(component.ipAddress).toBe(testCase.expected);
      }
    }));
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple rapid refresh requests', fakeAsync(() => {
      const mockIpResponse = { data: 'callback({"ip":"10.0.0.1"});' };

      mockAxios.get.mockResolvedValue(mockIpResponse);

      // Create multiple captcha responses
      mockAxios.post
        .mockResolvedValueOnce({ data: { captcha: 'CAP1' } })
        .mockResolvedValueOnce({ data: { captcha: 'CAP2' } })
        .mockResolvedValueOnce({ data: { captcha: 'CAP3' } });

      component.refreshCaptcha();
      component.refreshCaptcha();
      component.refreshCaptcha();

      tick();
      flush();

      expect(mockAxios.get).toHaveBeenCalled();
      expect(mockAxios.post).toHaveBeenCalled();
    }));
  });

  describe('State Consistency', () => {
    it('should maintain consistent state throughout login process', fakeAsync(() => {
      // Initial state
      expect(component.hasError).toBe(false);
      expect(component.captcha).toBeNull();

      // After captcha fetch
      mockAxios.get.mockResolvedValue({ data: 'callback({"ip":"10.0.0.1"});' });
      mockAxios.post.mockResolvedValue({ data: { captcha: 'TEST' } });

      component.getCaptcha();
      tick();

      expect(component.ipAddress).toBeDefined();
      expect(component.captcha).toBeDefined();

      // After validation error
      component.loginModel = {};
      component.submit();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBeDefined();
      expect(component.successMessage).toBeNull();

      // After successful login
      component.loginModel = {
        userName: 'user',
        password: 'pass',
        captcha: 'TEST'
      };
      mockAxios.post.mockResolvedValueOnce({ data: 'Success' });

      component.submit();
      tick();

      expect(component.hasError).toBe(false);
      expect(component.successMessage).toBeDefined();
    }));
  });
});
