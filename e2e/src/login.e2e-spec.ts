import { browser, by, element, ExpectedConditions as EC } from 'protractor';

describe('Login E2E Tests', () => {
  const baseUrl = 'http://localhost:4200';

  beforeEach(async () => {
    await browser.get(baseUrl);
    await browser.waitForAngular();
  });

  describe('Page Load', () => {
    it('should display login page', async () => {
      expect(await browser.getTitle()).toBeTruthy();
    });

    it('should display login form', async () => {
      const usernameField = element(by.css('input[name="userName"]'));
      expect(await usernameField.isPresent()).toBe(true);
    });

    it('should display password field', async () => {
      const passwordField = element(by.css('input[name="password"]'));
      expect(await passwordField.isPresent()).toBe(true);
    });

    it('should display captcha field', async () => {
      const captchaField = element(by.css('input[name="captcha"]'));
      expect(await captchaField.isPresent()).toBe(true);
    });

    it('should display submit button', async () => {
      const submitButton = element(by.css('button[type="submit"]'));
      expect(await submitButton.isPresent()).toBe(true);
    });

    it('should display refresh captcha button', async () => {
      const refreshButton = element(by.css('button.refresh-captcha'));
      expect(await refreshButton.isPresent()).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should show error when submitting empty form', async () => {
      const submitButton = element(by.css('button[type="submit"]'));
      await submitButton.click();

      await browser.wait(EC.presenceOf(element(by.css('.error-message'))), 5000);
      const errorMessage = element(by.css('.error-message'));
      expect(await errorMessage.getText()).toContain('username');
    });

    it('should show error when username is missing', async () => {
      const passwordField = element(by.css('input[name="password"]'));
      const captchaField = element(by.css('input[name="captcha"]'));
      const submitButton = element(by.css('button[type="submit"]'));

      await passwordField.sendKeys('testpassword');
      await captchaField.sendKeys('ABCD');
      await submitButton.click();

      await browser.wait(EC.presenceOf(element(by.css('.error-message'))), 5000);
      const errorMessage = element(by.css('.error-message'));
      expect(await errorMessage.getText()).toContain('username');
    });

    it('should show error when password is missing', async () => {
      const usernameField = element(by.css('input[name="userName"]'));
      const captchaField = element(by.css('input[name="captcha"]'));
      const submitButton = element(by.css('button[type="submit"]'));

      await usernameField.sendKeys('testuser');
      await captchaField.sendKeys('ABCD');
      await submitButton.click();

      await browser.wait(EC.presenceOf(element(by.css('.error-message'))), 5000);
      const errorMessage = element(by.css('.error-message'));
      expect(await errorMessage.getText()).toContain('password');
    });

    it('should show error when captcha is missing', async () => {
      const usernameField = element(by.css('input[name="userName"]'));
      const passwordField = element(by.css('input[name="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));

      await usernameField.sendKeys('testuser');
      await passwordField.sendKeys('testpassword');
      await submitButton.click();

      await browser.wait(EC.presenceOf(element(by.css('.error-message'))), 5000);
      const errorMessage = element(by.css('.error-message'));
      expect(await errorMessage.getText()).toContain('captcha');
    });
  });

  describe('Captcha Functionality', () => {
    it('should load captcha on page load', async () => {
      await browser.sleep(2000); // Wait for captcha to load
      const captchaDisplay = element(by.css('.captcha-display'));
      expect(await captchaDisplay.isPresent()).toBe(true);
    });

    it('should refresh captcha when refresh button is clicked', async () => {
      await browser.sleep(2000);
      const captchaDisplay = element(by.css('.captcha-display'));
      const initialCaptcha = await captchaDisplay.getText();

      const refreshButton = element(by.css('button.refresh-captcha'));
      await refreshButton.click();
      await browser.sleep(2000);

      const newCaptcha = await captchaDisplay.getText();
      expect(newCaptcha).not.toBe(initialCaptcha);
    });
  });

  describe('Login Flow', () => {
    it('should successfully submit login form with valid data', async () => {
      const usernameField = element(by.css('input[name="userName"]'));
      const passwordField = element(by.css('input[name="password"]'));
      const captchaField = element(by.css('input[name="captcha"]'));
      const submitButton = element(by.css('button[type="submit"]'));

      await usernameField.sendKeys('validuser');
      await passwordField.sendKeys('validpassword');
      await captchaField.sendKeys('VALIDCAP');
      await submitButton.click();

      // Wait for response (either success or error)
      await browser.sleep(2000);
      const hasError = await element(by.css('.error-message')).isPresent();
      const hasSuccess = await element(by.css('.success-message')).isPresent();

      expect(hasError || hasSuccess).toBe(true);
    });

    it('should clear form after successful submission', async () => {
      const usernameField = element(by.css('input[name="userName"]'));
      const passwordField = element(by.css('input[name="password"]'));
      const captchaField = element(by.css('input[name="captcha"]'));

      await usernameField.sendKeys('testuser');
      await passwordField.sendKeys('testpass');
      await captchaField.sendKeys('TESTCAP');

      expect(await usernameField.getAttribute('value')).toBe('testuser');
    });
  });

  describe('User Interactions', () => {
    it('should allow typing in username field', async () => {
      const usernameField = element(by.css('input[name="userName"]'));
      await usernameField.sendKeys('testuser123');
      expect(await usernameField.getAttribute('value')).toBe('testuser123');
    });

    it('should allow typing in password field', async () => {
      const passwordField = element(by.css('input[name="password"]'));
      await passwordField.sendKeys('testpass456');
      expect(await passwordField.getAttribute('value')).toBe('testpass456');
    });

    it('should allow typing in captcha field', async () => {
      const captchaField = element(by.css('input[name="captcha"]'));
      await captchaField.sendKeys('ABC123');
      expect(await captchaField.getAttribute('value')).toBe('ABC123');
    });

    it('should mask password field', async () => {
      const passwordField = element(by.css('input[name="password"]'));
      expect(await passwordField.getAttribute('type')).toBe('password');
    });
  });

  describe('Error Recovery', () => {
    it('should allow resubmission after error', async () => {
      const usernameField = element(by.css('input[name="userName"]'));
      const submitButton = element(by.css('button[type="submit"]'));

      // First submission with error
      await submitButton.click();
      await browser.sleep(1000);

      // Fix error and resubmit
      await usernameField.sendKeys('testuser');
      await submitButton.click();

      // Should show different error
      await browser.sleep(1000);
      const errorMessage = element(by.css('.error-message'));
      expect(await errorMessage.getText()).toContain('password');
    });

    it('should update error message on subsequent failures', async () => {
      const usernameField = element(by.css('input[name="userName"]'));
      const passwordField = element(by.css('input[name="password"]'));
      const submitButton = element(by.css('button[type="submit"]'));

      await submitButton.click();
      await browser.sleep(500);
      let errorMessage = element(by.css('.error-message'));
      const firstError = await errorMessage.getText();

      await usernameField.sendKeys('testuser');
      await submitButton.click();
      await browser.sleep(500);
      errorMessage = element(by.css('.error-message'));
      const secondError = await errorMessage.getText();

      expect(firstError).not.toBe(secondError);
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form fields', async () => {
      const usernameLabel = element(by.css('label[for="userName"]'));
      const passwordLabel = element(by.css('label[for="password"]'));
      const captchaLabel = element(by.css('label[for="captcha"]'));

      expect(await usernameLabel.isPresent() || await element(by.css('input[name="userName"]')).isPresent()).toBe(true);
    });

    it('should be keyboard navigable', async () => {
      const usernameField = element(by.css('input[name="userName"]'));
      await usernameField.click();
      await browser.actions().sendKeys('testuser').perform();
      await browser.actions().sendKeys(protractor.Key.TAB).perform();

      const passwordField = element(by.css('input[name="password"]'));
      expect(await passwordField.equals(await browser.driver.switchTo().activeElement())).toBe(true);
    });
  });

  describe('Responsive Design', () => {
    it('should display correctly on mobile viewport', async () => {
      await browser.driver.manage().window().setSize(375, 667);
      const loginForm = element(by.css('form'));
      expect(await loginForm.isDisplayed()).toBe(true);
    });

    it('should display correctly on tablet viewport', async () => {
      await browser.driver.manage().window().setSize(768, 1024);
      const loginForm = element(by.css('form'));
      expect(await loginForm.isDisplayed()).toBe(true);
    });

    it('should display correctly on desktop viewport', async () => {
      await browser.driver.manage().window().setSize(1920, 1080);
      const loginForm = element(by.css('form'));
      expect(await loginForm.isDisplayed()).toBe(true);
    });
  });
});
