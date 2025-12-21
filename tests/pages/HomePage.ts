import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly greetButton: Locator;
  readonly toast: Locator;
  readonly viteLink: Locator;
  readonly reactLink: Locator;
  readonly tauriLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByText('Welcome to Tauri + React');
    this.nameInput = page.getByPlaceholder(/enter a name/i);
    this.greetButton = page.getByRole('button', { name: /greet/i });
    this.toast = page.locator('[data-sonner-toast]');

    this.viteLink = page.getByRole('link', { name: /vite/i });
    this.reactLink = page.getByRole('link', { name: /react/i });
    this.tauriLink = page.getByRole('link', { name: /tauri/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async greet(name: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.greetButton.click();
  }

  async greetWithEnter(name: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.nameInput.press('Enter');
  }

  async getToastText(): Promise<string> {
    return this.toast.innerText();
  }
}
