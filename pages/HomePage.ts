import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroSection: Locator;
  readonly heroBadge: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroActions: Locator;
  
  readonly ctaButton: Locator;
  readonly ctaButtonIcon: Locator;
  readonly loginButton: Locator;
  
  readonly stepsSection: Locator;
  readonly stepsTitle: Locator;
  readonly steps: Locator;
  
  readonly featuresSection: Locator;
  readonly features: Locator;
  
  readonly ctaBottom: Locator;
  readonly ctaBottomTitle: Locator;
  readonly ctaBottomSubtitle: Locator;
  readonly ctaBottomButton: Locator;
  
  readonly navHome: Locator;
  readonly navLogin: Locator;
  readonly navSignup: Locator;

  constructor(page: Page) {
    super(page);

    this.heroSection = page.locator('.hero');
    this.heroBadge = page.locator('.hero-badge');
    this.heroTitle = page.locator('.hero-title');
    this.heroSubtitle = page.locator('.hero-sub');
    this.heroActions = page.locator('.hero-actions');
    
    this.ctaButton = page.locator('.cta-btn');
    this.ctaButtonIcon = page.locator('.cta-btn mat-icon');
    this.loginButton = page.locator('.login-btn');
    
    this.stepsSection = page.locator('.steps-section');
    this.stepsTitle = page.locator('.steps-title');
    this.steps = page.locator('.step');
    
    this.featuresSection = page.locator('.features');
    this.features = page.locator('.feature-card');
    
    this.ctaBottom = page.locator('.cta-bottom');
    this.ctaBottomTitle = page.locator('.cta-bottom h2');
    this.ctaBottomSubtitle = page.locator('.cta-bottom p');
    this.ctaBottomButton = page.locator('.cta-bottom .cta-btn');
    
    this.navHome = page.locator('.nav-links button:has-text("Főoldal")');
    this.navLogin = page.locator('.nav-links button:has-text("Bejelentkezés")');
    this.navSignup = page.locator('.nav-links button:has-text("Regisztráció")');
  }

  async getBadgeText(): Promise<string> {
    return await this.heroBadge.textContent() || '';
  }

  async getHeroTitleText(): Promise<string> {
    return await this.heroTitle.textContent() || '';
  }

  async getHeroSubtitleText(): Promise<string> {
    return await this.heroSubtitle.textContent() || '';
  }

  async getStepCount(): Promise<number> {
    return await this.steps.count();
  }

  async getStepNumber(index: number): Promise<string> {
    const step = this.steps.nth(index);
    return await step.locator('.step-num').textContent() || '';
  }

  async getStepTitle(index: number): Promise<string> {
    const step = this.steps.nth(index);
    return await step.locator('.step-body h3').textContent() || '';
  }

  async getStepDescription(index: number): Promise<string> {
    const step = this.steps.nth(index);
    return await step.locator('.step-body p').textContent() || '';
  }

  async getFeatureCount(): Promise<number> {
    return await this.features.count();
  }

  async getFeatureTitle(index: number): Promise<string> {
    const feature = this.features.nth(index);
    return await feature.locator('.feature-body h3').textContent() || '';
  }

  async getFeatureDescription(index: number): Promise<string> {
    const feature = this.features.nth(index);
    return await feature.locator('.feature-body p').textContent() || '';
  }

  async getFeatureIcon(index: number): Promise<string> {
    const feature = this.features.nth(index);
    return await feature.locator('.feature-icon-wrap mat-icon').textContent() || '';
  }

  async getBottomCTATitle(): Promise<string> {
    return await this.ctaBottomTitle.textContent() || '';
  }

  async getBottomCTASubtitle(): Promise<string> {
    return await this.ctaBottomSubtitle.textContent() || '';
  }

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
}