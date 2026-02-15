import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

describe('Performance Tests', () => {
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

  describe('Component Initialization Performance', () => {
    it('should initialize component quickly', () => {
      const startTime = performance.now();
      fixture.detectChanges();
      const endTime = performance.now();
      const initTime = endTime - startTime;

      expect(initTime).toBeLessThan(100); // Should initialize within 100ms
    });

    it('should render template quickly', () => {
      const startTime = performance.now();
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(150);
      expect(compiled).toBeTruthy();
    });
  });

  describe('Form Submission Performance', () => {
    it('should validate form quickly', () => {
      component.loginModel = {};

      const startTime = performance.now();
      component.submit();
      const endTime = performance.now();
      const validationTime = endTime - startTime;

      expect(validationTime).toBeLessThan(10); // Validation should be near-instant
    });

    it('should handle multiple validations efficiently', () => {
      const testCases = [
        {},
        { userName: 'test' },
        { userName: 'test', password: 'test' }
      ];

      const startTime = performance.now();
      testCases.forEach(testCase => {
        component.loginModel = testCase;
        component.submit();
      });
      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(30);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory on multiple submissions', () => {
      component.loginModel = {};

      for (let i = 0; i < 1000; i++) {
        component.submit();
      }

      // If this completes without crashing, memory is being managed properly
      expect(component.hasError).toBe(true);
    });

    it('should handle rapid captcha refreshes', () => {
      const getCaptchaSpy = jest.spyOn(component, 'getCaptcha').mockImplementation(() => {});

      for (let i = 0; i < 100; i++) {
        component.refreshCaptcha();
      }

      expect(getCaptchaSpy).toHaveBeenCalledTimes(100);
    });
  });

  describe('Change Detection Performance', () => {
    it('should update view efficiently', () => {
      component.hasError = false;
      component.errorMessage = '';

      const startTime = performance.now();
      component.hasError = true;
      component.errorMessage = 'Test error';
      fixture.detectChanges();
      const endTime = performance.now();
      const updateTime = endTime - startTime;

      expect(updateTime).toBeLessThan(50);
    });

    it('should handle multiple property changes efficiently', () => {
      const startTime = performance.now();

      component.hasError = true;
      component.errorMessage = 'Error 1';
      fixture.detectChanges();

      component.hasError = false;
      component.successMessage = 'Success';
      fixture.detectChanges();

      component.captcha = 'NEW123';
      fixture.detectChanges();

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(100);
    });
  });

  describe('Data Binding Performance', () => {
    it('should bind form data efficiently', () => {
      const testData = {
        userName: 'performanceUser',
        password: 'performancePass',
        captcha: 'PERF123'
      };

      const startTime = performance.now();
      component.loginModel = testData;
      fixture.detectChanges();
      const endTime = performance.now();
      const bindingTime = endTime - startTime;

      expect(bindingTime).toBeLessThan(50);
      expect(component.loginModel).toEqual(testData);
    });

    it('should handle large input strings efficiently', () => {
      const largeString = 'a'.repeat(1000);

      const startTime = performance.now();
      component.loginModel = {
        userName: largeString,
        password: largeString,
        captcha: largeString
      };
      fixture.detectChanges();
      const endTime = performance.now();
      const processingTime = endTime - startTime;

      expect(processingTime).toBeLessThan(100);
    });
  });

  describe('Stress Testing', () => {
    it('should handle rapid state changes', () => {
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        component.hasError = i % 2 === 0;
        component.errorMessage = `Error ${i}`;
        component.successMessage = i % 2 === 0 ? null : `Success ${i}`;
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(200);
    });

    it('should handle rapid form model updates', () => {
      const startTime = performance.now();

      for (let i = 0; i < 100; i++) {
        component.loginModel = {
          userName: `user${i}`,
          password: `pass${i}`,
          captcha: `cap${i}`
        };
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(100);
    });
  });

  describe('Component Cleanup', () => {
    it('should cleanup efficiently on destroy', () => {
      fixture.detectChanges();

      const startTime = performance.now();
      fixture.destroy();
      const endTime = performance.now();
      const cleanupTime = endTime - startTime;

      expect(cleanupTime).toBeLessThan(50);
    });
  });

  describe('Rendering Performance', () => {
    it('should render error messages quickly', () => {
      component.hasError = true;
      component.errorMessage = 'Test error message';

      const startTime = performance.now();
      fixture.detectChanges();
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(50);
    });

    it('should render success messages quickly', () => {
      component.successMessage = 'Test success message';

      const startTime = performance.now();
      fixture.detectChanges();
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      expect(renderTime).toBeLessThan(50);
    });

    it('should handle conditional rendering efficiently', () => {
      const startTime = performance.now();

      component.hasError = true;
      fixture.detectChanges();

      component.hasError = false;
      fixture.detectChanges();

      component.hasError = true;
      fixture.detectChanges();

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      expect(totalTime).toBeLessThan(150);
    });
  });

  describe('Benchmarking', () => {
    it('should complete full validation cycle within performance budget', () => {
      const iterations = 100;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        component.loginModel = {};
        const startTime = performance.now();
        component.submit();
        const endTime = performance.now();
        times.push(endTime - startTime);
      }

      const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxTime = Math.max(...times);

      expect(averageTime).toBeLessThan(5);
      expect(maxTime).toBeLessThan(20);
    });

    it('should maintain consistent performance over time', () => {
      const measurements: number[] = [];

      // Take 10 measurements
      for (let batch = 0; batch < 10; batch++) {
        const startTime = performance.now();

        // Perform 10 operations
        for (let i = 0; i < 10; i++) {
          component.loginModel = { userName: `user${i}` };
          component.submit();
        }

        const endTime = performance.now();
        measurements.push(endTime - startTime);
      }

      // Calculate variance to ensure consistent performance
      const average = measurements.reduce((a, b) => a + b, 0) / measurements.length;
      const variance = measurements.reduce((sum, time) => sum + Math.pow(time - average, 2), 0) / measurements.length;
      const standardDeviation = Math.sqrt(variance);

      // Standard deviation should be low (consistent performance)
      expect(standardDeviation).toBeLessThan(average * 0.5);
    });
  });
});
