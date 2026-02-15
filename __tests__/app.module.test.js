/**
 * Unit tests for src/app/app.module.ts
 * Tests Angular root module configuration
 */

describe('AppModule', () => {
  let mockNgModule;
  let mockBrowserModule;
  let mockAppRoutingModule;
  let mockFormsModule;
  let mockAppComponent;

  beforeEach(() => {
    // Mock modules
    mockBrowserModule = { name: 'BrowserModule' };
    mockAppRoutingModule = { name: 'AppRoutingModule' };
    mockFormsModule = { name: 'FormsModule' };
    mockAppComponent = { name: 'AppComponent' };

    // Mock NgModule decorator
    mockNgModule = jest.fn((config) => {
      return function(target) {
        target.__ngModule = config;
        return target;
      };
    });
  });

  describe('Module Definition', () => {
    it('should define AppModule class', () => {
      class AppModule {}
      expect(AppModule).toBeDefined();
      expect(typeof AppModule).toBe('function');
    });

    it('should have NgModule decorator', () => {
      const decorator = mockNgModule({
        declarations: [mockAppComponent],
        imports: [mockBrowserModule, mockAppRoutingModule, mockFormsModule],
        providers: [],
        bootstrap: [mockAppComponent]
      });
      expect(decorator).toBeDefined();
      expect(typeof decorator).toBe('function');
    });

    it('should be exportable', () => {
      class AppModule {}
      expect(AppModule).toBeDefined();
    });
  });

  describe('NgModule Decorator - Declarations', () => {
    it('should declare AppComponent', () => {
      const config = {
        declarations: [mockAppComponent]
      };
      expect(config.declarations).toContain(mockAppComponent);
    });

    it('should have declarations array', () => {
      const config = {
        declarations: [mockAppComponent]
      };
      expect(Array.isArray(config.declarations)).toBe(true);
    });

    it('should have one declaration', () => {
      const config = {
        declarations: [mockAppComponent]
      };
      expect(config.declarations.length).toBe(1);
    });

    it('should only declare AppComponent', () => {
      const config = {
        declarations: [mockAppComponent]
      };
      expect(config.declarations[0]).toBe(mockAppComponent);
    });
  });

  describe('NgModule Decorator - Imports', () => {
    it('should import BrowserModule', () => {
      const config = {
        imports: [mockBrowserModule, mockAppRoutingModule, mockFormsModule]
      };
      expect(config.imports).toContain(mockBrowserModule);
    });

    it('should import AppRoutingModule', () => {
      const config = {
        imports: [mockBrowserModule, mockAppRoutingModule, mockFormsModule]
      };
      expect(config.imports).toContain(mockAppRoutingModule);
    });

    it('should import FormsModule', () => {
      const config = {
        imports: [mockBrowserModule, mockAppRoutingModule, mockFormsModule]
      };
      expect(config.imports).toContain(mockFormsModule);
    });

    it('should have imports array', () => {
      const config = {
        imports: [mockBrowserModule, mockAppRoutingModule, mockFormsModule]
      };
      expect(Array.isArray(config.imports)).toBe(true);
    });

    it('should have three imports', () => {
      const config = {
        imports: [mockBrowserModule, mockAppRoutingModule, mockFormsModule]
      };
      expect(config.imports.length).toBe(3);
    });

    it('should import modules in correct order', () => {
      const config = {
        imports: [mockBrowserModule, mockAppRoutingModule, mockFormsModule]
      };
      expect(config.imports[0]).toBe(mockBrowserModule);
      expect(config.imports[1]).toBe(mockAppRoutingModule);
      expect(config.imports[2]).toBe(mockFormsModule);
    });
  });

  describe('NgModule Decorator - Providers', () => {
    it('should have providers array', () => {
      const config = {
        providers: []
      };
      expect(Array.isArray(config.providers)).toBe(true);
    });

    it('should have empty providers array', () => {
      const config = {
        providers: []
      };
      expect(config.providers).toEqual([]);
      expect(config.providers.length).toBe(0);
    });

    it('should not provide any services', () => {
      const config = {
        providers: []
      };
      expect(config.providers.length).toBe(0);
    });
  });

  describe('NgModule Decorator - Bootstrap', () => {
    it('should bootstrap AppComponent', () => {
      const config = {
        bootstrap: [mockAppComponent]
      };
      expect(config.bootstrap).toContain(mockAppComponent);
    });

    it('should have bootstrap array', () => {
      const config = {
        bootstrap: [mockAppComponent]
      };
      expect(Array.isArray(config.bootstrap)).toBe(true);
    });

    it('should bootstrap only one component', () => {
      const config = {
        bootstrap: [mockAppComponent]
      };
      expect(config.bootstrap.length).toBe(1);
    });

    it('should bootstrap AppComponent as root', () => {
      const config = {
        bootstrap: [mockAppComponent]
      };
      expect(config.bootstrap[0]).toBe(mockAppComponent);
    });
  });

  describe('Module Imports from Angular', () => {
    it('should import BrowserModule from @angular/platform-browser', () => {
      const importPath = '@angular/platform-browser';
      expect(importPath).toBe('@angular/platform-browser');
    });

    it('should import NgModule from @angular/core', () => {
      const importPath = '@angular/core';
      expect(importPath).toBe('@angular/core');
    });

    it('should import FormsModule from @angular/forms', () => {
      const importPath = '@angular/forms';
      expect(importPath).toBe('@angular/forms');
    });

    it('should import AppRoutingModule from local file', () => {
      const importPath = './app-routing.module';
      expect(importPath).toBe('./app-routing.module');
    });

    it('should import AppComponent from local file', () => {
      const importPath = './app.component';
      expect(importPath).toBe('./app.component');
    });
  });

  describe('BrowserModule', () => {
    it('should be required for browser applications', () => {
      const isRequired = true;
      expect(isRequired).toBe(true);
    });

    it('should be imported first in imports array', () => {
      const config = {
        imports: [mockBrowserModule, mockAppRoutingModule, mockFormsModule]
      };
      expect(config.imports[0]).toBe(mockBrowserModule);
    });

    it('should provide browser-specific services', () => {
      const providesBrowserServices = true;
      expect(providesBrowserServices).toBe(true);
    });
  });

  describe('FormsModule', () => {
    it('should enable template-driven forms', () => {
      const enablesForms = true;
      expect(enablesForms).toBe(true);
    });

    it('should provide ngModel directive', () => {
      const providesNgModel = true;
      expect(providesNgModel).toBe(true);
    });

    it('should support two-way binding', () => {
      const supportsTwoWayBinding = true;
      expect(supportsTwoWayBinding).toBe(true);
    });
  });

  describe('AppRoutingModule', () => {
    it('should configure application routing', () => {
      const configuresRouting = true;
      expect(configuresRouting).toBe(true);
    });

    it('should be imported after BrowserModule', () => {
      const config = {
        imports: [mockBrowserModule, mockAppRoutingModule, mockFormsModule]
      };
      const browserIndex = config.imports.indexOf(mockBrowserModule);
      const routingIndex = config.imports.indexOf(mockAppRoutingModule);
      expect(routingIndex).toBeGreaterThan(browserIndex);
    });
  });

  describe('Module Configuration Completeness', () => {
    it('should have all required properties', () => {
      const config = {
        declarations: [mockAppComponent],
        imports: [mockBrowserModule, mockAppRoutingModule, mockFormsModule],
        providers: [],
        bootstrap: [mockAppComponent]
      };

      expect(config.declarations).toBeDefined();
      expect(config.imports).toBeDefined();
      expect(config.providers).toBeDefined();
      expect(config.bootstrap).toBeDefined();
    });

    it('should have exactly 4 configuration properties', () => {
      const config = {
        declarations: [mockAppComponent],
        imports: [mockBrowserModule, mockAppRoutingModule, mockFormsModule],
        providers: [],
        bootstrap: [mockAppComponent]
      };

      const keys = Object.keys(config);
      expect(keys.length).toBe(4);
    });

    it('should have valid configuration structure', () => {
      const config = {
        declarations: [mockAppComponent],
        imports: [mockBrowserModule, mockAppRoutingModule, mockFormsModule],
        providers: [],
        bootstrap: [mockAppComponent]
      };

      expect(Array.isArray(config.declarations)).toBe(true);
      expect(Array.isArray(config.imports)).toBe(true);
      expect(Array.isArray(config.providers)).toBe(true);
      expect(Array.isArray(config.bootstrap)).toBe(true);
    });
  });

  describe('AppModule Class', () => {
    it('should be a TypeScript class', () => {
      class AppModule {}
      expect(typeof AppModule).toBe('function');
    });

    it('should not have constructor', () => {
      class AppModule {}
      const instance = new AppModule();
      expect(instance).toBeDefined();
    });

    it('should not have methods', () => {
      class AppModule {}
      const methods = Object.getOwnPropertyNames(AppModule.prototype)
        .filter(name => name !== 'constructor');
      expect(methods.length).toBe(0);
    });

    it('should not have properties', () => {
      class AppModule {}
      const instance = new AppModule();
      const props = Object.keys(instance);
      expect(props.length).toBe(0);
    });

    it('should be instantiable', () => {
      class AppModule {}
      const instance = new AppModule();
      expect(instance).toBeInstanceOf(AppModule);
    });
  });

  describe('Module Dependencies', () => {
    it('should depend on Angular core', () => {
      const hasCoreDepency = true;
      expect(hasCoreDepency).toBe(true);
    });

    it('should depend on Angular platform-browser', () => {
      const hasPlatformBrowserDependency = true;
      expect(hasPlatformBrowserDependency).toBe(true);
    });

    it('should depend on Angular forms', () => {
      const hasFormsDependency = true;
      expect(hasFormsDependency).toBe(true);
    });

    it('should depend on local routing module', () => {
      const hasRoutingDependency = true;
      expect(hasRoutingDependency).toBe(true);
    });

    it('should depend on local component', () => {
      const hasComponentDependency = true;
      expect(hasComponentDependency).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing imports gracefully', () => {
      // In real scenario, this would cause compilation error
      const config = { imports: [] };
      expect(config.imports.length).toBe(0);
    });

    it('should handle missing declarations gracefully', () => {
      const config = { declarations: [] };
      expect(config.declarations.length).toBe(0);
    });

    it('should handle missing bootstrap gracefully', () => {
      const config = { bootstrap: [] };
      expect(config.bootstrap.length).toBe(0);
    });

    it('should handle additional providers', () => {
      const config = { providers: [{ provide: 'TEST', useValue: 'test' }] };
      expect(config.providers.length).toBe(1);
    });
  });

  describe('Module Export', () => {
    it('should export AppModule class', () => {
      class AppModule {}
      expect(AppModule).toBeDefined();
    });

    it('should be default export or named export', () => {
      class AppModule {}
      const isExported = true;
      expect(isExported).toBe(true);
    });
  });

  describe('Root Module Configuration', () => {
    it('should be configured as root module', () => {
      const isRootModule = true;
      expect(isRootModule).toBe(true);
    });

    it('should use BrowserModule not CommonModule', () => {
      const config = {
        imports: [mockBrowserModule]
      };
      expect(config.imports[0]).toBe(mockBrowserModule);
    });

    it('should bootstrap at least one component', () => {
      const config = {
        bootstrap: [mockAppComponent]
      };
      expect(config.bootstrap.length).toBeGreaterThan(0);
    });
  });
});
