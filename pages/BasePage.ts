import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;

  // Root and Layout
  readonly appRoot: Locator;
  readonly topBar: Locator;
  
  // Brand
  readonly brand: Locator;
  readonly brandIcon: Locator;
  readonly brandName: Locator;
  
  // Theme Toggle
  readonly darkModeToggle: Locator;
  readonly darkModeIcon: Locator;
  
  // Navigation - Mobile
  readonly mobileMenuButton: Locator;
  readonly mobileMenu: Locator;
  
  // Navigation - Desktop
  readonly desktopNav: Locator;
  readonly navHome: Locator;
  readonly navLogin: Locator;
  readonly navSignup: Locator;
  readonly navLinks: Locator;
  
  // Stats Bar (desktop only)
  readonly statsBar: Locator;
  readonly statsAvailable: Locator;
  readonly statsBooked: Locator;
  
  // User Section (when logged in)
  readonly navUser: Locator;
  readonly userEmail: Locator;
  readonly roleToggle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Root and Layout
    this.appRoot = page.locator('app-root');
    this.topBar = page.locator('mat-toolbar.top-bar');
    
    // Brand - using more specific selectors
    this.brand = this.topBar.locator('.brand');
    this.brandIcon = this.brand.locator('mat-icon').first();
    this.brandName = this.brand.locator('span').last();
    
    // Theme Toggle - more robust selector
    this.darkModeToggle = this.topBar.locator('button[mat-icon-button]').first();
    this.darkModeIcon = this.darkModeToggle.locator('mat-icon');
    
    // Mobile Menu
    this.mobileMenuButton = this.topBar.locator('.mobile-menu button[mat-icon-button]');
    this.mobileMenu = page.locator('mat-menu');
    
    // Desktop Navigation
    this.desktopNav = this.topBar.locator('.desktop-nav');
    this.navLinks = this.desktopNav.locator('.nav-links');
    this.navHome = this.navLinks.getByRole('button', { name: 'Főoldal' });
    this.navLogin = this.navLinks.getByRole('button', { name: 'Bejelentkezés' });
    this.navSignup = this.navLinks.getByRole('button', { name: 'Regisztráció' });
    
    // Stats Bar (only visible on desktop)
    this.statsBar = this.topBar.locator('.stats-bar');
    this.statsAvailable = this.statsBar.locator('.stat.available .stat-num');
    this.statsBooked = this.statsBar.locator('.stat.booked .stat-num');
    
    // User Section (visible when logged in)
    this.navUser = this.desktopNav.locator('.nav-user');
    this.userEmail = this.navUser.locator('.user-email');
    this.roleToggle = this.navUser.locator('.role-toggle');
  }

  // Navigation Methods
  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  // Theme Methods
  async getCurrentTheme(): Promise<string> {
    const theme = await this.page.evaluate(() => {
      return document.documentElement.getAttribute('data-theme');
    });
    return theme || 'light';
  }

  async isDarkModeEnabled(): Promise<boolean> {
    const theme = await this.getCurrentTheme();
    return theme === 'dark';
  }

  async ensureLightMode(): Promise<void> {
    const currentTheme = await this.getCurrentTheme();
    if (currentTheme === 'dark') {
      await this.toggleDarkMode();
    }
  }

  async toggleDarkMode(): Promise<void> {
    await this.darkModeToggle.click();
    await this.wait(300);
  }

  async getDarkModeIconText(): Promise<string> {
    try {
      return (await this.darkModeIcon.textContent())?.trim() || '';
    } catch {
      return '';
    }
  }

  // Brand Methods
  async getBrandName(): Promise<string> {
    return (await this.brandName.textContent())?.trim() || '';
  }

  async getBrandIcon(): Promise<string> {
    return (await this.brandIcon.textContent())?.trim() || '';
  }

  // Navigation State Methods
  async isNavHomeActive(): Promise<boolean> {
    return await this.navHome.locator('.active').isVisible();
  }

  async isDesktopNavVisible(): Promise<boolean> {
    return await this.desktopNav.isVisible();
  }

  async isMobileMenuVisible(): Promise<boolean> {
    return await this.mobileMenuButton.isVisible();
  }

  async isStatsBarVisible(): Promise<boolean> {
    return await this.statsBar.isVisible();
  }

  // Navigation Click Actions
  async clickNavHome(): Promise<void> {
    await this.navHome.click();
  }

  async clickNavLogin(): Promise<void> {
    await this.navLogin.click();
  }

  async clickNavSignup(): Promise<void> {
    await this.navSignup.click();
  }

  async clickMobileMenu(): Promise<void> {
    await this.mobileMenuButton.click();
  }

  // Stats Methods
  async getAvailableCount(): Promise<string> {
    return (await this.statsAvailable.textContent())?.trim() || '';
  }

  async getBookedCount(): Promise<string> {
    return (await this.statsBooked.textContent())?.trim() || '';
  }

  // User Section Methods (for logged-in state)
  async getUserEmail(): Promise<string> {
    return (await this.userEmail.textContent())?.trim() || '';
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.navUser.isVisible();
  }

  async getRoleToggleValue(): Promise<string> {
    if (await this.roleToggle.isVisible()) {
      return await this.roleToggle.locator('mat-select').textContent() || '';
    }
    return '';
  }

  async switchRole(role: string): Promise<void> {
    if (await this.roleToggle.isVisible()) {
      await this.roleToggle.locator('mat-select').click();
      await this.page.getByRole('option', { name: role }).click();
      await this.wait(300);
    }
  }

  // Navigation Bar Methods
  async getNavLinkCount(): Promise<number> {
    return await this.navLinks.locator('button').count();
  }

  async isNavLinkVisible(linkName: string): Promise<boolean> {
    return await this.navLinks.getByRole('button', { name: linkName }).isVisible();
  }

  async getNavLinkTexts(): Promise<string[]> {
    const buttons = this.navLinks.locator('button');
    const count = await buttons.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const text = await buttons.nth(i).textContent();
      if (text) texts.push(text.trim());
    }
    return texts;
  }

  // Public Site Link (when logged in)
  async getPublicSiteLink(): Promise<Locator> {
    return this.desktopNav.locator('.public-site-link');
  }

  async clickPublicSiteLink(): Promise<void> {
    await this.desktopNav.locator('.public-site-link').click();
  }

  // Wait for specific states
  async waitForNavReady(): Promise<void> {
    await this.topBar.waitFor({ state: 'visible' });
    await this.brand.waitFor({ state: 'visible' });
  }

  async waitForLoginState(loggedIn: boolean): Promise<void> {
    if (loggedIn) {
      await this.navUser.waitFor({ state: 'visible' });
    } else {
      await this.navLogin.waitFor({ state: 'visible' });
    }
  }
}