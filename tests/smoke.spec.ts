import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Onebookx - Smoke Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await page.goto('https://staging.onebookx.com', { timeout: 30000 });
    await page.waitForTimeout(2000);
  });

  // ============================================
  // 1. PAGE LOAD TESTS
  // ============================================
  test.describe('Page Load Tests', () => {
    test('should load the home page successfully', async ({ page }) => {
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL('https://staging.onebookx.com/', { timeout: 30000 });
      await expect(homePage.brand).toBeVisible();
    });

    test('should have correct brand name', async ({ page }) => {
      await page.waitForTimeout(500);
      const brandName = await homePage.getBrandName();
      expect(brandName).toBe('onebookx');
    });

    test('should have all main sections visible', async () => {
      await expect(homePage.heroSection).toBeVisible();
      await expect(homePage.stepsSection).toBeVisible();
      await expect(homePage.featuresSection).toBeVisible();
      await expect(homePage.ctaBottom).toBeVisible();
    });
  });

  // ============================================
  // 2. HERO SECTION TESTS
  // ============================================
  test.describe('Hero Section Tests', () => {
    test('should display hero badge with correct text', async () => {
      const badgeText = await homePage.getBadgeText();
      expect(badgeText).toBe('Egyszerű. Gyors. Automatikus.');
    });

    test('should display hero title with correct content', async () => {
      const titleText = await homePage.getHeroTitleText();
      expect(titleText).toContain('Saját foglalási oldal');
      expect(titleText).toContain('a vállalkozásodnak');
    });

    test('should display hero subtitle with correct content', async () => {
      const subtitleText = await homePage.getHeroSubtitleText();
      expect(subtitleText).toContain('Időpontfoglalás');
      expect(subtitleText).toContain('NAV számla');
    });

    test('should have CTA buttons visible', async () => {
      await expect(homePage.ctaButton).toBeVisible();
      await expect(homePage.loginButton).toBeVisible();
    });

    test('should have CTA button with rocket icon', async () => {
      await expect(homePage.ctaButtonIcon).toBeVisible();
      const iconText = await homePage.ctaButtonIcon.textContent();
      expect(iconText).toBe('rocket_launch');
    });

    test('should have correct CTA button text', async () => {
      const buttonText = await homePage.ctaButton.textContent();
      expect(buttonText).toContain('Ingyenes regisztráció');
    });

    test('should have correct login button text', async () => {
      const buttonText = await homePage.loginButton.textContent();
      expect(buttonText).toContain('Bejelentkezés');
    });
  });

  // ============================================
  // 3. NAVIGATION TESTS
  // ============================================
  test.describe('Navigation Tests', () => {
    test('should have navigation buttons visible', async () => {
      await expect(homePage.navHome).toBeVisible();
      await expect(homePage.navLogin).toBeVisible();
      await expect(homePage.navSignup).toBeVisible();
    });

    test('should navigate to login page', async ({ page }) => {
      await homePage.clickNavLogin();
      await expect(page).toHaveURL(/.*login/);
    });

    test('should navigate to signup page', async ({ page }) => {
      await homePage.clickNavSignup();
      await expect(page).toHaveURL(/.*signup/);
    });

    test('should navigate from login to home', async ({ page }) => {
      await homePage.clickNavLogin();
      await page.waitForURL(/.*login/);
      await homePage.clickNavHome();
      await expect(page).toHaveURL('/');
    });

    test('should navigate from login to signup', async ({ page }) => {
      await homePage.clickNavLogin();
      await page.waitForURL(/.*login/);
      await homePage.clickNavSignup();
      await expect(page).toHaveURL(/.*signup/);
    });

    test('should navigate back to home from signup', async ({ page }) => {
      await homePage.clickNavSignup();
      await page.waitForURL(/.*signup/);
      await homePage.clickNavHome();
      await expect(page).toHaveURL('/');
    });
  });

  // ============================================
  // 4. STEPS SECTION TESTS
  // ============================================
  test.describe('Steps Section Tests', () => {
    test('should display steps section with correct title', async () => {
      const title = await homePage.stepsTitle.textContent();
      expect(title).toBe('Hogyan működik?');
    });

    test('should display 4 steps', async () => {
      const stepCount = await homePage.getStepCount();
      expect(stepCount).toBe(4);
    });

    test('should have correct step numbers and titles', async () => {
      const expectedSteps = [
        { number: '1', title: 'Regisztrálj' },
        { number: '2', title: 'Állítsd be' },
        { number: '3', title: 'Oszd meg' },
        { number: '4', title: 'Kész' },
      ];

      for (let i = 0; i < expectedSteps.length; i++) {
        const stepNum = await homePage.getStepNumber(i);
        const stepTitle = await homePage.getStepTitle(i);
        expect(stepNum).toBe(expectedSteps[i].number);
        expect(stepTitle).toBe(expectedSteps[i].title);
      }
    });

    test('should have step descriptions for each step', async () => {
      const stepCount = await homePage.getStepCount();
      for (let i = 0; i < stepCount; i++) {
        const description = await homePage.getStepDescription(i);
        expect(description).toBeTruthy();
        expect(description.length).toBeGreaterThan(10);
      }
    });
  });

  // ============================================
  // 5. FEATURES SECTION TESTS
  // ============================================
  test.describe('Features Section Tests', () => {
    test('should display 5 feature cards', async () => {
      const featureCount = await homePage.getFeatureCount();
      expect(featureCount).toBe(5);
    });

    test('should have correct feature titles', async () => {
      const expectedFeatures = [
        'Saját oldal',
        'Időpontfoglalás',
        'Árlista',
        'Online fizetés',
        'NAV számla'
      ];

      for (let i = 0; i < expectedFeatures.length; i++) {
        const title = await homePage.getFeatureTitle(i);
        expect(title).toBe(expectedFeatures[i]);
      }
    });

    test('should have feature descriptions', async () => {
      const featureCount = await homePage.getFeatureCount();
      for (let i = 0; i < featureCount; i++) {
        const description = await homePage.getFeatureDescription(i);
        expect(description).toBeTruthy();
        expect(description.length).toBeGreaterThan(20);
      }
    });

    test('should have feature icons', async () => {
      const expectedIcons = ['store', 'calendar_month', 'format_list_bulleted', 'credit_card', 'receipt_long'];
      const featureCount = await homePage.getFeatureCount();

      for (let i = 0; i < featureCount; i++) {
        const icon = await homePage.getFeatureIcon(i);
        expect(icon).toBe(expectedIcons[i]);
      }
    });
  });

  // ============================================
  // 6. BOTTOM CTA TESTS
  // ============================================
  test.describe('Bottom CTA Tests', () => {
    test('should display bottom CTA section', async () => {
      await expect(homePage.ctaBottom).toBeVisible();
    });

    test('should have correct bottom CTA title', async () => {
      const title = await homePage.getBottomCTATitle();
      expect(title).toBe('Készen állsz?');
    });

    test('should have correct bottom CTA subtitle', async () => {
      const subtitle = await homePage.getBottomCTASubtitle();
      expect(subtitle).toContain('Regisztrálj ingyen');
      expect(subtitle).toContain('percek alatt');
    });

    test('should have visible bottom CTA button', async () => {
      await expect(homePage.ctaBottomButton).toBeVisible();
    });

    test('should have correct bottom CTA button text', async () => {
      const buttonText = await homePage.ctaBottomButton.textContent();
      expect(buttonText).toContain('Kezdjük el');
    });
  });

  // ============================================
  // 7. INTERACTIVE TESTS
  // ============================================
  test.describe('Interactive Tests', () => {
    test('should navigate to signup when clicking CTA', async ({ page }) => {
      await homePage.clickGetStarted();
      await expect(page).toHaveURL(/.*signup/);
    });

    test('should navigate to login when clicking login button', async ({ page }) => {
      await homePage.clickLogin();
      await expect(page).toHaveURL(/.*login/);
    });

    test('should navigate to signup when clicking bottom CTA', async ({ page }) => {
      await homePage.clickBottomCTA();
      await expect(page).toHaveURL(/.*signup/);
    });
  });

  // ============================================
  // 8. DARK MODE TESTS
  // ============================================
  test.describe('Dark Mode Tests', () => {
    test.beforeEach(async () => {
      await homePage.ensureLightMode();
    });

    test('should have dark mode toggle visible', async () => {
      await expect(homePage.darkModeToggle).toBeVisible();
    });

    test('should start in light mode', async () => {
      const initialTheme = await homePage.getCurrentTheme();
      expect(initialTheme).toBe('light');
      
      const initialIcon = await homePage.getDarkModeIconText();
      expect(initialIcon).toBe('dark_mode');
    });

    test('should toggle from light to dark mode', async () => {
      const beforeTheme = await homePage.getCurrentTheme();
      expect(beforeTheme).toBe('light');
      
      await homePage.toggleDarkMode();
      await homePage.wait(500);
      
      const afterTheme = await homePage.getCurrentTheme();
      expect(afterTheme).toBe('dark');
      
      const afterIcon = await homePage.getDarkModeIconText();
      expect(afterIcon).toBe('light_mode');
    });

    test('should toggle from dark to light mode', async () => {
      await homePage.toggleDarkMode();
      await homePage.wait(500);
      
      const beforeTheme = await homePage.getCurrentTheme();
      expect(beforeTheme).toBe('dark');
      
      await homePage.toggleDarkMode();
      await homePage.wait(500);
      
      const afterTheme = await homePage.getCurrentTheme();
      expect(afterTheme).toBe('light');
      
      const afterIcon = await homePage.getDarkModeIconText();
      expect(afterIcon).toBe('dark_mode');
    });

    test('should maintain correct theme state', async () => {
      await homePage.ensureLightMode();
      
      await homePage.toggleDarkMode();
      await homePage.wait(300);
      
      let isDark = await homePage.isDarkModeEnabled();
      expect(isDark).toBe(true);
      
      await homePage.toggleDarkMode();
      await homePage.wait(300);
      
      isDark = await homePage.isDarkModeEnabled();
      expect(isDark).toBe(false);
    });
  });

  // ============================================
  // 9. MOBILE RESPONSIVE TESTS
  // ============================================
  test.describe('Mobile Responsive Tests', () => {
    test('should display mobile menu on smaller screens', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('https://staging.onebookx.com');
      await page.waitForTimeout(1000);
      await expect(homePage.mobileMenuButton).toBeVisible();
    });

    test('should display desktop navigation on larger screens', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('https://staging.onebookx.com');
      await page.waitForTimeout(1000);
      await expect(homePage.desktopNav).toBeVisible();
    });
  });
});