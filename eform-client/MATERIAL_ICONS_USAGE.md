# Material Icons and Symbols Usage Guide

This application now supports both **Material Design Icons** and **Material Design Symbols**.

## Overview

- **Material Icons**: The original icon font from Google (ligature-based)
- **Material Symbols**: The newer variable font system with customizable styles

## Using Material Icons (Default)

Material Icons is the default font set. Simply use `<mat-icon>` without any special attributes:

```html
<!-- Default Material Icons -->
<mat-icon>home</mat-icon>
<mat-icon>settings</mat-icon>
<mat-icon>menu</mat-icon>
```

## Using Material Symbols

To use Material Symbols, specify the `fontSet` attribute:

### Outlined Style (Default for Symbols)
```html
<mat-icon fontSet="material-symbols-outlined">home</mat-icon>
<mat-icon fontSet="material-symbols-outlined">settings</mat-icon>
```

### Rounded Style
```html
<mat-icon fontSet="material-symbols-rounded">home</mat-icon>
<mat-icon fontSet="material-symbols-rounded">favorite</mat-icon>
```

### Sharp Style
```html
<mat-icon fontSet="material-symbols-sharp">home</mat-icon>
<mat-icon fontSet="material-symbols-sharp">star</mat-icon>
```

## Additional Styling Options

### Material Symbols with Custom Variations

Material Symbols support variable font features:

```html
<!-- Filled icon -->
<mat-icon fontSet="material-symbols-outlined" class="filled">favorite</mat-icon>

<!-- Light weight -->
<mat-icon fontSet="material-symbols-outlined" class="light">home</mat-icon>

<!-- Bold weight -->
<mat-icon fontSet="material-symbols-outlined" class="bold">settings</mat-icon>
```

### Size Classes (Works for both Icons and Symbols)

```html
<!-- 18px -->
<mat-icon class="md-18">home</mat-icon>

<!-- 24px (default) -->
<mat-icon class="md-24">home</mat-icon>

<!-- 36px -->
<mat-icon class="md-36">home</mat-icon>

<!-- 48px -->
<mat-icon class="md-48">home</mat-icon>
```

### Color Classes

```html
<!-- Danger/Error color -->
<mat-icon class="material-icon-danger">error</mat-icon>

<!-- Success color -->
<mat-icon class="material-icon-success">check_circle</mat-icon>
```

### Pointer Cursor

```html
<!-- Add pointer cursor for clickable icons -->
<mat-icon class="material-icon-pointer" (click)="handleClick()">info</mat-icon>
```

## Examples

### Combining Multiple Classes

```html
<!-- Large, filled symbol with pointer cursor -->
<mat-icon fontSet="material-symbols-rounded" 
          class="md-48 filled material-icon-pointer"
          (click)="toggleFavorite()">
  favorite
</mat-icon>

<!-- Small danger icon -->
<mat-icon class="md-18 material-icon-danger">warning</mat-icon>
```

### Using with Buttons

```html
<!-- Material Icons (default) -->
<button mat-icon-button>
  <mat-icon>more_vert</mat-icon>
</button>

<!-- Material Symbols -->
<button mat-icon-button>
  <mat-icon fontSet="material-symbols-rounded">more_vert</mat-icon>
</button>
```

## Icon Availability

- Material Icons: https://fonts.google.com/icons?icon.set=Material+Icons
- Material Symbols: https://fonts.google.com/icons?icon.set=Material+Symbols

Note: Most icon names are the same between both sets, but always verify on the Google Fonts website.

## Technical Details

### Loaded Font Families
- `Material Icons` (default)
- `Material Symbols Outlined`
- `Material Symbols Rounded`
- `Material Symbols Sharp`

### Font Variation Settings for Symbols

Material Symbols use OpenType variable font features:
- `FILL`: 0 (outlined) to 1 (filled)
- `wght`: 100 to 700 (weight)
- `GRAD`: -50 to 200 (grade)
- `opsz`: 20 to 48 (optical size)

These are automatically set based on size and style classes in `_icon.scss`.
