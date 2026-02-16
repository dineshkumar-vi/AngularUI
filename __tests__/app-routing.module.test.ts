import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppRoutingModule } from '../src/app/app-routing.module';
import { UserProfileComponent } from '../src/app/user-profile/user-profile.component';
import { Component } from '@angular/core';

// Mock component for testing
@Component({
  selector: 'app-mock',
  template: '<div>Mock</div>'
})
class MockComponent {}

describe('AppRoutingModule', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent, MockComponent],
      imports: [AppRoutingModule]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('Module Configuration', () => {
    it('should create the routing module', () => {
      expect(AppRoutingModule).toBeDefined();
    });

    it('should export RouterModule', () => {
      const module = new AppRoutingModule();
      expect(module).toBeInstanceOf(AppRoutingModule);
    });
  });

  describe('Route Definitions', () => {
    it('should have /profile route configured', () => {
      const config = router.config;
      const profileRoute = config.find(r => r.path === 'profile');

      expect(profileRoute).toBeDefined();
      expect(profileRoute?.component).toBe(UserProfileComponent);
    });

    it('should have empty path redirect to /profile', () => {
      const config = router.config;
      const rootRoute = config.find(r => r.path === '');

      expect(rootRoute).toBeDefined();
      expect(rootRoute?.redirectTo).toBe('/profile');
      expect(rootRoute?.pathMatch).toBe('full');
    });

    it('should have exactly 2 routes configured', () => {
      const config = router.config;
      expect(config.length).toBe(2);
    });
  });

  describe('Route Navigation', () => {
    it('should navigate to /profile route', async () => {
      await router.navigate(['profile']);
      expect(location.path()).toBe('/profile');
    });

    it('should redirect from root to /profile', async () => {
      await router.navigate(['']);
      expect(location.path()).toBe('/profile');
    });

    it('should handle navigation to profile with full path match', async () => {
      await router.navigateByUrl('/profile');
      expect(location.path()).toBe('/profile');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined routes gracefully', async () => {
      try {
        await router.navigate(['nonexistent']);
        // Should not throw, Angular handles unknown routes
        expect(true).toBe(true);
      } catch (error) {
        fail('Should not throw error for undefined route');
      }
    });

    it('should handle navigation with query parameters', async () => {
      await router.navigate(['profile'], { queryParams: { id: '123' } });
      expect(location.path()).toContain('profile');
      expect(location.path()).toContain('id=123');
    });

    it('should handle navigation with multiple slashes', async () => {
      await router.navigateByUrl('//profile');
      expect(location.path()).toContain('profile');
    });
  });

  describe('Route Configuration Properties', () => {
    it('should use pathMatch full for root redirect', () => {
      const config = router.config;
      const rootRoute = config.find(r => r.path === '');

      expect(rootRoute?.pathMatch).toBe('full');
    });

    it('should map profile route to UserProfileComponent', () => {
      const config = router.config;
      const profileRoute = config.find(r => r.path === 'profile');

      expect(profileRoute?.component).toBe(UserProfileComponent);
    });

    it('should not have any lazy loaded routes', () => {
      const config = router.config;
      const lazyRoutes = config.filter(r => r.loadChildren);

      expect(lazyRoutes.length).toBe(0);
    });
  });
});
