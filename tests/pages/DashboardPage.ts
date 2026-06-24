// tests/pages/DashboardPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // Dashboard layout
  readonly dashboardContainer: Locator;
  readonly dashboardTitle: Locator;
  
  // Stats/Metrics
  readonly statCards: Locator;
  readonly totalBookingsStat: Locator;
  readonly todayBookingsStat: Locator;
  readonly totalRevenueStat: Locator;
  readonly pendingBookingsStat: Locator;
  
  // Bookings
  readonly bookingsList: Locator;
  readonly bookingItems: Locator;
  readonly todayBookings: Locator;
  readonly upcomingBookings: Locator;
  readonly pastBookings: Locator;
  
  // Navigation
  readonly sidebar: Locator;
  readonly bookingsNav: Locator;
  readonly servicesNav: Locator;
  readonly settingsNav: Locator;
  readonly profileNav: Locator;
  
  // Actions
  readonly createBookingButton: Locator;
  readonly exportButton: Locator;
  readonly filterButton: Locator;
  
  // User menu
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  
  // Search/Filter
  readonly searchInput: Locator;
  readonly dateFilter: Locator;
  readonly statusFilter: Locator;

  constructor(page: Page) {
    super(page);

    // Dashboard layout
    this.dashboardContainer = page.locator('.dashboard-container, .dashboard, .dashboard-page');
    this.dashboardTitle = page.locator('h1, h2').filter({ hasText: /Dashboard|Vezérlőpult/ }).first();
    
    // Stats/Metrics
    this.statCards = page.locator('.stat-card, .metric-card, .dashboard-stat, .stats-card');
    this.totalBookingsStat = this.statCards.filter({ hasText: /Összes foglalás|Total bookings|Összes/ }).first();
    this.todayBookingsStat = this.statCards.filter({ hasText: /Mai foglalások|Today's bookings|Ma/ }).first();
    this.totalRevenueStat = this.statCards.filter({ hasText: /Bevétel|Revenue|Forgalom/ }).first();
    this.pendingBookingsStat = this.statCards.filter({ hasText: /Függőben|Pending|Várakozó/ }).first();
    
    // Bookings
    this.bookingsList = page.locator('.bookings-list, .booking-list, .bookings-table');
    this.bookingItems = this.bookingsList.locator('.booking-item, .booking-row, .bookings-list-item, tr.booking-row');
    this.todayBookings = page.locator('.today-bookings, .booking-item.today, .booking-today');
    this.upcomingBookings = page.locator('.upcoming-bookings, .booking-item.upcoming, .booking-upcoming');
    this.pastBookings = page.locator('.past-bookings, .booking-item.past, .booking-past');
    
    // Sidebar navigation
    this.sidebar = page.locator('.sidebar, .navigation-sidebar, .nav-sidebar, .dashboard-sidebar');
    this.bookingsNav = this.sidebar.locator('a:has-text("Foglalások"), a:has-text("Bookings"), a[href*="bookings"]').first();
    this.servicesNav = this.sidebar.locator('a:has-text("Szolgáltatások"), a:has-text("Services"), a[href*="services"]').first();
    this.settingsNav = this.sidebar.locator('a:has-text("Beállítások"), a:has-text("Settings"), a[href*="settings"]').first();
    this.profileNav = this.sidebar.locator('a:has-text("Profil"), a:has-text("Profile"), a[href*="profile"]').first();
    
    // Actions
    this.createBookingButton = page.locator('button:has-text("Új foglalás"), button:has-text("New booking"), button:has-text("+ Foglalás")').first();
    this.exportButton = page.locator('button:has-text("Export"), button:has-text("Exportálás"), button[aria-label*="export"]').first();
    this.filterButton = page.locator('button:has-text("Filter"), button:has-text("Szűrés"), button[aria-label*="filter"]').first();
    
    // User menu
    this.userMenu = page.locator('.nav-user, .user-menu, .user-profile, [aria-label*="user menu"]');
    this.logoutButton = page.locator('button:has-text("Kijelentkezés"), button:has-text("Logout"), a:has-text("Kijelentkezés")').first();
    
    // Search/Filter
    this.searchInput = page.locator('input[placeholder*="Keresés"], input[placeholder*="Search"], input[aria-label*="search"]').first();
    this.dateFilter = page.locator('input[type="date"], .date-filter, [aria-label*="date filter"]').first();
    this.statusFilter = page.locator('select[name="status"], .status-filter, [aria-label*="status filter"]').first();
  }

  async goto(url: string = '/dashboard'): Promise<void> {
    await this.page.goto(url);
    await this.waitForLoad();
    await this.waitForDashboard();
  }

  async waitForDashboard(): Promise<void> {
    await this.dashboardContainer.waitFor({ state: 'visible', timeout: 10000 });
    await this.statCards.first().waitFor({ state: 'visible', timeout: 5000 });
  }

  // ==================== Stats Methods ====================

  async getStatValue(stat: Locator): Promise<string> {
    return (await stat.textContent())?.trim() || '';
  }

  async getTotalBookings(): Promise<string> {
    return await this.getStatValue(this.totalBookingsStat);
  }

  async getTodayBookings(): Promise<string> {
    return await this.getStatValue(this.todayBookingsStat);
  }

  async getTotalRevenue(): Promise<string> {
    return await this.getStatValue(this.totalRevenueStat);
  }

  async getPendingBookings(): Promise<string> {
    return await this.getStatValue(this.pendingBookingsStat);
  }

  async getStatCount(): Promise<number> {
    return await this.statCards.count();
  }

  async getAllStats(): Promise<{ label: string; value: string }[]> {
    const stats: { label: string; value: string }[] = [];
    const count = await this.statCards.count();
    for (let i = 0; i < count; i++) {
      const card = this.statCards.nth(i);
      const label = await card.locator('.stat-label, .label, .metric-label').textContent();
      const value = await card.locator('.stat-value, .value, .metric-value').textContent();
      if (label && value) {
        stats.push({ label: label.trim(), value: value.trim() });
      }
    }
    return stats;
  }

  // ==================== Booking Methods ====================

  async getBookingCount(): Promise<number> {
    return await this.bookingItems.count();
  }

  async getTodayBookingCount(): Promise<number> {
    return await this.todayBookings.count();
  }

  async getUpcomingBookingCount(): Promise<number> {
    return await this.upcomingBookings.count();
  }

  async getPastBookingCount(): Promise<number> {
    return await this.pastBookings.count();
  }

  async getBookingTitle(index: number): Promise<string> {
    const booking = this.bookingItems.nth(index);
    return (await booking.locator('.booking-title, .service-name, .title, .name').textContent())?.trim() || '';
  }

  async getBookingTime(index: number): Promise<string> {
    const booking = this.bookingItems.nth(index);
    return (await booking.locator('.booking-time, .time, .date, .datetime').textContent())?.trim() || '';
  }

  async getBookingStatus(index: number): Promise<string> {
    const booking = this.bookingItems.nth(index);
    return (await booking.locator('.booking-status, .status, .badge').textContent())?.trim() || '';
  }

  async getBookingCustomer(index: number): Promise<string> {
    const booking = this.bookingItems.nth(index);
    return (await booking.locator('.customer-name, .client, .name').textContent())?.trim() || '';
  }

  async getBookingPrice(index: number): Promise<string> {
    const booking = this.bookingItems.nth(index);
    return (await booking.locator('.price, .amount, .total').textContent())?.trim() || '';
  }

  async getAllBookings(): Promise<{
    title: string;
    customer: string;
    time: string;
    status: string;
    price: string;
  }[]> {
    const bookings: { title: string; customer: string; time: string; status: string; price: string }[] = [];
    const count = await this.getBookingCount();
    for (let i = 0; i < count; i++) {
      bookings.push({
        title: await this.getBookingTitle(i),
        customer: await this.getBookingCustomer(i),
        time: await this.getBookingTime(i),
        status: await this.getBookingStatus(i),
        price: await this.getBookingPrice(i)
      });
    }
    return bookings;
  }

  async clickBooking(index: number): Promise<void> {
    const booking = this.bookingItems.nth(index);
    await booking.click();
  }

  // ==================== Navigation Methods ====================

  async clickBookingsNav(): Promise<void> {
    await this.bookingsNav.click();
    await this.page.waitForURL(/.*bookings/, { timeout: 5000 });
  }

  async clickServicesNav(): Promise<void> {
    await this.servicesNav.click();
    await this.page.waitForURL(/.*services/, { timeout: 5000 });
  }

  async clickSettingsNav(): Promise<void> {
    await this.settingsNav.click();
    await this.page.waitForURL(/.*settings/, { timeout: 5000 });
  }

  async clickProfileNav(): Promise<void> {
    await this.profileNav.click();
    await this.page.waitForURL(/.*profile/, { timeout: 5000 });
  }

  // ==================== Action Methods ====================

  async clickCreateBooking(): Promise<void> {
    await this.createBookingButton.click();
  }

  async clickExport(): Promise<void> {
    await this.exportButton.click();
  }

  async clickFilter(): Promise<void> {
    await this.filterButton.click();
  }

  async searchBookings(searchTerm: string): Promise<void> {
    await this.searchInput.fill(searchTerm);
    await this.searchInput.press('Enter');
    await this.wait(500);
  }

  async filterByDate(date: string): Promise<void> {
    await this.dateFilter.fill(date);
    await this.dateFilter.blur();
    await this.wait(500);
  }

  async filterByStatus(status: string): Promise<void> {
    await this.statusFilter.selectOption({ label: status });
    await this.wait(500);
  }

  // ==================== Logout Methods ====================

  async logout(): Promise<void> {
    await this.userMenu.click();
    await this.logoutButton.click();
    await this.page.waitForURL('/', { timeout: 5000 });
  }

  async logoutWithoutWait(): Promise<void> {
    await this.userMenu.click();
    await this.logoutButton.click();
  }

  // ==================== Validation Methods ====================

  async isDashboardVisible(): Promise<boolean> {
    return await this.dashboardContainer.isVisible().catch(() => false);
  }

  async isSidebarVisible(): Promise<boolean> {
    return await this.sidebar.isVisible().catch(() => false);
  }

  async isStatsVisible(): Promise<boolean> {
    return await this.statCards.isVisible().catch(() => false);
  }

  async isBookingsListVisible(): Promise<boolean> {
    return await this.bookingsList.isVisible().catch(() => false);
  }

  async isCreateBookingButtonVisible(): Promise<boolean> {
    return await this.createBookingButton.isVisible().catch(() => false);
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.navUser.isVisible().catch(() => false);
  }

  // ==================== Debug Methods ====================

  async getDashboardStats(): Promise<{
    totalBookings: string;
    todayBookings: string;
    totalRevenue: string;
    pendingBookings: string;
  }> {
    return {
      totalBookings: await this.getTotalBookings(),
      todayBookings: await this.getTodayBookings(),
      totalRevenue: await this.getTotalRevenue(),
      pendingBookings: await this.getPendingBookings()
    };
  }

  async takeDashboardScreenshot(name: string): Promise<void> {
    await this.dashboardContainer.screenshot({ path: `screenshots/dashboard-${name}.png` });
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async isOnPage(path: string): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return url.includes(path);
  }
}