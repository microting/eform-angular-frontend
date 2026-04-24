# Screenshot Regression Testing

Pixel-level visual regression testing using Playwright and pixelmatch.

## Prerequisites

- Node.js 18+
- Playwright chromium: `npx playwright install chromium`
- pngjs + pixelmatch: `npm install pngjs pixelmatch` (already in devDependencies)
- Running frontend (`yarn start`) at `http://localhost:4200`
- Running backend (`dotnet run`) at `http://localhost:5000`

## Capturing Screenshots

```bash
cd eform-client

# Light mode
node screenshots/capture.mjs screenshots/baseline --mode=light

# Dark mode
node screenshots/capture.mjs screenshots/baseline --mode=dark
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `E2E_BASE_URL` | `http://localhost:4200` | Frontend URL |
| `E2E_USER` | `admin@admin.com` | Login username |
| `E2E_PASS` | `secretpassword` | Login password |

### Pages Captured

Defined in `pages.json`. Currently captures 10 pages in both light and dark mode (20 PNGs total):

- my-eforms, cases-list, templates-list, sites, workers
- profile-settings, application-settings
- items-planning, backend-configuration, time-planning

Two interactive pages (tags-dropdown-open, delete-confirm-dialog) require test data to be present.

## Comparing Screenshots

```bash
# Compare baseline vs candidate
node screenshots/diff.mjs screenshots/baseline screenshots/candidate screenshots/diffs [--threshold=0.005]
```

- Compares matching PNGs pair-by-pair
- Default threshold: 0.5% pixel difference per page
- Writes diff PNGs to output dir (red = changed pixels)
- Exits non-zero if any page exceeds threshold

## Reproducing Baselines

1. Start backend and frontend with a clean database (no customer data)
2. Complete the initial setup wizard
3. Log in as admin
4. Capture both modes:
   ```bash
   rm -rf eform-client/screenshots/baseline
   node eform-client/screenshots/capture.mjs eform-client/screenshots/baseline --mode=light
   node eform-client/screenshots/capture.mjs eform-client/screenshots/baseline --mode=dark
   ```
5. Commit the baseline PNGs

## Regression Workflow

1. Capture baselines from `stable` (or current known-good state)
2. Switch to feature branch
3. Capture candidates into a separate directory
4. Run diff — all pages should be within 0.5% tolerance
5. Investigate any failures using the diff PNGs in the output directory
