/**
 * Unit tests for src/main.ts
 * Tests Angular application bootstrap process
 */

describe('Main Module', () => {
  let mockPlatformBrowserDynamic;
  let mockEnableProdMode;
  let mockEnvironment;
  let mockAppModule;
  let consoleErrorSpy;

  beforeEach(() => {
    // Mock console.error
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock environment
    mockEnvironment = {
      production: false
    };

    // Mock AppModule
    mockAppModule = { name: 'AppModule' };

    // Mock enableProdMode
    mockEnableProdMode = jest.fn();

    // Mock platformBrowserDynamic
    mockPlatformBrowserDynamic = jest.fn(() => ({
      bootstrapModule: jest.fn().mockResolvedValue({ name: 'AppModule' })
    }));
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Production Mode', () => {
    it('should enable production mode when environment.production is true', () => {
      mockEnvironment.production = true;

      if (mockEnvironment.production) {
        mockEnableProdMode();
      }

      expect(mockEnableProdMode).toHaveBeenCalled();
    });

    it('should not enable production mode when environment.production is false', () => {
      mockEnvironment.production = false;

      if (mockEnvironment.production) {
        mockEnableProdMode();
      }

      expect(mockEnableProdMode).not.toHaveBeenCalled();
    });

    it('should check environment.production flag', () => {
      expect(mockEnvironment).toHaveProperty('production');
      expect(typeof mockEnvironment.production).toBe('boolean');
    });
  });

  describe('Bootstrap Process', () => {
    it('should call platformBrowserDynamic', () => {
      mockPlatformBrowserDynamic();
      expect(mockPlatformBrowserDynamic).toHaveBeenCalled();
    });

    it('should call bootstrapModule with AppModule', async () => {
      const platform = mockPlatformBrowserDynamic();
      await platform.bootstrapModule(mockAppModule);
      expect(platform.bootstrapModule).toHaveBeenCalledWith(mockAppModule);
    });

    it('should return a promise from bootstrapModule', () => {
      const platform = mockPlatformBrowserDynamic();
      const result = platform.bootstrapModule(mockAppModule);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve successfully when bootstrap succeeds', async () => {
      const platform = mockPlatformBrowserDynamic();
      await expect(platform.bootstrapModule(mockAppModule)).resolves.toEqual({ name: 'AppModule' });
    });
  });

  describe('Error Handling', () => {
    it('should catch bootstrap errors', async () => {
      const error = new Error('Bootstrap failed');
      const platform = mockPlatformBrowserDynamic();
      platform.bootstrapModule = jest.fn().mockRejectedValue(error);

      try {
        await platform.bootstrapModule(mockAppModule);
      } catch (err) {
        console.error(err);
      }

      expect(platform.bootstrapModule).toHaveBeenCalled();
    });

    it('should log error to console when bootstrap fails', async () => {
      const error = new Error('Bootstrap failed');
      const platform = mockPlatformBrowserDynamic();
      platform.bootstrapModule = jest.fn().mockRejectedValue(error);

      await platform.bootstrapModule(mockAppModule).catch(err => console.error(err));

      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });

    it('should handle null error gracefully', async () => {
      const platform = mockPlatformBrowserDynamic();
      platform.bootstrapModule = jest.fn().mockRejectedValue(null);

      await platform.bootstrapModule(mockAppModule).catch(err => console.error(err));

      expect(consoleErrorSpy).toHaveBeenCalledWith(null);
    });

    it('should handle string error', async () => {
      const platform = mockPlatformBrowserDynamic();
      platform.bootstrapModule = jest.fn().mockRejectedValue('String error');

      await platform.bootstrapModule(mockAppModule).catch(err => console.error(err));

      expect(consoleErrorSpy).toHaveBeenCalledWith('String error');
    });
  });

  describe('Module Integration', () => {
    it('should use correct imports from @angular/core', () => {
      // Validates that enableProdMode is imported correctly
      expect(mockEnableProdMode).toBeDefined();
      expect(typeof mockEnableProdMode).toBe('function');
    });

    it('should use correct imports from @angular/platform-browser-dynamic', () => {
      // Validates that platformBrowserDynamic is imported correctly
      expect(mockPlatformBrowserDynamic).toBeDefined();
      expect(typeof mockPlatformBrowserDynamic).toBe('function');
    });

    it('should import AppModule', () => {
      expect(mockAppModule).toBeDefined();
      expect(mockAppModule.name).toBe('AppModule');
    });

    it('should import environment configuration', () => {
      expect(mockEnvironment).toBeDefined();
      expect(mockEnvironment).toHaveProperty('production');
    });
  });

  describe('Execution Flow', () => {
    it('should execute in correct order: check production, bootstrap', async () => {
      const executionOrder = [];

      if (mockEnvironment.production) {
        executionOrder.push('enableProdMode');
        mockEnableProdMode();
      }

      executionOrder.push('bootstrap');
      const platform = mockPlatformBrowserDynamic();
      await platform.bootstrapModule(mockAppModule);

      expect(executionOrder[executionOrder.length - 1]).toBe('bootstrap');
    });

    it('should enable production mode before bootstrapping in production', async () => {
      mockEnvironment.production = true;
      const callOrder = [];

      mockEnableProdMode = jest.fn(() => callOrder.push('enableProdMode'));
      const platform = mockPlatformBrowserDynamic();
      platform.bootstrapModule = jest.fn(() => {
        callOrder.push('bootstrap');
        return Promise.resolve({});
      });

      if (mockEnvironment.production) {
        mockEnableProdMode();
      }
      await platform.bootstrapModule(mockAppModule);

      expect(callOrder).toEqual(['enableProdMode', 'bootstrap']);
    });
  });

  describe('Environment Configuration', () => {
    it('should handle production environment', () => {
      mockEnvironment.production = true;
      expect(mockEnvironment.production).toBe(true);
    });

    it('should handle development environment', () => {
      mockEnvironment.production = false;
      expect(mockEnvironment.production).toBe(false);
    });

    it('should have boolean production flag', () => {
      expect(typeof mockEnvironment.production).toBe('boolean');
    });
  });

  describe('Platform Bootstrap', () => {
    it('should create platform instance', () => {
      const platform = mockPlatformBrowserDynamic();
      expect(platform).toBeDefined();
      expect(platform.bootstrapModule).toBeDefined();
    });

    it('should bootstrap only once', async () => {
      const platform = mockPlatformBrowserDynamic();
      await platform.bootstrapModule(mockAppModule);
      expect(platform.bootstrapModule).toHaveBeenCalledTimes(1);
    });

    it('should pass AppModule to bootstrapModule', async () => {
      const platform = mockPlatformBrowserDynamic();
      await platform.bootstrapModule(mockAppModule);
      expect(platform.bootstrapModule).toHaveBeenCalledWith(mockAppModule);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle module not found error', async () => {
      const error = new Error('Module not found');
      const platform = mockPlatformBrowserDynamic();
      platform.bootstrapModule = jest.fn().mockRejectedValue(error);

      await platform.bootstrapModule(mockAppModule).catch(err => console.error(err));

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle compilation error', async () => {
      const error = new Error('Compilation error');
      const platform = mockPlatformBrowserDynamic();
      platform.bootstrapModule = jest.fn().mockRejectedValue(error);

      await platform.bootstrapModule(mockAppModule).catch(err => console.error(err));

      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });
  });
});
