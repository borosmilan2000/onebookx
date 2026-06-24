import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Email step
  readonly emailInput: Locator;
  readonly emailLabel: Locator;
  readonly sendCodeButton: Locator;
  readonly sendCodeButtonIcon: Locator;
  
  // Verification code step
  readonly codeInput: Locator;
  readonly codeInputLabel: Locator;
  readonly verifyButton: Locator;
  readonly resendCodeLink: Locator;
  readonly backToEmailLink: Locator;
  
  // Error messages
  readonly errorMessage: Locator;
  readonly errorContainer: Locator;
  readonly fieldErrors: Locator;
  
  // Success messages
  readonly successMessage: Locator;
  
  // Loading states
  readonly loadingSpinner: Locator;
  readonly submitButtonDisabled: Locator;
  
  // Form container
  readonly loginForm: Locator;
  readonly loginContainer: Locator;
  
  // Cloudflare Access specific
  readonly cfAccessFrame: Locator;
  readonly cfAccessContainer: Locator;

  constructor(page: Page) {
    super(page);
    
    // Form Container
    this.loginContainer = page.locator('.login-container, .auth-container, .access-container');
    this.loginForm = page.locator('form').first();
    
    // Email step - using more robust selectors
    this.emailInput = page.locator('#email, input[name="email"], input[type="email"]').first();
    this.emailLabel = page.locator('label[for="email"], label:has-text("Email"), label:has-text("E-mail")').first();
    this.sendCodeButton = page.locator(
      'button[type="submit"]:has-text("Send"), ' +
      'button:has-text("Send login code"), ' +
      'button:has-text("Get code"), ' +
      'button:has-text("Continue")'
    ).first();
    this.sendCodeButtonIcon = this.sendCodeButton.locator('mat-icon, svg');
    
    // Verification code step
    this.codeInput = page.locator(
      'input[name="code"], ' +
      'input[inputmode="numeric"], ' +
      'input[autocomplete="one-time-code"], ' +
      'input[type="text"][maxlength="6"], ' +
      'input[placeholder*="code"], ' +
      'input[placeholder*="Code"]'
    ).first();
    this.codeInputLabel = page.locator(
      'label[for="code"], ' +
      'label:has-text("Verification code"), ' +
      'label:has-text("Code"), ' +
      'label:has-text("Authentication code")'
    ).first();
    this.verifyButton = page.locator(
      'button[type="submit"]:has-text("Verify"), ' +
      'button:has-text("Verify"), ' +
      'button:has-text("Submit"), ' +
      'button:has-text("Confirm"), ' +
      'button:has-text("Continue")'
    ).first();
    
    // Secondary actions
    this.resendCodeLink = page.locator(
      'button:has-text("Resend"), ' +
      'a:has-text("Resend"), ' +
      'button:has-text("Send again"), ' +
      'a:has-text("Send again")'
    ).first();
    this.backToEmailLink = page.locator(
      'button:has-text("Back"), ' +
      'a:has-text("Back"), ' +
      'button:has-text("Change email"), ' +
      'a:has-text("Change email")'
    ).first();
    
    // Error messages - more comprehensive
    this.errorContainer = page.locator('.error, .alert, .Message, .message, .notification');
    this.errorMessage = this.errorContainer.locator('.Message-is-error, .error-message, .alert-danger, .message-error').first();
    this.fieldErrors = page.locator('.field-error, .invalid-feedback, .error-message');
    
    // Success messages
    this.successMessage = page.locator('.success-message, .alert-success, .message-success');
    
    // Loading states
    this.loadingSpinner = page.locator('.spinner, .loading, .progress, mat-spinner');
    this.submitButtonDisabled = page.locator('button[type="submit"][disabled]');
    
    // Cloudflare Access specific
    this.cfAccessContainer = page.locator('#access-form, .auth-form, .login-form');
    this.cfAccessFrame = page.locator('iframe[src*="access"], iframe[title*="Access"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://staging.onebookx.com');
    await this.waitForLoad();
    await this.waitForLoginForm();
  }

  // Wait methods
  async waitForLoginForm(): Promise<void> {
    await this.emailInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async waitForCodeInput(): Promise<void> {
    await this.codeInput.waitFor({ state: 'visible', timeout: 10000 });
  }

  async waitForRedirect(timeout: number = 10000): Promise<void> {
    await this.page.waitForURL('https://staging.onebookx.com/', { timeout });
  }

  async waitForLoadingComplete(): Promise<void> {
    await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.submitButtonDisabled.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  // Email step methods
  async enterEmail(email: string): Promise<void> {
    console.log(`📧 Entering email: ${email}`);
    await this.emailInput.fill(email);
    await this.emailInput.blur();
  }

  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue() || '';
  }

  async clickSendCode(): Promise<void> {
    console.log('📤 Sending verification code...');
    await this.sendCodeButton.click();
    await this.waitForLoadingComplete();
  }

  async sendEmail(email: string): Promise<void> {
    await this.enterEmail(email);
    await this.clickSendCode();
    // Wait for code input to appear
    await this.waitForCodeInput();
  }

  // Verification code methods
  async enterVerificationCode(code: string): Promise<void> {
    console.log(`🔑 Entering verification code: ${code}`);
    await this.codeInput.fill(code);
    await this.codeInput.blur();
  }

  async getCodeValue(): Promise<string> {
    return await this.codeInput.inputValue() || '';
  }

  async clickVerify(): Promise<void> {
    console.log('✅ Verifying code...');
    await this.verifyButton.click();
    await this.waitForLoadingComplete();
  }

  // Complete login flow
  async loginWithCode(email: string, code: string): Promise<void> {
    await this.goto();
    await this.sendEmail(email);
    await this.enterVerificationCode(code);
    await this.clickVerify();
    await this.waitForRedirect();
    console.log('✅ Login successful!');
  }

  // Resend methods
  async clickResendCode(): Promise<void> {
    console.log('🔄 Resending verification code...');
    await this.resendCodeLink.click();
    await this.waitForLoadingComplete();
  }

  async clickBackToEmail(): Promise<void> {
    console.log('⬅️ Going back to email step...');
    await this.backToEmailLink.click();
    await this.waitForLoginForm();
  }

  // State checks
  async isEmailFieldVisible(): Promise<boolean> {
    return await this.emailInput.isVisible();
  }

  async isCodeFieldVisible(): Promise<boolean> {
    return await this.codeInput.isVisible({ timeout: 3000 });
  }

  async isSendCodeButtonVisible(): Promise<boolean> {
    return await this.sendCodeButton.isVisible();
  }

  async isVerifyButtonVisible(): Promise<boolean> {
    return await this.verifyButton.isVisible();
  }

  async isSubmitDisabled(): Promise<boolean> {
    return await this.submitButtonDisabled.isVisible({ timeout: 1000 }).catch(() => false);
  }

  async isLoading(): Promise<boolean> {
    return await this.loadingSpinner.isVisible({ timeout: 1000 }).catch(() => false);
  }

  async isResendCodeVisible(): Promise<boolean> {
    return await this.resendCodeLink.isVisible({ timeout: 1000 }).catch(() => false);
  }

  // Error handling
  async getErrorMessage(): Promise<string> {
    try {
      const error = await this.errorMessage.textContent({ timeout: 3000 });
      return error?.trim() || '';
    } catch {
      return '';
    }
  }

  async getFieldErrors(): Promise<string[]> {
    const errors: string[] = [];
    const count = await this.fieldErrors.count();
    for (let i = 0; i < count; i++) {
      const text = await this.fieldErrors.nth(i).textContent();
      if (text) errors.push(text.trim());
    }
    return errors;
  }

  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible({ timeout: 1000 }).catch(() => false);
  }

  async getSuccessMessage(): Promise<string> {
    try {
      const message = await this.successMessage.textContent({ timeout: 3000 });
      return message?.trim() || '';
    } catch {
      return '';
    }
  }

  // Smart login with retry
  async loginWithCodeWithRetry(email: string, code: string, maxAttempts: number = 2): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`🔄 Login attempt ${attempt}/${maxAttempts}`);
      
      if (attempt > 1) {
        await this.page.reload();
        await this.waitForLoginForm();
      }
      
      try {
        await this.loginWithCode(email, code);
        return; // Success
      } catch (error) {
        console.log(`❌ Attempt ${attempt} failed: ${error}`);
        if (attempt === maxAttempts) {
          throw error;
        }
        await this.wait(2000);
      }
    }
  }

  // Debug method - get current step
  async getCurrentStep(): Promise<'email' | 'code' | 'unknown'> {
    if (await this.isEmailFieldVisible()) {
      return 'email';
    }
    if (await this.isCodeFieldVisible()) {
      return 'code';
    }
    return 'unknown';
  }

  // Screenshot helper
  async takeFormScreenshot(name: string): Promise<void> {
    await this.loginContainer.screenshot({ path: `screenshots/login-${name}.png` });
  }
}