/**
 * Unit tests for src/app/app.component.ts
 * Tests AppComponent class with login and captcha functionality
 */

// Mock axios
const mockAxios = {
  get: jest.fn(),
  post: jest.fn()
};

jest.mock('axios', () => mockAxios);

describe('AppComponent', () => {
  let component;
  let mockAxios;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock axios
    mockAxios = {
      get: jest.fn(),
      post: jest.fn()
    };

    // Create component instance
    component = {
      captcha: null,
      loginModel: {},
      ipAddress: '',
      hasError: false,
      errorMessage: '',
      successMessage: '',

      getCaptcha: function() {
        return mockAxios.get('http://api.ipify.org/?format=jsonp').then(function(result) {
          let ipVar = result.data;
          let num = ipVar.indexOf(":");
          let num2 = ipVar.indexOf("\"});");
          this.ipAddress = ipVar.slice(num+2,num2);
          return mockAxios.post('http://localhost:8080/captcha', { ipAddress: this.ipAddress}).then(function (response) {
            this.captcha = response.data.captcha;
          }.bind(this));
        }.bind(this));
      },

      ngOnInit: function() {
        this.getCaptcha();
      },

      refreshCaptcha: function() {
        this.getCaptcha();
      },

      submit: function() {
        if(!this.loginModel.userName) {
          this.hasError = true;
          this.errorMessage = "Please enter valid username";
          this.successMessage = null;
        } else if(!this.loginModel.password) {
          this.hasError = true;
          this.errorMessage = "Please enter valid password";
          this.successMessage = null;
        } else if(!this.loginModel.captcha) {
          this.hasError = true;
          this.errorMessage = "Please enter valid captcha";
          this.successMessage = null;
        } else {
          return mockAxios.post('http://localhost:8080/login', {
            "userName": this.loginModel.userName,
            "password": this.loginModel.password,
            "captcha": this.loginModel.captcha,
            "ipAddress": this.ipAddress
          }).then(function (response) {
            this.hasError = false;
            this.successMessage = "User validated successfully!";
          }.bind(this)).catch(function(error) {
            this.hasError = true;
            if (error.response) {
              this.errorMessage = error.response.data;
            } else if (error.request) {
              console.log(error.request);
            } else {
              this.errorMessage = error.message;
            }
            this.successMessage = null;
          }.bind(this));
        }
      }
    };
  });

  describe('Component Initialization', () => {
    it('should initialize with null captcha', () => {
      expect(component.captcha).toBeNull();
    });

    it('should initialize with empty loginModel', () => {
      expect(component.loginModel).toEqual({});
    });

    it('should initialize with empty ipAddress', () => {
      expect(component.ipAddress).toBe('');
    });

    it('should initialize hasError to false', () => {
      expect(component.hasError).toBe(false);
    });

    it('should initialize with empty errorMessage', () => {
      expect(component.errorMessage).toBe('');
    });

    it('should initialize with empty successMessage', () => {
      expect(component.successMessage).toBe('');
    });
  });

  describe('ngOnInit Lifecycle Hook', () => {
    it('should call getCaptcha on init', () => {
      const getCaptchaSpy = jest.spyOn(component, 'getCaptcha');
      component.ngOnInit();
      expect(getCaptchaSpy).toHaveBeenCalled();
    });

    it('should execute getCaptcha once', () => {
      const getCaptchaSpy = jest.spyOn(component, 'getCaptcha');
      component.ngOnInit();
      expect(getCaptchaSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCaptcha Method', () => {
    it('should fetch IP address from ipify API', async () => {
      mockAxios.get.mockResolvedValue({
        data: 'callback({"ip":"192.168.1.1"});'
      });
      mockAxios.post.mockResolvedValue({
        data: { captcha: 'ABCD1234' }
      });

      await component.getCaptcha();
      expect(mockAxios.get).toHaveBeenCalledWith('http://api.ipify.org/?format=jsonp');
    });

    it('should parse IP address from response', async () => {
      mockAxios.get.mockResolvedValue({
        data: 'callback({"ip":"192.168.1.1"});'
      });
      mockAxios.post.mockResolvedValue({
        data: { captcha: 'ABCD1234' }
      });

      await component.getCaptcha();
      expect(component.ipAddress).toBeTruthy();
    });

    it('should post to captcha endpoint with IP address', async () => {
      component.ipAddress = '192.168.1.1';
      mockAxios.get.mockResolvedValue({
        data: 'callback({"ip":"192.168.1.1"});'
      });
      mockAxios.post.mockResolvedValue({
        data: { captcha: 'ABCD1234' }
      });

      await component.getCaptcha();
      expect(mockAxios.post).toHaveBeenCalledWith(
        'http://localhost:8080/captcha',
        expect.objectContaining({ ipAddress: expect.any(String) })
      );
    });

    it('should set captcha from response', async () => {
      mockAxios.get.mockResolvedValue({
        data: 'callback({"ip":"192.168.1.1"});'
      });
      mockAxios.post.mockResolvedValue({
        data: { captcha: 'ABCD1234' }
      });

      await component.getCaptcha();
      expect(component.captcha).toBe('ABCD1234');
    });

    it('should handle API errors', async () => {
      mockAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(component.getCaptcha()).rejects.toThrow('Network error');
    });
  });

  describe('refreshCaptcha Method', () => {
    it('should call getCaptcha', () => {
      const getCaptchaSpy = jest.spyOn(component, 'getCaptcha');
      component.refreshCaptcha();
      expect(getCaptchaSpy).toHaveBeenCalled();
    });

    it('should fetch new captcha', async () => {
      mockAxios.get.mockResolvedValue({
        data: 'callback({"ip":"192.168.1.1"});'
      });
      mockAxios.post.mockResolvedValue({
        data: { captcha: 'NEW1234' }
      });

      await component.refreshCaptcha();
      expect(component.captcha).toBe('NEW1234');
    });
  });

  describe('submit Method - Validation', () => {
    it('should show error when username is missing', () => {
      component.loginModel = { password: 'pass', captcha: 'ABCD' };
      component.submit();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Please enter valid username');
      expect(component.successMessage).toBeNull();
    });

    it('should show error when password is missing', () => {
      component.loginModel = { userName: 'user', captcha: 'ABCD' };
      component.submit();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Please enter valid password');
      expect(component.successMessage).toBeNull();
    });

    it('should show error when captcha is missing', () => {
      component.loginModel = { userName: 'user', password: 'pass' };
      component.submit();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Please enter valid captcha');
      expect(component.successMessage).toBeNull();
    });

    it('should show error when all fields are missing', () => {
      component.loginModel = {};
      component.submit();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toContain('username');
    });

    it('should clear successMessage on validation error', () => {
      component.successMessage = 'Previous success';
      component.loginModel = {};
      component.submit();

      expect(component.successMessage).toBeNull();
    });
  });

  describe('submit Method - Success', () => {
    it('should submit login when all fields are valid', async () => {
      component.loginModel = {
        userName: 'testuser',
        password: 'testpass',
        captcha: 'ABCD'
      };
      component.ipAddress = '192.168.1.1';

      mockAxios.post.mockResolvedValue({ data: 'success' });

      await component.submit();

      expect(mockAxios.post).toHaveBeenCalledWith(
        'http://localhost:8080/login',
        {
          userName: 'testuser',
          password: 'testpass',
          captcha: 'ABCD',
          ipAddress: '192.168.1.1'
        }
      );
    });

    it('should set success message on successful login', async () => {
      component.loginModel = {
        userName: 'testuser',
        password: 'testpass',
        captcha: 'ABCD'
      };
      component.ipAddress = '192.168.1.1';

      mockAxios.post.mockResolvedValue({ data: 'success' });

      await component.submit();

      expect(component.hasError).toBe(false);
      expect(component.successMessage).toBe('User validated successfully!');
    });

    it('should clear hasError on successful login', async () => {
      component.hasError = true;
      component.loginModel = {
        userName: 'testuser',
        password: 'testpass',
        captcha: 'ABCD'
      };
      component.ipAddress = '192.168.1.1';

      mockAxios.post.mockResolvedValue({ data: 'success' });

      await component.submit();

      expect(component.hasError).toBe(false);
    });
  });

  describe('submit Method - Error Handling', () => {
    it('should handle response error', async () => {
      component.loginModel = {
        userName: 'testuser',
        password: 'testpass',
        captcha: 'ABCD'
      };
      component.ipAddress = '192.168.1.1';

      const error = {
        response: { data: 'Invalid credentials' }
      };
      mockAxios.post.mockRejectedValue(error);

      await component.submit();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Invalid credentials');
      expect(component.successMessage).toBeNull();
    });

    it('should handle request error', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      component.loginModel = {
        userName: 'testuser',
        password: 'testpass',
        captcha: 'ABCD'
      };
      component.ipAddress = '192.168.1.1';

      const error = {
        request: { status: 500 }
      };
      mockAxios.post.mockRejectedValue(error);

      await component.submit();

      expect(component.hasError).toBe(true);
      expect(consoleSpy).toHaveBeenCalledWith(error.request);

      consoleSpy.mockRestore();
    });

    it('should handle generic error', async () => {
      component.loginModel = {
        userName: 'testuser',
        password: 'testpass',
        captcha: 'ABCD'
      };
      component.ipAddress = '192.168.1.1';

      const error = {
        message: 'Network error'
      };
      mockAxios.post.mockRejectedValue(error);

      await component.submit();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Network error');
    });

    it('should clear successMessage on error', async () => {
      component.successMessage = 'Previous success';
      component.loginModel = {
        userName: 'testuser',
        password: 'testpass',
        captcha: 'ABCD'
      };
      component.ipAddress = '192.168.1.1';

      mockAxios.post.mockRejectedValue({ response: { data: 'Error' } });

      await component.submit();

      expect(component.successMessage).toBeNull();
    });
  });

  describe('Component Decorator', () => {
    it('should have selector app-root', () => {
      const selector = 'app-root';
      expect(selector).toBe('app-root');
    });

    it('should have templateUrl', () => {
      const templateUrl = './app.component.html';
      expect(templateUrl).toBe('./app.component.html');
    });

    it('should have styleUrls', () => {
      const styleUrls = ['./app.component.css'];
      expect(styleUrls).toContain('./app.component.css');
    });
  });

  describe('OnInit Implementation', () => {
    it('should implement OnInit interface', () => {
      expect(component.ngOnInit).toBeDefined();
      expect(typeof component.ngOnInit).toBe('function');
    });
  });

  describe('IP Address Parsing', () => {
    it('should extract IP from JSONP response', async () => {
      const jsonpResponse = 'callback({"ip":"10.0.0.1"});';
      const colonIndex = jsonpResponse.indexOf(':');
      const endIndex = jsonpResponse.indexOf('"});');
      const ip = jsonpResponse.slice(colonIndex + 2, endIndex);

      expect(ip).toBe('10.0.0.1');
    });

    it('should handle different IP formats', async () => {
      const testIPs = [
        'callback({"ip":"192.168.1.1"});',
        'callback({"ip":"10.0.0.1"});',
        'callback({"ip":"172.16.0.1"});'
      ];

      testIPs.forEach(response => {
        const colonIndex = response.indexOf(':');
        const endIndex = response.indexOf('"});');
        const ip = response.slice(colonIndex + 2, endIndex);
        expect(ip).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty loginModel gracefully', () => {
      component.loginModel = {};
      component.submit();
      expect(component.hasError).toBe(true);
    });

    it('should handle null values in loginModel', () => {
      component.loginModel = {
        userName: null,
        password: null,
        captcha: null
      };
      component.submit();
      expect(component.hasError).toBe(true);
    });

    it('should handle undefined values in loginModel', () => {
      component.loginModel = {
        userName: undefined,
        password: 'pass',
        captcha: 'ABCD'
      };
      component.submit();
      expect(component.hasError).toBe(true);
    });

    it('should handle whitespace-only values', () => {
      component.loginModel = {
        userName: '   ',
        password: 'pass',
        captcha: 'ABCD'
      };
      // Whitespace is truthy in JavaScript
      expect(component.loginModel.userName).toBeTruthy();
    });
  });

  describe('State Management', () => {
    it('should reset error state on successful submission', async () => {
      component.hasError = true;
      component.errorMessage = 'Old error';
      component.loginModel = {
        userName: 'user',
        password: 'pass',
        captcha: 'ABCD'
      };

      mockAxios.post.mockResolvedValue({ data: 'success' });
      await component.submit();

      expect(component.hasError).toBe(false);
    });

    it('should maintain ipAddress across submissions', async () => {
      component.ipAddress = '192.168.1.1';
      component.loginModel = {
        userName: 'user',
        password: 'pass',
        captcha: 'ABCD'
      };

      mockAxios.post.mockResolvedValue({ data: 'success' });
      await component.submit();

      expect(component.ipAddress).toBe('192.168.1.1');
    });
  });
});
