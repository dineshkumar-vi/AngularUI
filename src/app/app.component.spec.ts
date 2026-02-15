import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

// Mock axios module
const mockAxios = {
  get: jest.fn(),
  post: jest.fn()
};

jest.mock('axios', () => mockAxios);

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with null captcha', () => {
      expect(component.captcha).toBeNull();
    });

    it('should initialize loginModel as empty object', () => {
      expect(component.loginModel).toEqual({});
    });

    it('should initialize hasError as false', () => {
      expect(component.hasError).toBe(false);
    });
  });

  describe('ngOnInit', () => {
    it('should call getCaptcha on initialization', () => {
      const getCaptchaSpy = jest.spyOn(component, 'getCaptcha').mockImplementation(() => {});
      component.ngOnInit();
      expect(getCaptchaSpy).toHaveBeenCalled();
    });
  });

  describe('getCaptcha', () => {
    it('should fetch IP address and captcha successfully', fakeAsync(() => {
      const mockIpResponse = {
        data: 'callback({"ip":"192.168.1.1"});'
      };
      const mockCaptchaResponse = {
        data: { captcha: 'ABC123' }
      };

      mockAxios.get.mockResolvedValue(mockIpResponse);
      mockAxios.post.mockResolvedValue(mockCaptchaResponse);

      component.getCaptcha();
      tick();

      expect(mockAxios.get).toHaveBeenCalledWith('http://api.ipify.org/?format=jsonp');
      expect(component.ipAddress).toBe('192.168.1.1');
      expect(component.captcha).toBe('ABC123');
    }));

    it('should handle errors gracefully', fakeAsync(() => {
      mockAxios.get.mockRejectedValue(new Error('Network error'));

      component.getCaptcha();
      tick();

      expect(mockAxios.get).toHaveBeenCalled();
    }));
  });

  describe('refreshCaptcha', () => {
    it('should call getCaptcha when refreshCaptcha is invoked', () => {
      const getCaptchaSpy = jest.spyOn(component, 'getCaptcha').mockImplementation(() => {});
      component.refreshCaptcha();
      expect(getCaptchaSpy).toHaveBeenCalled();
    });
  });

  describe('submit - Validation', () => {
    it('should show error when username is missing', () => {
      component.loginModel = { password: 'pass123', captcha: 'ABC' };
      component.submit();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Please enter valid username');
      expect(component.successMessage).toBeNull();
    });

    it('should show error when password is missing', () => {
      component.loginModel = { userName: 'user1', captcha: 'ABC' };
      component.submit();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Please enter valid password');
      expect(component.successMessage).toBeNull();
    });

    it('should show error when captcha is missing', () => {
      component.loginModel = { userName: 'user1', password: 'pass123' };
      component.submit();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Please enter valid captcha');
      expect(component.successMessage).toBeNull();
    });
  });

  describe('submit - Successful Login', () => {
    it('should successfully login with valid credentials', fakeAsync(() => {
      component.loginModel = {
        userName: 'testuser',
        password: 'testpass',
        captcha: 'ABC123'
      };
      component.ipAddress = '192.168.1.1';

      const mockResponse = { data: 'Success' };
      mockAxios.post.mockResolvedValue(mockResponse);

      component.submit();
      tick();

      expect(mockAxios.post).toHaveBeenCalledWith('http://localhost:8080/login', {
        userName: 'testuser',
        password: 'testpass',
        captcha: 'ABC123',
        ipAddress: '192.168.1.1'
      });
      expect(component.hasError).toBe(false);
      expect(component.successMessage).toBe('User validated successfully!');
    }));
  });

  describe('submit - Failed Login', () => {
    it('should handle login error with response data', fakeAsync(() => {
      component.loginModel = {
        userName: 'testuser',
        password: 'wrongpass',
        captcha: 'ABC123'
      };
      component.ipAddress = '192.168.1.1';

      const mockError = {
        response: {
          data: 'Invalid credentials'
        }
      };
      mockAxios.post.mockRejectedValue(mockError);

      component.submit();
      tick();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Invalid credentials');
      expect(component.successMessage).toBeNull();
    }));

    it('should handle network errors', fakeAsync(() => {
      component.loginModel = {
        userName: 'testuser',
        password: 'testpass',
        captcha: 'ABC123'
      };
      component.ipAddress = '192.168.1.1';

      const mockError = {
        message: 'Network Error'
      };
      mockAxios.post.mockRejectedValue(mockError);

      component.submit();
      tick();

      expect(component.hasError).toBe(true);
      expect(component.errorMessage).toBe('Network Error');
    }));
  });
});
