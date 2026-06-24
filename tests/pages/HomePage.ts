import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Hero Section
  readonly heroSection: Locator;
  readonly heroBadge: Locator;
  readonly heroBadgeIcon: Locator;
  readonly heroBadgeText: Locator;
  readonly heroTitle: Locator;
  readonly heroTitleAccent: Locator;
  readonly heroSubtitle: Locator;
  readonly heroActions: Locator;
  
  // Hero Buttons
  readonly ctaButton: Locator;
  readonly ctaButtonIcon: Locator;
  readonly loginButton: Locator;
  
  // Steps Section
  readonly stepsSection: Locator;
  readonly stepsTitle: Locator;
  readonly steps: Locator;
  readonly stepArrows: Locator;
  
  // Features Section
  readonly featuresSection: Locator;
  readonly featuresTitle: Locator;
  readonly features: Locator;
  
  // Bottom CTA
  readonly ctaBottom: Locator;
  readonly ctaBottomTitle: Locator;
  readonly ctaBottomSubtitle: Locator;
  readonly ctaBottomButton: Locator;
  readonly ctaBottomButtonIcon: Locator;
  
  // Navigation - Desktop
  readonly navBar: Locator;
  readonly navHome: Locator;
  readonly navLogin: Locator;
  readonly navSignup: Locator;
  readonly brandLink: Locator;
  readonly brandIcon: Locator;
  readonly brandName: Locator;
  
  // Navigation - Mobile
  readonly mobileMenuButton: Locator;
  readonly darkModeToggle: Locator;

  constructor(page: Page) {
    super(page);

    // Hero Section - using more specific selectors with Angular attributes
    this.heroSection = page.locator('section.hero');
    this.heroBadge = this.heroSection.locator('.hero-badge');
    this.heroBadgeIcon = this.heroBadge.locator('mat-icon');
    this.heroBadgeText = this.heroBadge.locator('span').last();
    this.heroTitle = page.locator('.hero-title');
    this.heroTitleAccent = this.heroTitle.locator('.hero-accent');
    this.heroSubtitle = page.locator('.hero-sub');
    this.heroActions = page.locator('.hero-actions');
    
    // Hero Buttons - using role-based selectors for accessibility
    this.ctaButton = page.getByRole('link', { name: /Ingyenes regisztráció/ });
    this.ctaButtonIcon = this.ctaButton.locator('mat-icon');
    this.loginButton = page.getByRole('link', { name: /Bejelentkezés/ });
    
    // Steps Section
    this.stepsSection = page.locator('.steps-section');
    this.stepsTitle = page.locator('.steps-title');
    this.steps = page.locator('.step');
    this.stepArrows = page.locator('.step-arrow');
    
    // Features Section
    this.featuresSection = page.locator('.features');
    this.featuresTitle = this.featuresSection.locator('h2');
    this.features = page.locator('.feature-card');
    
    // Bottom CTA
    this.ctaBottom = page.locator('.cta-bottom');
    this.ctaBottomTitle = this.ctaBottom.locator('h2');
    this.ctaBottomSubtitle = this.ctaBottom.locator('p');
    this.ctaBottomButton = this.ctaBottom.getByRole('link', { name: /Kezdjük el/ });
    this.ctaBottomButtonIcon = this.ctaBottomButton.locator('mat-icon');
    
    // Desktop Navigation
    this.navBar = page.locator('mat-toolbar.top-bar');
    this.brandLink = this.navBar.locator('.brand');
    this.brandIcon = this.brandLink.locator('mat-icon');
    this.brandName = this.brandLink.locator('span').last();
    this.navHome = this.navBar.locator('.nav-links').getByRole('button', { name: 'Főoldal' });
    this.navLogin = this.navBar.locator('.nav-links').getByRole('button', { name: 'Bejelentkezés' });
    this.navSignup = this.navBar.locator('.nav-links').getByRole('button', { name: 'Regisztráció' });
    
    // Mobile Navigation
    this.mobileMenuButton = this.navBar.locator('.mobile-menu button[mat-icon-button]');
    this.darkModeToggle = this.navBar.locator('button[mat-icon-button]').first();
  }

  // Hero Methods
  async getBadgeText(): Promise<string> {
    return (await this.heroBadgeText.textContent())?.trim() || '';
  }

  async getBadgeIcon(): Promise<string> {
    return (await this.heroBadgeIcon.textContent())?.trim() || '';
  }

  async getHeroTitleText(): Promise<string> {
    const title = await this.heroTitle.textContent() || '';
    return title.replace(/\s+/g, ' ').trim();
  }

  async getHeroTitleAccentText(): Promise<string> {
    return (await this.heroTitleAccent.textContent())?.trim() || '';
  }

  async getHeroSubtitleText(): Promise<string> {
    return (await this.heroSubtitle.textContent())?.trim() || '';
  }

  // Step Methods
  async getStepCount(): Promise<number> {
    return await this.steps.count();
  }

  async getStepNumber(index: number): Promise<string> {
    const step = this.steps.nth(index);
    return (await step.locator('.step-num').textContent())?.trim() || '';
  }

  async getStepTitle(index: number): Promise<string> {
    const step = this.steps.nth(index);
    return (await step.locator('.step-body h3').textContent())?.trim() || '';
  }

  async getStepDescription(index: number): Promise<string> {
    const step = this.steps.nth(index);
    return (await step.locator('.step-body p').textContent())?.trim() || '';
  }

  async getStepArrowText(index: number): Promise<string> {
    // Arrows are between steps, so index 0 = arrow between step 0 and 1
    const arrow = this.stepArrows.nth(index);
    return (await arrow.textContent())?.trim() || '';
  }

  // Feature Methods
  async getFeatureCount(): Promise<number> {
    return await this.features.count();
  }

  async getFeatureTitle(index: number): Promise<string> {
    const feature = this.features.nth(index);
    return (await feature.locator('.feature-body h3').textContent())?.trim() || '';
  }

  async getFeatureDescription(index: number): Promise<string> {
    const feature = this.features.nth(index);
    return (await feature.locator('.feature-body p').textContent())?.trim() || '';
  }

  async getFeatureIcon(index: number): Promise<string> {
    const feature = this.features.nth(index);
    return (await feature.locator('.feature-icon-wrap mat-icon').textContent())?.trim() || '';
  }

  // Bottom CTA Methods
  async getBottomCTATitle(): Promise<string> {
    return (await this.ctaBottomTitle.textContent())?.trim() || '';
  }

  async getBottomCTASubtitle(): Promise<string> {
    return (await this.ctaBottomSubtitle.textContent())?.trim() || '';
  }

  // Navigation Methods
  async getBrandName(): Promise<string> {
    return (await this.brandName.textContent())?.trim() || '';
  }

  async getBrandIcon(): Promise<string> {
    return (await this.brandIcon.textContent())?.trim() || '';
  }

  async isNavHomeActive(): Promise<boolean> {
    return await this.navHome.locator('.active').isVisible();
  }

  // Click Actions
  async clickNavHome(): Promise<void> {
    await this.navHome.click();
  }

  async clickNavLogin(): Promise<void> {
    await this.navLogin.click();
  }

  async clickNavSignup(): Promise<void> {
    await this.navSignup.click();
  }

  async clickGetStarted(): Promise<void> {
    await this.ctaButton.click();
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async clickBottomCTA(): Promise<void> {
    await this.ctaBottomButton.click();
  }

  async clickMobileMenu(): Promise<void> {
    await this.mobileMenuButton.click();
  }

  async clickDarkModeToggle(): Promise<void> {
    await this.darkModeToggle.click();
  }

  // Validation Methods
  async isHeroVisible(): Promise<boolean> {
    return await this.heroSection.isVisible();
  }

  async isNavBarVisible(): Promise<boolean> {
    return await this.navBar.isVisible();
  }

  async isMobileMenuVisible(): Promise<boolean> {
    return await this.mobileMenuButton.isVisible();
  }

  async waitForPageLoad(): Promise<void> {
    await this.heroSection.waitFor({ state: 'visible' });
    await this.heroTitle.waitFor({ state: 'visible' });
  }
}