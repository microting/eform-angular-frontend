# SCSS Structure and Material 3 Migration Guide

## Overview

This document provides an overview of the SCSS structure in the eForm Angular frontend and guidance for future migration to Angular Material 3 (M3).

## Current State

The application currently uses **Angular Material 20.x** with **Material 2 (M2) theme APIs**. The SCSS files have been refactored to follow best practices and are well-organized for future M3 migration.

### SCSS File Structure

```
src/scss/
├── components/          # Component-specific styles
│   ├── _index.scss     # Component imports (organized by type)
│   ├── _button.scss    # Button styles
│   ├── _card.scss      # Card utilities
│   ├── _chart.scss     # Chart theming (ngx-charts)
│   ├── _form.scss      # Form field utilities
│   ├── _modal.scss     # Modal customization
│   ├── _table.scss     # Table theming (mtx-grid)
│   ├── _text.scss      # Text utilities and colors
│   └── ...             # Other component files
├── libs/               # Third-party library styles
│   ├── _index.scss     # Library imports
│   ├── theme.scss      # Main theme configuration
│   └── ...             # Library-specific styles
├── utilities/          # Utility classes and variables
│   ├── _index.scss     # Utilities index
│   ├── _colors.scss    # Color variables
│   ├── _variables.scss # Global variables
│   ├── _flex.scss      # Flexbox utilities
│   ├── _grid.scss      # Grid utilities
│   ├── _spacing.scss   # Spacing utilities
│   └── ...             # Other utilities
└── styles.scss         # Global styles and entry point
```

## Theme Configuration

### Current Implementation (M2)

The theme is configured in `src/scss/libs/theme.scss`:

```scss
// Typography
$eform-typography: mat.m2-define-typography-config(...);

// Color Palettes
$eform-light-primary: mat.m2-define-palette(mat.$m2-indigo-palette);
$eform-light-accent: mat.m2-define-palette(mat.$m2-pink-palette);

// Theme Definitions
$eform-light-theme: mat.m2-define-light-theme((
  color: (
    primary: $eform-light-primary,
    accent: $eform-light-accent,
  ),
  typography: $eform-typography,
));
```

### Theme Application

Themes are applied to both light and dark modes:

```scss
body {
  @each $key, $val in (('light', $eform-light-theme), ('dark', $eform-dark-theme)) {
    &.theme-#{$key} {
      @include mat.all-component-themes($val);
      @include mtx.all-component-themes($val);
      // ... other component themes
    }
  }
}
```

## Component Theming

### Current Pattern

Component SCSS files use mixins to apply theme-aware styles:

```scss
@mixin color($theme) {
  $color-config: mat.m2-get-color-config($theme);
  // Apply theme colors
}

@mixin typography($theme) {
  $typography-config: mat.m2-get-typography-config($theme);
  // Apply typography
}

@mixin theme($theme) {
  $color-config: mat.m2-get-color-config($theme);
  @if $color-config != null {
    @include color($theme);
    @include typography($theme);
  }
}
```

## Material 3 Migration Plan

### When to Migrate

Consider migrating to M3 when:
- Angular Material officially deprecates M2 APIs
- New features are only available in M3
- The team is ready for a comprehensive update

### Migration Steps

#### 1. Update Theme Configuration

Replace M2 theme functions with M3 equivalents in `libs/theme.scss`:

**Before (M2):**
```scss
$eform-typography: mat.m2-define-typography-config(...);
$eform-light-theme: mat.m2-define-light-theme(...);
```

**After (M3):**
```scss
$eform-typography: mat.define-typography-config(...);
$eform-light-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: mat.$azure-palette,
  ),
));
```

#### 2. Update Color API Calls

Replace M2 color functions in component files:

**Before (M2):**
```scss
@mixin color($theme) {
  $color-config: mat.m2-get-color-config($theme);
  $primary: map.get($color-config, 'primary');
  color: mat.m2-get-color-from-palette($primary, 500);
}
```

**After (M3):**
```scss
@mixin color($theme) {
  color: mat.get-theme-color($theme, primary);
}
```

#### 3. Update Typography API Calls

Replace M2 typography functions:

**Before (M2):**
```scss
@mixin typography($theme) {
  $typography-config: mat.m2-get-typography-config($theme);
  $body-text: map.get($typography-config, 'body-1');
}
```

**After (M3):**
```scss
@mixin typography($theme) {
  $typography-config: mat.get-theme-typography($theme);
  font: mat.get-theme-typography($theme, body-large);
}
```

#### 4. Update Component Mixins

Update all component theme mixins in the `components/` directory to use M3 APIs.

#### 5. Test Thoroughly

- Test both light and dark themes
- Verify all component styles render correctly
- Check responsive behavior
- Test across different browsers

### Files to Update

When migrating to M3, update these files:

1. **libs/theme.scss** - Main theme configuration
2. **components/_text.scss** - Color utilities
3. **components/_table.scss** - Table theming
4. **components/_chart.scss** - Chart theming
5. Any other files using `m2-` prefixed functions

### Search for M2 API Usage

To find all M2 API usages, run:

```bash
grep -r "m2-" src/scss/
```

Current M2 API usages (as of last refactoring):
- `mat.m2-define-typography-config`
- `mat.m2-define-typography-level`
- `mat.m2-define-palette`
- `mat.m2-define-light-theme`
- `mat.m2-define-dark-theme`
- `mat.m2-get-color-config`
- `mat.m2-get-typography-config`
- `mat.m2-get-color-from-palette`

## Best Practices

### 1. Use @use and @forward

✅ **Do:**
```scss
@use '@angular/material' as mat;
@use '../utilities/colors' as *;
```

❌ **Don't:**
```scss
@import '@angular/material';
@import '../utilities/colors';
```

### 2. Organize Styles Logically

Group related styles together and use clear section headers:

```scss
/**
 * Section Name
 * 
 * Description of what this section contains.
 */
.class-name {
  // styles
}
```

### 3. Document Complex Patterns

Add comments explaining non-obvious behavior:

```scss
/**
 * Progress Circle Component
 * 
 * Uses CSS conic-gradient for the progress arc.
 * The --percentage custom property controls the fill.
 */
.progress-circle {
  background: conic-gradient(
    #319c4c 0%,
    #319c4c calc(var(--percentage) * 1%),
    lightgrey calc(var(--percentage) * 1%)
  );
}
```

### 4. Use CSS Custom Properties for Theming

Leverage CSS variables for dynamic theming:

```scss
body, .theme-light {
  --theme-body-font-color: #242729;
  --tp-td-bg: #ffffff;
}

body, .theme-dark {
  --theme-body-font-color: #e6e6e6;
  --tp-td-bg: #424242;
}
```

### 5. Keep Specificity Low

Avoid overly specific selectors when possible:

✅ **Do:**
```scss
.status-active {
  color: #fff;
  
  span {
    color: #fff;
  }
}
```

❌ **Don't:**
```scss
body .container .status-active span {
  color: #fff;
}
```

## Troubleshooting

### Build Errors After Changes

If you encounter build errors:

1. Clear the build cache: `rm -rf dist/`
2. Reinstall dependencies: `yarn install`
3. Rebuild: `yarn build`

### Style Not Applying

If styles aren't applying:

1. Check import order in `_index.scss` files
2. Verify CSS specificity isn't being overridden
3. Use browser DevTools to inspect computed styles
4. Check that theme mixins are included correctly

### Dark Theme Issues

If dark theme styles are incorrect:

1. Verify theme class is applied to `body` element
2. Check CSS custom properties are defined for both themes
3. Ensure component theme mixins check for `is-dark-theme`

## Resources

- [Angular Material Theming Guide](https://material.angular.io/guide/theming)
- [Material Design 3](https://m3.material.io/)
- [Sass Documentation](https://sass-lang.com/documentation)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

## Questions?

If you have questions about the SCSS structure or M3 migration:

1. Review this guide thoroughly
2. Check the inline comments in SCSS files
3. Consult the Angular Material documentation
4. Reach out to the development team

---

**Last Updated:** 2025-11-16
**Angular Material Version:** 20.1.2
**Theme API:** Material 2 (M2) - Compatible with M3
