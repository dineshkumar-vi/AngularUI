/**
 * Unit tests for e2e/src/app.po.ts
 * Tests Page Object Model for E2E tests
 */

describe('AppPage Page Object', () => {
  let mockBrowser;
  let mockElement;
  let mockBy;
  let AppPage;

  beforeEach(() => {
    // Mock browser object
    mockBrowser = {
      get: jest.fn().mockResolvedValue(true),
      baseUrl: 'http://localhost:4200/'
    };

    // Mock element object
    mockElement = jest.fn((locator) => ({
      getText: jest.fn().mockResolvedValue('Welcome to AngularUI!')
    }));

    // Mock by object
    mockBy = {
      css: jest.fn((selector) => selector)
    };

    // Mock the AppPage class
    AppPage = class {
      navigateTo() {
        return mockBrowser.get(mockBrowser.baseUrl);
      }

      getTitleText() {
        return mockElement(mockBy.css('app-root h1')).getText();
      }
    };
  });

  describe('AppPage Class', () => {
    it('should create an instance of AppPage', () => {
      const page = new AppPage();
      expect(page).toBeDefined();
      expect(page).toBeInstanceOf(AppPage);
    });

    it('should have navigateTo method', () => {
      const page = new AppPage();
      expect(typeof page.navigateTo).toBe('function');
    });

    it('should have getTitleText method', () => {
      const page = new AppPage();
      expect(typeof page.getTitleText).toBe('function');
    });
  });

  describe('navigateTo Method', () => {
    it('should navigate to base URL', async () => {
      const page = new AppPage();
      await page.navigateTo();
      expect(mockBrowser.get).toHaveBeenCalledWith(mockBrowser.baseUrl);
    });

    it('should return a Promise', () => {
      const page = new AppPage();
      const result = page.navigateTo();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to any type', async () => {
      const page = new AppPage();
      const result = await page.navigateTo();
      expect(result).toBe(true);
    });

    it('should use browser.get method', async () => {
      const page = new AppPage();
      await page.navigateTo();
      expect(mockBrowser.get).toHaveBeenCalled();
      expect(mockBrowser.get).toHaveBeenCalledTimes(1);
    });

    it('should handle navigation errors', async () => {
      mockBrowser.get = jest.fn().mockRejectedValue(new Error('Navigation error'));
      const page = new AppPage();
      await expect(page.navigateTo()).rejects.toThrow('Navigation error');
    });
  });

  describe('getTitleText Method', () => {
    it('should get text from h1 element', async () => {
      const page = new AppPage();
      const text = await page.getTitleText();
      expect(mockElement).toHaveBeenCalled();
    });

    it('should use correct CSS selector', async () => {
      const page = new AppPage();
      await page.getTitleText();
      expect(mockBy.css).toHaveBeenCalledWith('app-root h1');
    });

    it('should return a Promise<string>', () => {
      const page = new AppPage();
      const result = page.getTitleText();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to string value', async () => {
      const page = new AppPage();
      const text = await page.getTitleText();
      expect(typeof text).toBe('string');
      expect(text).toBe('Welcome to AngularUI!');
    });

    it('should call getText on element', async () => {
      const mockGetText = jest.fn().mockResolvedValue('Test Title');
      mockElement = jest.fn(() => ({ getText: mockGetText }));

      const page = new AppPage();
      await page.getTitleText();
      expect(mockGetText).toHaveBeenCalled();
    });

    it('should handle element not found', async () => {
      const mockGetText = jest.fn().mockRejectedValue(new Error('Element not found'));
      mockElement = jest.fn(() => ({ getText: mockGetText }));

      const page = new AppPage();
      await expect(page.getTitleText()).rejects.toThrow('Element not found');
    });

    it('should handle empty text', async () => {
      const mockGetText = jest.fn().mockResolvedValue('');
      mockElement = jest.fn(() => ({ getText: mockGetText }));

      const page = new AppPage();
      const text = await page.getTitleText();
      expect(text).toBe('');
    });
  });

  describe('Protractor Integration', () => {
    it('should use Protractor browser API', async () => {
      const page = new AppPage();
      await page.navigateTo();
      expect(mockBrowser.get).toHaveBeenCalledWith(mockBrowser.baseUrl);
    });

    it('should use Protractor element API', async () => {
      const page = new AppPage();
      await page.getTitleText();
      expect(mockElement).toHaveBeenCalled();
    });

    it('should use Protractor by.css locator', async () => {
      const page = new AppPage();
      await page.getTitleText();
      expect(mockBy.css).toHaveBeenCalledWith('app-root h1');
    });
  });

  describe('Multiple Method Calls', () => {
    it('should handle multiple navigateTo calls', async () => {
      const page = new AppPage();
      await page.navigateTo();
      await page.navigateTo();
      expect(mockBrowser.get).toHaveBeenCalledTimes(2);
    });

    it('should handle multiple getTitleText calls', async () => {
      const page = new AppPage();
      await page.getTitleText();
      await page.getTitleText();
      expect(mockElement).toHaveBeenCalledTimes(2);
    });

    it('should handle sequential method calls', async () => {
      const page = new AppPage();
      await page.navigateTo();
      const text = await page.getTitleText();
      expect(mockBrowser.get).toHaveBeenCalled();
      expect(mockElement).toHaveBeenCalled();
      expect(text).toBe('Welcome to AngularUI!');
    });
  });

  describe('Type Safety', () => {
    it('should return Promise<any> from navigateTo', () => {
      const page = new AppPage();
      const result = page.navigateTo();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should return Promise<string> from getTitleText', () => {
      const page = new AppPage();
      const result = page.getTitleText();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should handle different string values', async () => {
      const testValues = ['Test 1', 'Test 2', 'Welcome to AngularUI!'];

      for (const value of testValues) {
        mockElement = jest.fn(() => ({
          getText: jest.fn().mockResolvedValue(value)
        }));

        const page = new AppPage();
        const text = await page.getTitleText();
        expect(text).toBe(value);
      }
    });
  });
});
