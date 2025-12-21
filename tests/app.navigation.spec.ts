import { expect, test } from '@playwright/test';
import { HomePage } from './pages/HomePage';

test.describe('Home navigation and docs links', () => {
  test('renders core home UI', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();

    await expect(home.heading).toBeVisible();
    await expect(home.nameInput).toBeVisible();
    await expect(home.greetButton).toBeVisible();
  });

  test('shows external docs links with correct hrefs', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();

    await expect(home.viteLink).toHaveAttribute('href', /vitejs\.dev|vite\.dev/);
    await expect(home.reactLink).toHaveAttribute('href', /reactjs\.org|react\.dev/);
    await expect(home.tauriLink).toHaveAttribute('href', /tauri\.app/);
  });
});
