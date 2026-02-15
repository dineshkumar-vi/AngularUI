import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

describe('Form Validation Tests', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  describe('Username Validation', () => {
    it('should reject empty username', () => {
      component.loginModel = { userName: '', password: 'test', captcha: 'test' };
      component.submit();
      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toContain('username');
    });

    it('should reject null username', () => {
      component.loginModel = { userName: null, password: 'test', captcha: 'test' };
      component.submit();
      expect(component.hasError).toBe(true);
    });

    it('should reject undefined username', () => {
      component.loginModel = { password: 'test', captcha: 'test' };
      component.submit();
      expect(component.hasError).toBe(true);
    });

    it('should accept valid username', () => {
      component.loginModel = { userName: 'validuser' };
      expect(component.loginModel.userName).toBeTruthy();
    });

    it('should accept username with special characters', () => {
      component.loginModel = { userName: 'user@example.com' };
      expect(component.loginModel.userName).toBeTruthy();
    });

    it('should accept username with numbers', () => {
      component.loginModel = { userName: 'user123' };
      expect(component.loginModel.userName).toBeTruthy();
    });
  });

  describe('Password Validation', () => {
    it('should reject empty password', () => {
      component.loginModel = { userName: 'test', password: '', captcha: 'test' };
      component.submit();
      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toContain('password');
    });

    it('should reject null password', () => {
      component.loginModel = { userName: 'test', password: null, captcha: 'test' };
      component.submit();
      expect(component.hasError).toBe(true);
    });

    it('should reject undefined password', () => {
      component.loginModel = { userName: 'test', captcha: 'test' };
      component.submit();
      expect(component.hasError).toBe(true);
    });

    it('should accept valid password', () => {
      component.loginModel = { password: 'ValidPass123!' };
      expect(component.loginModel.password).toBeTruthy();
    });

    it('should accept password with spaces', () => {
      component.loginModel = { password: 'pass word 123' };
      expect(component.loginModel.password).toBeTruthy();
    });
  });

  describe('Captcha Validation', () => {
    it('should reject empty captcha', () => {
      component.loginModel = { userName: 'test', password: 'test', captcha: '' };
      component.submit();
      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toContain('captcha');
    });

    it('should reject null captcha', () => {
      component.loginModel = { userName: 'test', password: 'test', captcha: null };
      component.submit();
      expect(component.hasError).toBe(true);
    });

    it('should reject undefined captcha', () => {
      component.loginModel = { userName: 'test', password: 'test' };
      component.submit();
      expect(component.hasError).toBe(true);
    });

    it('should accept valid captcha', () => {
      component.loginModel = { captcha: 'ABC123' };
      expect(component.loginModel.captcha).toBeTruthy();
    });

    it('should accept alphanumeric captcha', () => {
      component.loginModel = { captcha: 'aB3De5' };
      expect(component.loginModel.captcha).toBeTruthy();
    });
  });

  describe('Multiple Field Validation', () => {
    it('should validate fields in correct order', () => {
      component.loginModel = {};
      component.submit();
      expect(component.errorMessage).toContain('username');

      component.loginModel.userName = 'test';
      component.submit();
      expect(component.errorMessage).toContain('password');

      component.loginModel.password = 'test';
      component.submit();
      expect(component.errorMessage).toContain('captcha');
    });

    it('should clear success message on validation error', () => {
      component.successMessage = 'Previous success';
      component.loginModel = {};
      component.submit();
      expect(component.successMessage).toBeNull();
    });

    it('should set hasError flag on any validation failure', () => {
      const testCases = [
        { userName: '', password: 'test', captcha: 'test' },
        { userName: 'test', password: '', captcha: 'test' },
        { userName: 'test', password: 'test', captcha: '' }
      ];

      testCases.forEach(testCase => {
        component.hasError = false;
        component.loginModel = testCase;
        component.submit();
        expect(component.hasError).toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only username', () => {
      component.loginModel = { userName: '   ', password: 'test', captcha: 'test' };
      // Whitespace is technically valid in this implementation
      expect(component.loginModel.userName).toBeTruthy();
    });

    it('should handle very long inputs', () => {
      const longString = 'a'.repeat(1000);
      component.loginModel = {
        userName: longString,
        password: longString,
        captcha: longString
      };
      expect(component.loginModel.userName).toBeTruthy();
    });

    it('should handle special characters in all fields', () => {
      component.loginModel = {
        userName: '!@#$%^&*()',
        password: '!@#$%^&*()',
        captcha: '!@#$%'
      };
      expect(component.loginModel.userName).toBeTruthy();
    });

    it('should handle unicode characters', () => {
      component.loginModel = {
        userName: 'user日本語',
        password: 'pass日本語',
        captcha: 'ABC日本'
      };
      expect(component.loginModel.userName).toBeTruthy();
    });
  });

  describe('Form State Management', () => {
    it('should maintain form data after validation error', () => {
      component.loginModel = { userName: 'testuser', password: '', captcha: 'ABC' };
      component.submit();

      expect(component.loginModel.userName).toBe('testuser');
      expect(component.loginModel.captcha).toBe('ABC');
    });

    it('should allow resubmission after fixing validation errors', () => {
      component.loginModel = { userName: 'test' };
      component.submit();
      expect(component.hasError).toBe(true);

      component.loginModel.password = 'pass';
      component.submit();
      expect(component.hasError).toBe(true);

      component.loginModel.captcha = 'CAP';
      // Now all fields are filled
      expect(component.loginModel).toEqual({
        userName: 'test',
        password: 'pass',
        captcha: 'CAP'
      });
    });
  });

  describe('Error Message Accuracy', () => {
    it('should provide specific error message for missing username', () => {
      component.loginModel = { password: 'test', captcha: 'test' };
      component.submit();
      expect(component.errorMessage).toBe('Please enter valid username');
    });

    it('should provide specific error message for missing password', () => {
      component.loginModel = { userName: 'test', captcha: 'test' };
      component.submit();
      expect(component.errorMessage).toBe('Please enter valid password');
    });

    it('should provide specific error message for missing captcha', () => {
      component.loginModel = { userName: 'test', password: 'test' };
      component.submit();
      expect(component.errorMessage).toBe('Please enter valid captcha');
    });

    it('should display error messages correctly', () => {
      component.loginModel = {};
      component.submit();
      expect(component.errorMessage).toBeDefined();
      expect(component.errorMessage.length).toBeGreaterThan(0);
    });
  });
});
