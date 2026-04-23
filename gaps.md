# Gaps log — phase 3 mechanical replace

## Resolved

| Subagent | File:line | Value | Token used |
|---|---|---|---|
| host-global | _tag.scss:10 | `gray` | `--tag-fallback-bg` |
| host-global | _spinner.scss:1 | `#FFF` | `--text-white` |
| host-global | _spinner.scss:27 | `rgba(0,0,0,0.3)` | `--spinner-overlay-bg` |
| host-global | _pell.scss:20 | `#fff` | `--pell-actionbar-bg` |
| host-global | _text.scss:33 | `rgba(0, 0, 0, 0.87)` | `--text-black` |
| host-global | _text.scss:37 | `white` | `--text-white` |
| host-global | styles.scss:36 | `black` | `--scrollbar-bg` |
| host-global | styles.scss:129 | `green` | `--status-green-text` |
| host-global | styles.scss:374 | `black` | `--text-black` |
| host-global | styles.scss:377 | `green` | `--status-green-text` |
| host-global | styles.scss:403 | `#319C4C` | `--progress-fill` |
| host-global | styles.scss:405 | `lightgrey` | `--progress-track` |
| host-component | license-page.component.scss:11,47,52,133 | `rgba(0,0,0,0.6)` | `--text-muted` |
| host-component | license-page.component.scss:163,167,171 | `rgba(255,255,255,0.7)` | `--text-muted` |
| host-component | license-page.component.scss:81,107 | `#1976d2` | `--badge-type-text` |
| host-component | license-page.component.scss:86 | `#7b1fa2` | `--badge-dependency-text` |
| host-component | license-page.component.scss:139 | `#ffebee` | `--surface-error-message` |
| host-component | license-page.component.scss:141 | `#c62828` | `--text-error-message` |
| host-component | license-page.component.scss:178,193 | `#90caf9` | `--badge-type-text` |
| host-component | license-page.component.scss:183 | `#ce93d8` | `--badge-dependency-text` |
| host-component | license-page.component.scss:204 | `#ef5350` | `--text-error-message` |
| host-component | license-page.component.scss:203 | `rgba(198,40,40,0.2)` | `--surface-error-message` |
| host-component | license-page.component.scss:209 | `rgba(255,255,255,0.87)` | `--text-black` |
| host-component | cms-menu-edit.component.scss:11 | `#f0f0f0` | `--surface-subheader` |
| host-component | eforms-page.component.scss:6 | `#F1F1F1` | `--surface-subheader` |
| host-component | visual-editor-field.component.scss:4 | `black` | `--text-black` |
| host-component | cms-header.component.scss:43 | `#666` | `--text-child-muted` |
| host-component | spinner.component.scss:7 | `rgba(0,0,0,0.5)` | `--spinner-overlay-bg` |
| host-component | eform-subheader.component.scss:2 | `#F1F1F1` | `--surface-subheader` |
| host-component | eform-new-subheader.component.scss:16 | `#0275d8` | `--breadcrumb-link` |

## Out of scope

| Subagent | File:line | Value | Reason |
|---|---|---|---|
| host-global | _spinner.scss:36 | `black` (scrollbar bg) | Duplicate of styles.scss:36, already resolved there |
| host-global | _pell.scss:4 | `5px` border-radius | Pell editor one-off layout value |
| host-global | _pell.scss:5 | `hsla(0, 0%, 4%, 0.1)` box-shadow | Pell editor one-off shadow |
| host-global | _chart.scss:11-24 | multiple dark chart colors | ngx-charts internal dark theme vars |
| host-global | styles.scss:507 | `rgba(0, 0, 0, 1)` | CDK overlay backdrop one-off override |
| host-global | ngx-gallery (multiple) | `white`, `black`, `rgba(...)` | Third-party gallery lib styling |
| host-global | angular-tree.scss:18,25 | `white`, `grey` | Third-party tree component styling |
| host-component | license-page.component.scss:75 | `border-radius: 12px` | One-off badge radius |
| host-component | license-page.component.scss:21 | `font-size: 12px` | One-off chip size |
| host-component | license-page.component.scss:76 | `font-size: 11px` | One-off badge size |
| host-component | license-page.component.scss:119 | `font-size: 18px` | One-off heading size |
| host-component | license-page.component.scss:151 | `font-family: 'Courier New', monospace` | One-off code font |
| host-component | license-page.component.scss:152 | `font-size: 12px` | One-off code block size |
| host-component | license-page.component.scss:177,182,190,208 | various `rgba(...)` bg overrides | Dark theme bg overlays (opacity-based, not semantic colors) |
| host-component | cms-menu-edit.component.scss:24 | `0 4px 12px rgba(0,0,0,0.15)` | One-off drag preview shadow |
| host-component | cms-header.component.scss:6 | `0 2px 8px rgba(0,0,0,0.2)` | One-off sticky header shadow |
| host-component | cms-header.component.scss:38 | `0 4px 8px rgba(0,0,0,0.1)` | One-off mobile menu shadow |
| host-component | shared-tag-delete.component.scss:29 | `border-radius: 10px` | One-off tag-info radius |
| host-component | shared-tag-delete.component.scss:45 | `font-size: 13px` | One-off label size |
