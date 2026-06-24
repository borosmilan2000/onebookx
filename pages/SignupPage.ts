import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
  // Signup form elements
  readonly signupContainer: Locator;
  readonly signupForm: Locator;
  readonly signupTitle: Locator;
  readonly signupSubtitle: Locator;
  
  // Form fields
  readonly nameInput: Locator;
  readonly nameLabel: Locator;
  readonly nameError: Locator;
  
  readonly emailInput: Locator;
  readonly emailLabel: Locator;
  readonly emailError: Locator;
  
  readonly passwordInput: Locator;
  readonly passwordLabel: Locator;
  readonly passwordError: Locator;
  readonly passwordToggle: Locator;
  readonly passwordStrength: Locator;
  
  readonly confirmPasswordInput: Locator;
  readonly confirmPasswordLabel: Locator;
  readonly confirmPasswordError: Locator;
  
  readonly businessNameInput: Locator;
  readonly businessNameLabel: Locator;
  readonly businessNameError: Locator;
  
  // Form actions
  readonly submitButton: Locator;
  readonly submitButtonText: Locator;
  readonly submitButtonSpinner: Locator;
  
  // Links
  readonly loginLink: Locator;
  readonly termsLink: Locator;
  readonly privacyLink: Locator;
  
  // Terms checkbox (if exists)
  readonly termsCheckbox: Locator;
  readonly termsLabel: Locator;
  
  // Messages
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly errorContainer: Locator;
  readonly fieldErrors: Locator;
  
  // Loading states
  readonly loadingIndicator: Locator;
  readonly submitButtonDisabled: Locator;

  constructor(page: Page) {
    super(page);

    // Container
    this.signupContainer = page.locator('.signup-container, .auth-container, .register-container');
    this.signupForm = page.locator('form').first();
    this.signupTitle = page.locator('h1, h2').filter({ hasText: /Regisztráció|Sign up|Create account/ }).first();
    this.signupSubtitle = page.locator('p').filter({ hasText: /Hozd létre|Create your|Start your/ }).first();

    // Name field
    this.nameInput = page.locator(
      'input[name="name"], ' +
      'input[placeholder*="Név"], ' +
      'input[placeholder*="Name"], ' +
      'input[placeholder*="Teljes név"], ' +
      'input[placeholder*="Full name"], ' +
      'input[type="text"]:has(span:has-text("Name"))'
    ).first();
    this.nameLabel = page.locator('label[for="name"], label:has-text("Név"), label:has-text("Name")').first();
    this.nameError = page.locator('.name-error, #name-error, [id*="name"][id*="error"]');

    // Email field
    this.emailInput = page.locator(
      'input[type="email"], ' +
      'input[name="email"], ' +
      'input[placeholder*="Email"], ' +
      'input[placeholder*="E-mail"]'
    ).first();
    this.emailLabel = page.locator('label[for="email"], label:has-text("Email"), label:has-text("E-mail")').first();
    this.emailError = page.locator('.email-error, #email-error, [id*="email"][id*="error"]');

    // Password field
    this.passwordInput = page.locator(
      'input[type="password"], ' +
      'input[name="password"], ' +
      'input[placeholder*="jelszó"], ' +
      'input[placeholder*="Password"]'
    ).first();
    this.passwordLabel = page.locator('label[for="password"], label:has-text("Jelszó"), label:has-text("Password")').first();
    this.passwordError = page.locator('.password-error, #password-error, [id*="password"][id*="error"]');
    this.passwordToggle = page.locator('button[aria-label*="show password"], button[aria-label*="Show password"]').first();
    this.passwordStrength = page.locator('.password-strength, .strength-meter');

    // Confirm password field
    this.confirmPasswordInput = page.locator(
      'input[placeholder*="jelszó megerősítése"], ' +
      'input[placeholder*="Confirm password"], ' +
      'input[name="confirmPassword"], ' +
      'input[name="password_confirmation"]'
    ).first();
    this.confirmPasswordLabel = page.locator(
      'label[for="confirmPassword"], ' +
      'label:has-text("Jelszó megerősítése"), ' +
      'label:has-text("Confirm password")'
    ).first();
    this.confirmPasswordError = page.locator('.confirm-password-error, #confirmPassword-error, [id*="confirm"][id*="error"]');

    // Business name field
    this.businessNameInput = page.locator(
      'input[placeholder*="vállalkozás"], ' +
      'input[placeholder*="Business"], ' +
      'input[name="business"], ' +
      'input[name="businessName"], ' +
      'input[placeholder*="Cég"]'
    ).first();
    this.businessNameLabel = page.locator(
      'label[for="business"], ' +
      'label:has-text("Vállalkozás neve"), ' +
      'label:has-text("Business name")'
    ).first();
    this.businessNameError = page.locator('.business-error, #business-error, [id*="business"][id*="error"]');

    // Submit button
    this.submitButton = page.locator(
      'button[type="submit"], ' +
      'button:has-text("Regisztráció"), ' +
      'button:has-text("Sign up"), ' +
      'button:has-text("Create account"), ' +
      'button:has-text("Fiók létrehozása")'
    ).first();
    this.submitButtonText = this.submitButton.locator('span, .mdc-button__label');
    this.submitButtonSpinner = this.submitButton.locator('mat-spinner, .spinner, .loading');

    // Links
    this.loginLink = page.locator(
      'a[href*="login"], ' +
      'a:has-text("Bejelentkezés"), ' +
      'a:has-text("Login"), ' +
      'button:has-text("Bejelentkezés")'
    ).first();
    this.termsLink = page.locator('a[href*="terms"], a:has-text("ÁSZF"), a:has-text("Terms")').first();
    this.privacyLink = page.locator('a[href*="privacy"], a:has-text("Adatvédelem"), a:has-text("Privacy")').first();

    // Terms checkbox
    this.termsCheckbox = page.locator('input[type="checkbox"][name*="terms"], input[type="checkbox"][name*="accept"]').first();
    this.termsLabel = page.locator('label[for*="terms"], label:has-text("Elfogadom"), label:has-text("I accept")').first();

    // Messages
    this.successMessage = page.locator('.success-message, .alert-success, .message-success');
    this.errorContainer = page.locator('.error, .alert, .Message, .mat-mdc-form-field-error');
    this.errorMessage = this.errorContainer.locator('.Message-is-error, .error-message, .alert-danger, .message-error').first();
    this.fieldErrors = page.locator('.field-error, .invalid-feedback, .mat-mdc-form-field-error');

    // Loading states
    this.loadingIndicator = page.locator('.spinner, .loading, .progress, mat-spinner');
    this.submitButtonDisabled = page.locator('button[type="submit"][disabled]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/signup');
    await this.waitForLoad();
    await this.waitForSignupForm();
  }

  // Wait methods
  async waitForSignupForm(): Promise<void> {
    await this.signupForm.waitFor({ state: 'visible', timeout: 10000 });
    await this.nameInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.emailInput.waitFor({ state: 'visible', timeout: 5000 });
  }

  async waitForLoadingComplete(): Promise<void> {
    await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.submitButtonDisabled.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
  }

  // Form filling methods
  async fillName(name: string): Promise<void> {
    console.log(`👤 Filling name: ${name}`);
    await this.nameInput.fill(name);
    await this.nameInput.blur();
  }

  async fillEmail(email: string): Promise<void> {
    console.log(`📧 Filling email: ${email}`);
    await this.emailInput.fill(email);
    await this.emailInput.blur();
  }

  async fillPassword(password: string): Promise<void> {
    console.log(`🔒 Filling password: ${password}`);
    await this.passwordInput.fill(password);
    await this.passwordInput.blur();
  }

  async fillConfirmPassword(password: string): Promise<void> {
    console.log(`🔒 Filling confirm password: ${password}`);
    await this.confirmPasswordInput.fill(password);
    await this.confirmPasswordInput.blur();
  }

  async fillBusinessName(businessName: string): Promise<void> {
    console.log(`🏢 Filling business name: ${businessName}`);
    await this.businessNameInput.fill(businessName);
    await this.businessNameInput.blur();
  }

  async checkTerms(checked: boolean = true): Promise<void> {
    if (await this.termsCheckbox.isVisible()) {
      const isChecked = await this.termsCheckbox.isChecked();
      if (isChecked !== checked) {
        await this.termsCheckbox.click();
      }
    }
  }

  // Submit method
  async clickSubmit(): Promise<void> {
    console.log('📤 Submitting signup form...');
    await this.submitButton.click();
    await this.waitForLoadingComplete();
  }

  // Complete signup
  async signup(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
    businessName?: string;
    acceptTerms?: boolean;
  }): Promise<void> {
    await this.fillName(data.name);
    await this.fillEmail(data.email);
    await this.fillPassword(data.password);
    
    const confirmPassword = data.confirmPassword || data.password;
    await this.fillConfirmPassword(confirmPassword);
    
    if (data.businessName) {
      await this.fillBusinessName(data.businessName);
    }
    
    if (data.acceptTerms !== false) {
      await this.checkTerms(true);
    }
    
    await this.clickSubmit();
  }

  // Validation methods
  async getNameValue(): Promise<string> {
    return await this.nameInput.inputValue() || '';
  }

  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue() || '';
  }

  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue() || '';
  }

  async getConfirmPasswordValue(): Promise<string> {
    return await this.confirmPasswordInput.inputValue() || '';
  }

  async getBusinessNameValue(): Promise<string> {
    return await this.businessNameInput.inputValue() || '';
  }

  // State checks
  async isSignupFormVisible(): Promise<boolean> {
    return await this.nameInput.isVisible() && 
           await this.emailInput.isVisible() && 
           await this.passwordInput.isVisible() && 
           await this.submitButton.isVisible();
  }

  async isSubmitDisabled(): Promise<boolean> {
    return await this.submitButtonDisabled.isVisible({ timeout: 1000 }).catch(() => false);
  }

  async isLoading(): Promise<boolean> {
    return await this.loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false);
  }

  async isPasswordVisible(): Promise<boolean> {
    const type = await this.passwordInput.getAttribute('type');
    return type === 'text';
  }

  async togglePasswordVisibility(): Promise<void> {
    if (await this.passwordToggle.isVisible()) {
      await this.passwordToggle.click();
    }
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

  async getFieldErrors(): Promise<{ field: string, message: string }[]> {
    const errors: { field: string, message: string }[] = [];
    const count = await this.fieldErrors.count();
    
    for (let i = 0; i < count; i++) {
      const error = this.fieldErrors.nth(i);
      const message = await error.textContent();
      if (message && message.trim()) {
        // Try to determine which field the error belongs to
        const parent = error.locator('..');
        const input = parent.locator('input, textarea');
        const field = await input.getAttribute('name') || await input.getAttribute('id') || `field-${i}`;
        errors.push({ field, message: message.trim() });
      }
    }
    return errors;
  }

  async hasError(): Promise<boolean> {
    return await this.errorMessage.isVisible({ timeout: 1000 }).catch(() => false);
  }

  async getPasswordStrength(): Promise<string> {
    try {
      return await this.passwordStrength.textContent() || '';
    } catch {
      return '';
    }
  }

  // Navigation
  async clickLoginLink(): Promise<void> {
    console.log('🔗 Clicking login link...');
    await this.loginLink.click();
  }

  async clickTermsLink(): Promise<void> {
    await this.termsLink.click();
  }

  async clickPrivacyLink(): Promise<void> {
    await this.privacyLink.click();
  }

  // Debug methods
  async getCurrentFormState(): Promise<{ visible: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    if (await this.hasError()) {
      errors.push(await this.getErrorMessage());
    }
    
    const fieldErrors = await this.getFieldErrors();
    fieldErrors.forEach(e => errors.push(`${e.field}: ${e.message}`));
    
    return {
      visible: await this.isSignupFormVisible(),
      errors
    };
  }

  async takeFormScreenshot(name: string): Promise<void> {
    await this.signupContainer.screenshot({ path: `screenshots/signup-${name}.png` });
  }

  // Smart signup with retry
  async signupWithRetry(data: any, maxAttempts: number = 2): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`🔄 Signup attempt ${attempt}/${maxAttempts}`);
      
      if (attempt > 1) {
        await this.page.reload();
        await this.waitForSignupForm();
      }
      
      try {
        await this.signup(data);
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
}