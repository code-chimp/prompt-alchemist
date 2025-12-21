import { expect, test } from '@playwright/test';
import { HomePage } from './pages/HomePage';

declare global {
  interface Window {
    __TAURI__?: {
      tauri: {
        invoke: (cmd: string) => Promise<void> | void;
      };
    };
  }
}

test.describe('Greet flow', () => {
  test('shows toast when greeting via button', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();

    await expect(home.heading).toBeVisible();
    await expect(home.nameInput).toBeVisible();
    await expect(home.greetButton).toBeEnabled();

    await home.greet('Playwright');

    await expect(home.toast).toContainText('Failed to greet. Please try again.');
  });

  test('shows toast when greeting via Enter', async ({ page }) => {
    const home = new HomePage(page);

    await home.goto();

    await home.greetWithEnter('KeyUser');

    await expect(home.toast).toContainText('Failed to greet. Please try again.');
  });

  test('shows error toast when greet fails', async ({ page }) => {
    await page.addInitScript(() => {
      window.__TAURI__ = {
        tauri: {
          invoke: async (cmd: string) => {
            if (cmd === 'greet') {
              throw new Error('Network error');
            }
          },
        },
      };
    });

    const home = new HomePage(page);

    await home.goto();

    await home.greet('ErrorCase');

    await expect(home.toast).toContainText('Failed to greet. Please try again.');
  });
});
