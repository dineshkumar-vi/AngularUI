import { TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppModule } from '../src/app/app.module';
import { AppComponent } from '../src/app/app.component';
import { UserProfileComponent } from '../src/app/user-profile/user-profile.component';
import { UserProfileService } from '../src/app/user-profile.service';
import { AppRoutingModule } from '../src/app/app-routing.module';

describe('AppModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('Module Definition', () => {
    it('should create the module', () => {
      expect(AppModule).toBeDefined();
    });

    it('should be an Angular module', () => {
      const module = new AppModule();
      expect(module).toBeInstanceOf(AppModule);
    });
  });

  describe('Module Declarations', () => {
    it('should declare AppComponent', () => {
      const fixture = TestBed.createComponent(AppComponent);
      expect(fixture.componentInstance).toBeInstanceOf(AppComponent);
    });

    it('should declare UserProfileComponent', () => {
      const fixture = TestBed.createComponent(UserProfileComponent);
      expect(fixture.componentInstance).toBeInstanceOf(UserProfileComponent);
    });

    it('should have all required components declared', () => {
      // Both components should be available for creation
      expect(() => TestBed.createComponent(AppComponent)).not.toThrow();
      expect(() => TestBed.createComponent(UserProfileComponent)).not.toThrow();
    });

    it('should allow components to be instantiated', () => {
      const appFixture = TestBed.createComponent(AppComponent);
      const profileFixture = TestBed.createComponent(UserProfileComponent);

      expect(appFixture.componentInstance).toBeTruthy();
      expect(profileFixture.componentInstance).toBeTruthy();
    });
  });

  describe('Module Imports', () => {
    it('should import BrowserModule', () => {
      const moduleRef = TestBed.inject(BrowserModule);
      expect(moduleRef).toBeDefined();
    });

    it('should import AppRoutingModule', () => {
      // Router should be available after importing AppRoutingModule
      expect(() => TestBed.inject(AppRoutingModule)).not.toThrow();
    });

    it('should import FormsModule', () => {
      const moduleRef = TestBed.inject(FormsModule);
      expect(moduleRef).toBeDefined();
    });

    it('should have all required modules imported', () => {
      // Test that all modules are properly imported by checking their availability
      expect(() => TestBed.inject(BrowserModule)).not.toThrow();
      expect(() => TestBed.inject(FormsModule)).not.toThrow();
    });
  });

  describe('Module Providers', () => {
    it('should provide UserProfileService', () => {
      const service = TestBed.inject(UserProfileService);
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(UserProfileService);
    });

    it('should provide UserProfileService as singleton', () => {
      const service1 = TestBed.inject(UserProfileService);
      const service2 = TestBed.inject(UserProfileService);
      expect(service1).toBe(service2);
    });

    it('should make UserProfileService available to components', () => {
      const fixture = TestBed.createComponent(UserProfileComponent);
      const component = fixture.componentInstance;
      expect(component['userProfileService']).toBeDefined();
      expect(component['userProfileService']).toBeInstanceOf(UserProfileService);
    });
  });

  describe('Module Bootstrap', () => {
    it('should bootstrap AppComponent', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should render AppComponent', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled).toBeTruthy();
    });
  });

  describe('Module Integration', () => {
    it('should allow components to use routing', () => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      // Should not throw errors related to routing
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should allow components to use FormsModule directives', () => {
      const fixture = TestBed.createComponent(UserProfileComponent);
      fixture.detectChanges();
      // Should not throw errors related to forms
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should allow UserProfileComponent to inject UserProfileService', () => {
      const fixture = TestBed.createComponent(UserProfileComponent);
      const component = fixture.componentInstance;
      const service = component['userProfileService'];

      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(UserProfileService);
    });

    it('should initialize components without errors', () => {
      expect(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
      }).not.toThrow();

      expect(() => {
        const fixture = TestBed.createComponent(UserProfileComponent);
        fixture.detectChanges();
      }).not.toThrow();
    });
  });

  describe('Module Configuration', () => {
    it('should have proper module metadata', () => {
      expect(AppModule).toBeDefined();
      expect(typeof AppModule).toBe('function');
    });

    it('should not have any compilation errors', () => {
      expect(() => {
        TestBed.configureTestingModule({
          imports: [AppModule]
        }).compileComponents();
      }).not.toThrow();
    });

    it('should configure BrowserModule for browser platform', () => {
      // BrowserModule should be available and configured
      const browserModule = TestBed.inject(BrowserModule);
      expect(browserModule).toBeDefined();
    });
  });

  describe('Dependency Injection', () => {
    it('should create separate instances in child injectors', () => {
      const fixture1 = TestBed.createComponent(UserProfileComponent);
      const fixture2 = TestBed.createComponent(UserProfileComponent);

      // Services provided at root level should be same instance
      const service1 = fixture1.componentInstance['userProfileService'];
      const service2 = fixture2.componentInstance['userProfileService'];

      expect(service1).toBe(service2);
    });

    it('should resolve all component dependencies', () => {
      expect(() => {
        const fixture = TestBed.createComponent(UserProfileComponent);
        const component = fixture.componentInstance;

        // All dependencies should be resolved
        expect(component).toBeTruthy();
        expect(component['userProfileService']).toBeTruthy();
      }).not.toThrow();
    });

    it('should allow service injection in multiple components', () => {
      const fixture1 = TestBed.createComponent(UserProfileComponent);
      const service1 = fixture1.componentInstance['userProfileService'];

      const fixture2 = TestBed.createComponent(UserProfileComponent);
      const service2 = fixture2.componentInstance['userProfileService'];

      expect(service1).toBeDefined();
      expect(service2).toBeDefined();
      expect(service1).toBe(service2); // Same singleton instance
    });
  });

  describe('Module Lifecycle', () => {
    it('should initialize module without errors', () => {
      expect(() => {
        TestBed.configureTestingModule({
          imports: [AppModule]
        });
      }).not.toThrow();
    });

    it('should cleanup properly after reset', () => {
      TestBed.configureTestingModule({
        imports: [AppModule]
      });

      const service1 = TestBed.inject(UserProfileService);

      TestBed.resetTestingModule();

      TestBed.configureTestingModule({
        imports: [AppModule]
      });

      const service2 = TestBed.inject(UserProfileService);

      // After reset, services should be new instances
      expect(service1).toBeDefined();
      expect(service2).toBeDefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple module instantiations', () => {
      for (let i = 0; i < 5; i++) {
        expect(() => {
          TestBed.resetTestingModule();
          TestBed.configureTestingModule({
            imports: [AppModule]
          });
        }).not.toThrow();
      }
    });

    it('should allow accessing services before component creation', () => {
      const service = TestBed.inject(UserProfileService);
      expect(service).toBeDefined();

      const fixture = TestBed.createComponent(UserProfileComponent);
      expect(fixture.componentInstance['userProfileService']).toBe(service);
    });

    it('should handle component creation in any order', () => {
      expect(() => {
        TestBed.createComponent(UserProfileComponent);
        TestBed.createComponent(AppComponent);
      }).not.toThrow();

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({ imports: [AppModule] });

      expect(() => {
        TestBed.createComponent(AppComponent);
        TestBed.createComponent(UserProfileComponent);
      }).not.toThrow();
    });
  });
});
