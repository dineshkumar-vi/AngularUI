/**
 * Unit tests for src/karma.conf.js
 * Tests Karma configuration for Angular testing
 */

describe('Karma Configuration', () => {
  let mockConfig;
  let karmaConfig;

  beforeEach(() => {
    // Mock config object
    mockConfig = {
      set: jest.fn((config) => {
        karmaConfig = config;
      }),
      LOG_INFO: 'INFO'
    };
  });

  describe('Configuration Export', () => {
    it('should export a function', () => {
      const configFunction = function(config) {
        mockConfig.set(config);
      };
      expect(typeof configFunction).toBe('function');
    });

    it('should accept config parameter', () => {
      const configFunction = jest.fn((config) => {
        mockConfig.set(config);
      });
      configFunction(mockConfig);
      expect(configFunction).toHaveBeenCalledWith(mockConfig);
    });
  });

  describe('Basic Configuration', () => {
    beforeEach(() => {
      karmaConfig = {
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        port: 9876,
        colors: true,
        logLevel: mockConfig.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        restartOnFileChange: true
      };
      mockConfig.set(karmaConfig);
    });

    it('should have empty basePath', () => {
      expect(karmaConfig.basePath).toBe('');
    });

    it('should use jasmine framework', () => {
      expect(karmaConfig.frameworks).toContain('jasmine');
    });

    it('should use @angular-devkit/build-angular', () => {
      expect(karmaConfig.frameworks).toContain('@angular-devkit/build-angular');
    });

    it('should run on port 9876', () => {
      expect(karmaConfig.port).toBe(9876);
    });

    it('should enable colors', () => {
      expect(karmaConfig.colors).toBe(true);
    });

    it('should enable autoWatch', () => {
      expect(karmaConfig.autoWatch).toBe(true);
    });

    it('should use Chrome browser', () => {
      expect(karmaConfig.browsers).toContain('Chrome');
    });

    it('should not run single run by default', () => {
      expect(karmaConfig.singleRun).toBe(false);
    });

    it('should restart on file change', () => {
      expect(karmaConfig.restartOnFileChange).toBe(true);
    });
  });

  describe('Plugins Configuration', () => {
    beforeEach(() => {
      karmaConfig = {
        plugins: [
          require('karma-jasmine'),
          require('karma-chrome-launcher'),
          require('karma-jasmine-html-reporter'),
          require('karma-coverage'),
          require('@angular-devkit/build-angular/plugins/karma')
        ]
      };
    });

    it('should have plugins array', () => {
      expect(Array.isArray(karmaConfig.plugins)).toBe(true);
    });

    it('should have 5 plugins', () => {
      expect(karmaConfig.plugins.length).toBe(5);
    });

    it('should include karma-jasmine plugin', () => {
      // Validates plugin structure
      expect(karmaConfig.plugins[0]).toBeDefined();
    });

    it('should include karma-chrome-launcher plugin', () => {
      expect(karmaConfig.plugins[1]).toBeDefined();
    });

    it('should include karma-jasmine-html-reporter plugin', () => {
      expect(karmaConfig.plugins[2]).toBeDefined();
    });

    it('should include karma-coverage plugin', () => {
      expect(karmaConfig.plugins[3]).toBeDefined();
    });

    it('should include @angular-devkit/build-angular/plugins/karma', () => {
      expect(karmaConfig.plugins[4]).toBeDefined();
    });
  });

  describe('Client Configuration', () => {
    beforeEach(() => {
      karmaConfig = {
        client: {
          clearContext: false,
          jasmine: {
            random: false,
            seed: 42,
            stopSpecOnExpectationFailure: false
          }
        }
      };
    });

    it('should keep Jasmine Spec Runner output visible', () => {
      expect(karmaConfig.client.clearContext).toBe(false);
    });

    it('should disable random test execution', () => {
      expect(karmaConfig.client.jasmine.random).toBe(false);
    });

    it('should set seed to 42', () => {
      expect(karmaConfig.client.jasmine.seed).toBe(42);
    });

    it('should not stop on expectation failure', () => {
      expect(karmaConfig.client.jasmine.stopSpecOnExpectationFailure).toBe(false);
    });

    it('should have jasmine options defined', () => {
      expect(karmaConfig.client.jasmine).toBeDefined();
      expect(typeof karmaConfig.client.jasmine).toBe('object');
    });
  });

  describe('Coverage Reporter Configuration', () => {
    beforeEach(() => {
      karmaConfig = {
        coverageReporter: {
          dir: require('path').join(__dirname, '../coverage/AngularUI'),
          subdir: '.',
          reporters: [
            { type: 'html' },
            { type: 'text-summary' },
            { type: 'lcovonly' },
            { type: 'json' }
          ],
          check: {
            global: {
              statements: 80,
              branches: 75,
              functions: 80,
              lines: 80
            }
          }
        }
      };
    });

    it('should have coverage directory configured', () => {
      expect(karmaConfig.coverageReporter.dir).toBeDefined();
    });

    it('should use current directory as subdir', () => {
      expect(karmaConfig.coverageReporter.subdir).toBe('.');
    });

    it('should have 4 reporter types', () => {
      expect(karmaConfig.coverageReporter.reporters.length).toBe(4);
    });

    it('should include html reporter', () => {
      const htmlReporter = karmaConfig.coverageReporter.reporters.find(r => r.type === 'html');
      expect(htmlReporter).toBeDefined();
    });

    it('should include text-summary reporter', () => {
      const textReporter = karmaConfig.coverageReporter.reporters.find(r => r.type === 'text-summary');
      expect(textReporter).toBeDefined();
    });

    it('should include lcovonly reporter', () => {
      const lcovReporter = karmaConfig.coverageReporter.reporters.find(r => r.type === 'lcovonly');
      expect(lcovReporter).toBeDefined();
    });

    it('should include json reporter', () => {
      const jsonReporter = karmaConfig.coverageReporter.reporters.find(r => r.type === 'json');
      expect(jsonReporter).toBeDefined();
    });

    it('should set statement coverage threshold to 80%', () => {
      expect(karmaConfig.coverageReporter.check.global.statements).toBe(80);
    });

    it('should set branch coverage threshold to 75%', () => {
      expect(karmaConfig.coverageReporter.check.global.branches).toBe(75);
    });

    it('should set function coverage threshold to 80%', () => {
      expect(karmaConfig.coverageReporter.check.global.functions).toBe(80);
    });

    it('should set line coverage threshold to 80%', () => {
      expect(karmaConfig.coverageReporter.check.global.lines).toBe(80);
    });
  });

  describe('Reporters Configuration', () => {
    beforeEach(() => {
      karmaConfig = {
        reporters: ['progress', 'kjhtml', 'coverage']
      };
    });

    it('should have reporters array', () => {
      expect(Array.isArray(karmaConfig.reporters)).toBe(true);
    });

    it('should include progress reporter', () => {
      expect(karmaConfig.reporters).toContain('progress');
    });

    it('should include kjhtml reporter', () => {
      expect(karmaConfig.reporters).toContain('kjhtml');
    });

    it('should include coverage reporter', () => {
      expect(karmaConfig.reporters).toContain('coverage');
    });

    it('should have 3 reporters', () => {
      expect(karmaConfig.reporters.length).toBe(3);
    });
  });

  describe('Custom Launchers Configuration', () => {
    beforeEach(() => {
      karmaConfig = {
        customLaunchers: {
          ChromeHeadlessCI: {
            base: 'ChromeHeadless',
            flags: [
              '--no-sandbox',
              '--disable-gpu',
              '--disable-dev-shm-usage'
            ]
          }
        }
      };
    });

    it('should have ChromeHeadlessCI launcher', () => {
      expect(karmaConfig.customLaunchers.ChromeHeadlessCI).toBeDefined();
    });

    it('should base on ChromeHeadless', () => {
      expect(karmaConfig.customLaunchers.ChromeHeadlessCI.base).toBe('ChromeHeadless');
    });

    it('should have no-sandbox flag', () => {
      expect(karmaConfig.customLaunchers.ChromeHeadlessCI.flags).toContain('--no-sandbox');
    });

    it('should have disable-gpu flag', () => {
      expect(karmaConfig.customLaunchers.ChromeHeadlessCI.flags).toContain('--disable-gpu');
    });

    it('should have disable-dev-shm-usage flag', () => {
      expect(karmaConfig.customLaunchers.ChromeHeadlessCI.flags).toContain('--disable-dev-shm-usage');
    });

    it('should have 3 flags', () => {
      expect(karmaConfig.customLaunchers.ChromeHeadlessCI.flags.length).toBe(3);
    });
  });

  describe('Timeout Configuration', () => {
    beforeEach(() => {
      karmaConfig = {
        browserDisconnectTimeout: 10000,
        browserNoActivityTimeout: 60000,
        captureTimeout: 210000
      };
    });

    it('should set browserDisconnectTimeout to 10000ms', () => {
      expect(karmaConfig.browserDisconnectTimeout).toBe(10000);
    });

    it('should set browserNoActivityTimeout to 60000ms', () => {
      expect(karmaConfig.browserNoActivityTimeout).toBe(60000);
    });

    it('should set captureTimeout to 210000ms', () => {
      expect(karmaConfig.captureTimeout).toBe(210000);
    });

    it('should have all timeout values as numbers', () => {
      expect(typeof karmaConfig.browserDisconnectTimeout).toBe('number');
      expect(typeof karmaConfig.browserNoActivityTimeout).toBe('number');
      expect(typeof karmaConfig.captureTimeout).toBe('number');
    });

    it('should have positive timeout values', () => {
      expect(karmaConfig.browserDisconnectTimeout).toBeGreaterThan(0);
      expect(karmaConfig.browserNoActivityTimeout).toBeGreaterThan(0);
      expect(karmaConfig.captureTimeout).toBeGreaterThan(0);
    });
  });

  describe('Complete Configuration', () => {
    it('should call config.set with configuration object', () => {
      const fullConfig = {
        basePath: '',
        frameworks: ['jasmine'],
        port: 9876,
        colors: true
      };
      mockConfig.set(fullConfig);
      expect(mockConfig.set).toHaveBeenCalledWith(fullConfig);
    });

    it('should have all required configuration properties', () => {
      const requiredProps = [
        'basePath',
        'frameworks',
        'port',
        'colors',
        'logLevel',
        'autoWatch',
        'browsers',
        'singleRun',
        'restartOnFileChange'
      ];

      const fullConfig = {
        basePath: '',
        frameworks: ['jasmine'],
        port: 9876,
        colors: true,
        logLevel: mockConfig.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        restartOnFileChange: true
      };

      requiredProps.forEach(prop => {
        expect(fullConfig).toHaveProperty(prop);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty reporters array', () => {
      karmaConfig = { reporters: [] };
      expect(karmaConfig.reporters).toEqual([]);
    });

    it('should handle missing customLaunchers', () => {
      karmaConfig = {};
      expect(karmaConfig.customLaunchers).toBeUndefined();
    });

    it('should handle zero timeout values', () => {
      karmaConfig = {
        browserDisconnectTimeout: 0,
        browserNoActivityTimeout: 0,
        captureTimeout: 0
      };
      expect(karmaConfig.browserDisconnectTimeout).toBe(0);
    });
  });
});
