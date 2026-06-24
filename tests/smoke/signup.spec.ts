import { test, expect } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';

test.describe('Signup Page Smoke Tests', () => {
  let signupPage: SignupPage;

  test.beforeEach(async ({ page }) => {
    signupPage = new SignupPage(page);
    await signupPage.goto();
  });

  // ============================================
  // PAGE LOAD TESTS
  // ============================================
  test.describe('Page Load Tests', () => {
    test('should load the signup page successfully', async () => {
      await expect(signupPage.signupContainer).toBeVisible();
      await expect(signupPage.signupForm).toBeVisible();
    });

    test('should display signup title', async () => {
      await expect(signupPage.signupTitle).toBeVisible();
      const title = await signupPage.signupTitle.textContent();
      expect(title).toContain('Regisztráció');
    });

    test('should display all form fields', async () => {
      await expect(signupPage.nameInput).toBeVisible();
      await expect(signupPage.emailInput).toBeVisible();
      await expect(signupPage.passwordInput).toBeVisible();
      await expect(signupPage.confirmPasswordInput).toBeVisible();
    });
  });

  // ============================================
  // FORM FIELD TESTS
  // ============================================
  test.describe('Form Field Tests', () => {
    test('should accept name input', async () => {
      await signupPage.fillName('Test User');
      const value = await signupPage.getNameValue();
      expect(value).toBe('Test User');
    });

    test('should accept email input', async () => {
      await signupPage.fillEmail('test@example.com');
      const value = await signupPage.getEmailValue();
      expect(value).toBe('test@example.com');
    });

    test('should accept password input', async () => {
      await signupPage.fillPassword('Password123!');
      const value = await signupPage.getPasswordValue();
      expect(value).toBe('Password123!');
    });

    test('should accept confirm password input', async () => {
      await signupPage.fillConfirmPassword('Password123!');
      const value = await signupPage.getConfirmPasswordValue();
      expect(value).toBe('Password123!');
    });

    test('should accept business name input', async () => {
      await signupPage.fillBusinessName('Test Business');
      const value = await signupPage.getBusinessNameValue();
      expect(value).toBe('Test Business');
    });
  });

  // ============================================
  // PASSWORD TESTS
  // ============================================
  test.describe('Password Tests', () => {
    test('should show password strength indicator', async () => {
      await signupPage.fillPassword('Password123!');
      const strength = await signupPage.getPasswordStrength();
      expect(strength).toBeTruthy();
    });

    test('should toggle password visibility', async () => {
      await signupPage.fillPassword('Password123!');
      const beforeType = await signupPage.passwordInput.getAttribute('type');
      expect(beforeType).toBe('password');
      
      await signupPage.togglePasswordVisibility();
      const afterType = await signupPage.passwordInput.getAttribute('type');
      expect(afterType).toBe('text');
    });
  });

  // ============================================
  // LINKS TESTS
  // ============================================
  test.describe('Links Tests', () => {
    test('should have login link visible', async () => {
      await expect(signupPage.loginLink).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
      await signupPage.clickLoginLink();
      await expect(page).toHaveURL(/.*login/);
    });

    test('should have terms link visible', async () => {
      await expect(signupPage.termsLink).toBeVisible();
    });

    test('should have privacy link visible', async () => {
      await expect(signupPage.privacyLink).toBeVisible();
    });
  });

  // ============================================
  // VALIDATION TESTS
  // ============================================
  test.describe('Validation Tests', () => {
    test('should show validation errors for empty fields', async () => {
      await signupPage.clickSubmit();
      await expect(signupPage.errorMessage).toBeVisible({ timeout: 5000 });
    });

    test('should have field error messages', async () => {
      await signupPage.clickSubmit();
      const errors = await signupPage.getFieldErrors();
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // SUBMIT TESTS
  // ============================================
  test.describe('Submit Tests', () => {
    test('should have submit button visible', async () => {
      await expect(signupPage.submitButton).toBeVisible();
    });

    test('should have correct submit button text', async () => {
      const buttonText = await signupPage.submitButton.textContent();
      expect(buttonText).toContain('Regisztráció');
    });

    test('should show loading state on submit', async () => {
      await signupPage.fillName('Test User');
      await signupPage.fillEmail('test@example.com');
      await signupPage.fillPassword('Password123!');
      await signupPage.fillConfirmPassword('Password123!');
      await signupPage.clickSubmit();
      
      // Check for loading state
      const isLoading = await signupPage.isLoading();
      expect(isLoading).toBeTruthy();
    });
  });

  // ============================================
  // TERMS CHECKBOX TESTS
  // ============================================
  test.describe('Terms Checkbox Tests', () => {
    test('should have terms checkbox visible', async () => {
      await expect(signupPage.termsCheckbox).toBeVisible();
    });

    test('should accept terms by default', async () => {
      const isChecked = await signupPage.termsCheckbox.isChecked();
      expect(isChecked).toBe(true);
    });

    test('should uncheck terms', async () => {
      await signupPage.checkTerms(false);
      const isChecked = await signupPage.termsCheckbox.isChecked();
      expect(isChecked).toBe(false);
    });
  });
});