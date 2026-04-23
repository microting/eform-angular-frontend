# Gaps log — phase 3 mechanical replace

Append-only. One row per hardcoded value with no matching token.

| Subagent | File:line | Value | Surrounding context |
|---|---|---|---|
| host-global | _tag.scss:10 | `gray` | `.tag { background: gray }` |
| host-global | _spinner.scss:1 | `#FFF` | `$foreground: #FFF` (spinner loader color) |
| host-global | _spinner.scss:36 | `black` | `background-color: black` (scrollbar bg in spinner) |
| host-global | _spinner.scss:27 | `rgba(0,0,0,0.3)` | spinner overlay background |
| host-global | _pell.scss:20 | `#fff` | `.pell-actionbar { background-color: #fff }` |
| host-global | _pell.scss:4 | `5px` border-radius | `.pell { border-radius: 5px }` |
| host-global | _pell.scss:5 | `hsla(0, 0%, 4%, 0.1)` box-shadow | `.pell { box-shadow }` |
| host-global | _text.scss:33 | `rgba(0, 0, 0, 0.87)` | `.text-black { color }` |
| host-global | _text.scss:37 | `white` | `.text-white { color: white }` |
| host-global | _chart.scss:11-24 | multiple dark chart colors | SCSS local vars for ngx-charts dark theme |
| host-global | styles.scss:36 | `black` | `&::-webkit-scrollbar { background-color: black }` |
| host-global | styles.scss:129 | `green` | `.reportCaseUnarchive { color: green }` |
| host-global | styles.scss:374 | `black` | `.black-text { color: black }` |
| host-global | styles.scss:377 | `green` | `.green-text { color: green }` |
| host-global | styles.scss:507 | `rgba(0, 0, 0, 1)` | `.cdk-overlay-backdrop { background-color }` |
| host-global | styles.scss:403 | `#319C4C` | `conic-gradient` in `.progress-circle` |
| host-global | styles.scss:405 | `lightgrey` | `conic-gradient` in `.progress-circle` |
| host-global | ngx-gallery (multiple) | `white`, `black`, `rgba(...)` | third-party gallery lib styling |
| host-global | angular-tree.scss:18,25 | `white`, `grey` | node-content-wrapper box-shadow colors |
| host-component | license-page.component.scss:11,47,52,133,163,167,171 | `rgba(0,0,0,0.6)`, `rgba(255,255,255,0.7)` | text color for stats/loading/results |
| host-component | license-page.component.scss:75 | `border-radius: 12px` | `.badge { border-radius }` |
| host-component | license-page.component.scss:21 | `font-size: 12px` | `mat-chip { font-size }` |
| host-component | license-page.component.scss:76 | `font-size: 11px` | `.badge { font-size }` |
| host-component | license-page.component.scss:119 | `font-size: 18px` | `.license-text h3 { font-size }` |
| host-component | license-page.component.scss:81,107 | `#1976d2` | badge-type color, link color |
| host-component | license-page.component.scss:86 | `#7b1fa2` | badge-dependency color |
| host-component | license-page.component.scss:139 | `#ffebee` | error-message background |
| host-component | license-page.component.scss:141 | `#c62828` | error-message text color |
| host-component | license-page.component.scss:178,193 | `#90caf9` | dark badge-type/link color |
| host-component | license-page.component.scss:183 | `#ce93d8` | dark badge-dependency color |
| host-component | license-page.component.scss:204 | `#ef5350` | dark error-message color |
| host-component | license-page.component.scss:177,182,190,203,208,209 | various `rgba(...)` | dark theme bg/color overrides |
| host-component | license-page.component.scss:151 | `font-family: 'Courier New', monospace` | pre block font-family |
| host-component | license-page.component.scss:152 | `font-size: 12px` | pre block font-size |
| host-component | cms-menu-edit.component.scss:11 | `#f0f0f0` | border-bottom color |
| host-component | cms-menu-edit.component.scss:24 | `0 4px 12px rgba(0,0,0,0.15)` | cdk-drag-preview box-shadow |
| host-component | eforms-page.component.scss:6 | `#F1F1F1` | ng-select custom bg |
| host-component | visual-editor-field.component.scss:4 | `black` | `[id^='fieldSection'] { color: black }` |
| host-component | cms-header.component.scss:6 | `0 2px 8px rgba(0,0,0,0.2)` | sticky header box-shadow |
| host-component | cms-header.component.scss:38 | `0 4px 8px rgba(0,0,0,0.1)` | mobile-menu box-shadow |
| host-component | cms-header.component.scss:43 | `#666` | child-item color |
| host-component | spinner.component.scss:7 | `rgba(0,0,0,0.5)` | overlay-spinner bg |
| host-component | eform-subheader.component.scss:2 | `#F1F1F1` | heading-bg background |
| host-component | eform-new-subheader.component.scss:16 | `#0275d8` | breadcrumb link color |
| host-component | shared-tag-delete.component.scss:29 | `border-radius: 10px` | tag-info border-radius |
| host-component | shared-tag-delete.component.scss:45 | `font-size: 13px` | label font-size |
