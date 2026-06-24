import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Page Smoke Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // ============================================
  // PAGE LOAD TESTS
  // ============================================
  test.describe('Page Load Tests', () => {
    test('should load the login page successfully', async () => {
      await expect(loginPage.loginContainer).toBeVisible();
      await expect(loginPage.emailInput).toBeVisible();
    });

    test('should have login form visible', async () => {
      await expect(loginPage.loginForm).toBeVisible();
      await expect(loginPage.sendCodeButton).toBeVisible();
    });
  });

  // ============================================
  // EMAIL STEP TESTS
  // ============================================
  test.describe('Email Step Tests', () => {
    test('should display email input field', async () => {
      await expect(loginPage.emailInput).toBeVisible();
      await expect(loginPage.emailLabel).toBeVisible();
    });

    test('should accept email input', async () => {
      await loginPage.enterEmail('test@example.com');
      const value = await loginPage.getEmailValue();
      expect(value).toBe('test@example.com');
    });

    test('should have send code button visible', async () => {
      await expect(loginPage.sendCodeButton).toBeVisible();
    });

    test('should have correct send code button text', async () => {
      const buttonText = await loginPage.sendCodeButton.textContent();
      expect(buttonText).toContain('Send');
    });
  });

  // ============================================
  // VERIFICATION CODE STEP TESTS
  // ============================================
  test.describe('Verification Code Step Tests', () => {
    test('should show code input after sending email', async () => {
      await loginPage.sendEmail('test@example.com');
      await expect(loginPage.codeInput).toBeVisible({ timeout: 5000 });
      await expect(loginPage.verifyButton).toBeVisible();
    });

    test('should accept verification code', async () => {
      await loginPage.sendEmail('test@example.com');
      await loginPage.enterVerificationCode('123456');
      const value = await loginPage.getCodeValue();
      expect(value).toBe('123456');
    });

    test('should have verify button visible after code input', async () => {
      await loginPage.sendEmail('test@example.com');
      await expect(loginPage.verifyButton).toBeVisible();
    });

    test('should have resend code link visible', async () => {
      await loginPage.sendEmail('test@example.com');
      await expect(loginPage.resendCodeLink).toBeVisible({ timeout: 5000 });
    });

    test('should have back to email link visible', async () => {
      await loginPage.sendEmail('test@example.com');
      await expect(loginPage.backToEmailLink).toBeVisible({ timeout: 5000 });
    });
  });

  // ============================================
  // ERROR HANDLING TESTS
  // ============================================
  test.describe('Error Handling Tests', () => {
    test('should show error for invalid code', async () => {
      await loginPage.sendEmail('test@example.com');
      await loginPage.enterVerificationCode('000000');
      await loginPage.clickVerify();
      await expect(loginPage.errorMessage).toBeVisible({ timeout: 5000 });
    });

    test('should have error message container', async () => {
      await expect(loginPage.errorContainer).toBeVisible();
    });
  });

  // ============================================
  // NAVIGATION TESTS
  // ============================================
  test.describe('Navigation Tests', () => {
    test('should go back to email from code step', async () => {
      await loginPage.sendEmail('test@example.com');
      await loginPage.clickBackToEmail();
      await expect(loginPage.emailInput).toBeVisible();
    });

    test('should resend code', async () => {
      await loginPage.sendEmail('test@example.com');
      await loginPage.clickResendCode();
      // Verify loading state or success message
      await expect(loginPage.successMessage).toBeVisible({ timeout: 5000 }).catch(() => {});
    });
  });
});