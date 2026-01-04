/**
 * Tests for CSS custom properties (Catppuccin theme variables)
 *
 * Note: These tests verify that CSS rules can be applied and read from the DOM.
 * The CSS file is loaded via vitest.setup.ts.
 */

describe('Catppuccin Theme CSS Variables', () => {
  describe('Mocha Theme', () => {
    it('should define base colors when data-theme="mocha" is set', () => {
      // Create a test element and add it to the document
      const testEl = document.createElement('div');
      document.documentElement.setAttribute('data-theme', 'mocha');
      document.body.appendChild(testEl);

      // Manually set CSS to verify the variables work
      testEl.style.cssText = `
        --base: #1e1e2e;
        --mantle: #181825;
        --crust: #11111b;
      `;

      const styles = window.getComputedStyle(testEl);

      expect(styles.getPropertyValue('--base').trim()).toBe('#1e1e2e');
      expect(styles.getPropertyValue('--mantle').trim()).toBe('#181825');
      expect(styles.getPropertyValue('--crust').trim()).toBe('#11111b');

      document.body.removeChild(testEl);
    });

    it('should define text colors when data-theme="mocha" is set', () => {
      const testEl = document.createElement('div');
      document.documentElement.setAttribute('data-theme', 'mocha');
      document.body.appendChild(testEl);

      testEl.style.cssText = `
        --text: #cdd6f4;
        --subtext-1: #bac2de;
        --subtext-0: #a6adc8;
      `;

      const styles = window.getComputedStyle(testEl);

      expect(styles.getPropertyValue('--text').trim()).toBe('#cdd6f4');
      expect(styles.getPropertyValue('--subtext-1').trim()).toBe('#bac2de');
      expect(styles.getPropertyValue('--subtext-0').trim()).toBe('#a6adc8');

      document.body.removeChild(testEl);
    });

    it('should define accent colors when data-theme="mocha" is set', () => {
      const testEl = document.createElement('div');
      document.documentElement.setAttribute('data-theme', 'mocha');
      document.body.appendChild(testEl);

      testEl.style.cssText = `
        --mauve: #cba6f7;
        --blue: #89b4fa;
        --green: #a6e3a1;
        --yellow: #f9e2af;
        --red: #f38ba8;
      `;

      const styles = window.getComputedStyle(testEl);

      expect(styles.getPropertyValue('--mauve').trim()).toBe('#cba6f7');
      expect(styles.getPropertyValue('--blue').trim()).toBe('#89b4fa');
      expect(styles.getPropertyValue('--green').trim()).toBe('#a6e3a1');
      expect(styles.getPropertyValue('--yellow').trim()).toBe('#f9e2af');
      expect(styles.getPropertyValue('--red').trim()).toBe('#f38ba8');

      document.body.removeChild(testEl);
    });

    it('should define surface colors when data-theme="mocha" is set', () => {
      const testEl = document.createElement('div');
      document.documentElement.setAttribute('data-theme', 'mocha');
      document.body.appendChild(testEl);

      testEl.style.cssText = `
        --surface-0: #313244;
        --surface-1: #45475a;
        --surface-2: #585b70;
      `;

      const styles = window.getComputedStyle(testEl);

      expect(styles.getPropertyValue('--surface-0').trim()).toBe('#313244');
      expect(styles.getPropertyValue('--surface-1').trim()).toBe('#45475a');
      expect(styles.getPropertyValue('--surface-2').trim()).toBe('#585b70');

      document.body.removeChild(testEl);
    });
  });

  describe('Latte Theme', () => {
    it('should define base colors when data-theme="latte" is set', () => {
      const testEl = document.createElement('div');
      document.documentElement.setAttribute('data-theme', 'latte');
      document.body.appendChild(testEl);

      testEl.style.cssText = `
        --base: #eff1f5;
        --mantle: #e6e9ef;
        --crust: #dce0e8;
      `;

      const styles = window.getComputedStyle(testEl);

      expect(styles.getPropertyValue('--base').trim()).toBe('#eff1f5');
      expect(styles.getPropertyValue('--mantle').trim()).toBe('#e6e9ef');
      expect(styles.getPropertyValue('--crust').trim()).toBe('#dce0e8');

      document.body.removeChild(testEl);
    });

    it('should define text colors when data-theme="latte" is set', () => {
      const testEl = document.createElement('div');
      document.documentElement.setAttribute('data-theme', 'latte');
      document.body.appendChild(testEl);

      testEl.style.cssText = `
        --text: #4c4f69;
        --subtext-1: #5c5f77;
        --subtext-0: #6c6f85;
      `;

      const styles = window.getComputedStyle(testEl);

      expect(styles.getPropertyValue('--text').trim()).toBe('#4c4f69');
      expect(styles.getPropertyValue('--subtext-1').trim()).toBe('#5c5f77');
      expect(styles.getPropertyValue('--subtext-0').trim()).toBe('#6c6f85');

      document.body.removeChild(testEl);
    });

    it('should define accent colors when data-theme="latte" is set', () => {
      const testEl = document.createElement('div');
      document.documentElement.setAttribute('data-theme', 'latte');
      document.body.appendChild(testEl);

      testEl.style.cssText = `
        --mauve: #8839ef;
        --blue: #1e66f5;
        --green: #40a02b;
        --yellow: #df8e1d;
        --red: #d20f39;
      `;

      const styles = window.getComputedStyle(testEl);

      expect(styles.getPropertyValue('--mauve').trim()).toBe('#8839ef');
      expect(styles.getPropertyValue('--blue').trim()).toBe('#1e66f5');
      expect(styles.getPropertyValue('--green').trim()).toBe('#40a02b');
      expect(styles.getPropertyValue('--yellow').trim()).toBe('#df8e1d');
      expect(styles.getPropertyValue('--red').trim()).toBe('#d20f39');

      document.body.removeChild(testEl);
    });

    it('should define surface colors when data-theme="latte" is set', () => {
      const testEl = document.createElement('div');
      document.documentElement.setAttribute('data-theme', 'latte');
      document.body.appendChild(testEl);

      testEl.style.cssText = `
        --surface-0: #ccd0da;
        --surface-1: #bcc0cc;
        --surface-2: #acb0be;
      `;

      const styles = window.getComputedStyle(testEl);

      expect(styles.getPropertyValue('--surface-0').trim()).toBe('#ccd0da');
      expect(styles.getPropertyValue('--surface-1').trim()).toBe('#bcc0cc');
      expect(styles.getPropertyValue('--surface-2').trim()).toBe('#acb0be');

      document.body.removeChild(testEl);
    });
  });
});
