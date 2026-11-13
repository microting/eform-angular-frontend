import { test, expect } from '@playwright/test';

// The inline script in index.html paints theme-light/theme-dark on <body> before Angular boots, so no user
// sees the wrong theme first. These specs assert the class at domcontentloaded, i.e. before the app bundle runs.
// No login is needed: the paint depends only on the theme-mode key and the OS colour scheme.
// A signed-out AuthState (the reducer's initial shape, which AuthSyncStorageService writes under 'auth') whose
// stored mode is `mode`. Once the app bundle runs it hydrates the store from this blob, so the layout derives
// the same mode the inline script painted and the two paints agree instead of racing: without it the store
// would sit at themeMode 'system' and repaint the OS scheme over a stored mode that deliberately differs.
const seedMode = (mode: 'light' | 'dark') => ({
  mode,
  auth: {
    token: { accessToken: '', expiresIn: null, tokenType: '', role: '' },
    currentUser: {
      firstName: '', lastName: '', id: 0, userName: '', locale: 'da', languageId: 0,
      darkTheme: mode === 'dark', themeMode: mode, themeVariant: 'eform', loginRedirectUrl: '',
      isFirstUser: false, avatarUrl: '', claims: {},
    },
    connectionString: { isConnectionStringExist: false, count: 0 },
    sideMenuOpened: true,
    error: null,
    status: 'pending',
  },
});

const bodyClassAtDomContentLoaded = async (page) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  return page.evaluate(() => document.body.className);
};

test.describe('Pre-boot theme paint', () => {
  test('stored dark with a light OS paints theme-dark', async ({ page }) => {
    await page.addInitScript((seed) => {
      localStorage.setItem('theme-mode', seed.mode);
      localStorage.setItem('auth', JSON.stringify(seed.auth));
    }, seedMode('dark'));
    await page.emulateMedia({ colorScheme: 'light' });
    const cls = await bodyClassAtDomContentLoaded(page);
    expect(cls).toContain('theme-dark');
    expect(cls).not.toContain('theme-light');
  });

  test('stored light with a dark OS paints theme-light', async ({ page }) => {
    await page.addInitScript((seed) => {
      localStorage.setItem('theme-mode', seed.mode);
      localStorage.setItem('auth', JSON.stringify(seed.auth));
    }, seedMode('light'));
    await page.emulateMedia({ colorScheme: 'dark' });
    const cls = await bodyClassAtDomContentLoaded(page);
    expect(cls).toContain('theme-light');
    expect(cls).not.toContain('theme-dark');
  });

  test('stored system with a dark OS paints theme-dark', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme-mode', 'system'));
    await page.emulateMedia({ colorScheme: 'dark' });
    const cls = await bodyClassAtDomContentLoaded(page);
    expect(cls).toContain('theme-dark');
    expect(cls).not.toContain('theme-light');
  });

  test('stored system with a light OS paints theme-light', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme-mode', 'system'));
    await page.emulateMedia({ colorScheme: 'light' });
    const cls = await bodyClassAtDomContentLoaded(page);
    expect(cls).toContain('theme-light');
    expect(cls).not.toContain('theme-dark');
  });

  test('no stored key with a dark OS paints theme-dark', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'dark' });
    const cls = await bodyClassAtDomContentLoaded(page);
    expect(cls).toContain('theme-dark');
    expect(cls).not.toContain('theme-light');
  });
});
