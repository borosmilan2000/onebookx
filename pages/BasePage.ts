import { Page, Locator } from '@playwright/test';

export class BasePage {
  protected page: Page;

  readonly appRoot: Locator;
  readonly topBar: Locator;
  readonly brand: Locator;
  readonly brandIcon: Locator;
  readonly brandName: Locator;
  readonly darkModeToggle: Locator;
  readonly darkModeIcon: Locator;
  readonly mobileMenuButton: Locator;
  readonly desktopNav: Locator;

  constructor(page: Page) {
    this.page = page;

    this.appRoot = page.locator('app-root');
    this.topBar = page.locator('app-top-bar');
    this.brand = page.locator('.brand');
    this.brandIcon = page.locator('.brand mat-icon');
    this.brandName = page.locator('.brand span');
    
    this.darkModeToggle = page.locator('app-top-bar button:has(mat-icon:has-text("light_mode")), app-top-bar button:has(mat-icon:has-text("dark_mode"))');
    this.darkModeIcon = page.locator('app-top-bar mat-icon:has-text("light_mode"), app-top-bar mat-icon:has-text("dark_mode")');
    
    this.mobileMenuButton = page.locator('.mobile-menu button');
    this.desktopNav = page.locator('.desktop-nav');
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

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
    await this.wait(500);
  }

  async getDarkModeIconText(): Promise<string> {
    try {
      const icon = this.darkModeIcon.first();
      return await icon.textContent() || '';
    } catch {
      return '';
    }
  }

  async getBrandName(): Promise<string> {
    return await this.brandName.textContent() || '';
  }
}