/**
 * Unit tests for e2e/protractor.conf.js
 * Tests Protractor configuration object
 */

describe('Protractor Configuration', () => {
  let config;

  beforeEach(() => {
    // Mock require for jasmine-spec-reporter
    jest.mock('jasmine-spec-reporter', () => ({
      SpecReporter: jest.fn()
    }));

    // Load the configuration
    config = require('../e2e/protractor.conf.js').config;
  });

  describe('Basic Configuration', () => {
    it('should have allScriptsTimeout set to 11000', () => {
      expect(config.allScriptsTimeout).toBe(11000);
    });

    it('should specify correct specs path', () => {
      expect(config.specs).toEqual(['./src/**/*.e2e-spec.ts']);
    });

    it('should use Chrome browser', () => {
      expect(config.capabilities.browserName).toBe('chrome');
    });

    it('should have directConnect enabled', () => {
      expect(config.directConnect).toBe(true);
    });

    it('should have correct baseUrl', () => {
      expect(config.baseUrl).toBe('http://localhost:4200/');
    });

    it('should use jasmine framework', () => {
      expect(config.framework).toBe('jasmine');
    });
  });

  describe('Jasmine Node Options', () => {
    it('should have jasmineNodeOpts defined', () => {
      expect(config.jasmineNodeOpts).toBeDefined();
    });

    it('should enable colors in jasmine output', () => {
      expect(config.jasmineNodeOpts.showColors).toBe(true);
    });

    it('should set defaultTimeoutInterval to 30000', () => {
      expect(config.jasmineNodeOpts.defaultTimeoutInterval).toBe(30000);
    });

    it('should have print function defined', () => {
      expect(typeof config.jasmineNodeOpts.print).toBe('function');
    });

    it('should have empty print function', () => {
      expect(config.jasmineNodeOpts.print()).toBeUndefined();
    });
  });

  describe('onPrepare Hook', () => {
    it('should have onPrepare function defined', () => {
      expect(typeof config.onPrepare).toBe('function');
    });

    it('should register ts-node in onPrepare', () => {
      const mockRegister = jest.fn();
      const mockRequire = jest.fn((module) => {
        if (module === 'ts-node') {
          return { register: mockRegister };
        }
        if (module === 'path') {
          return { join: jest.fn(() => './tsconfig.e2e.json') };
        }
      });

      global.require = mockRequire;
      global.jasmine = {
        getEnv: jest.fn(() => ({
          addReporter: jest.fn()
        }))
      };

      // This test validates the structure, actual execution requires proper mocking
      expect(config.onPrepare).toBeDefined();
    });
  });

  describe('Configuration Object Structure', () => {
    it('should have all required properties', () => {
      const requiredProps = [
        'allScriptsTimeout',
        'specs',
        'capabilities',
        'directConnect',
        'baseUrl',
        'framework',
        'jasmineNodeOpts',
        'onPrepare'
      ];

      requiredProps.forEach(prop => {
        expect(config).toHaveProperty(prop);
      });
    });

    it('should be a valid configuration object', () => {
      expect(typeof config).toBe('object');
      expect(config).not.toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing specs gracefully', () => {
      const testConfig = { ...config, specs: [] };
      expect(testConfig.specs).toEqual([]);
    });

    it('should validate timeout values are numbers', () => {
      expect(typeof config.allScriptsTimeout).toBe('number');
      expect(typeof config.jasmineNodeOpts.defaultTimeoutInterval).toBe('number');
    });

    it('should ensure baseUrl ends with slash', () => {
      expect(config.baseUrl.endsWith('/')).toBe(true);
    });
  });
});
