# eForm Token Vocabulary

Audit date: 2026-04-14
Scope: host app (`eform-angular-frontend`) + 18 plugin source repos

## Existing tokens (already in _colors.scss / styles.scss as CSS custom properties)

These are already emitted as `--var` in `styles.scss` (light/dark pairs):

| CSS variable | Light value | Dark value | Source SCSS var |
|---|---|---|---|
| `--primary` | `#289694` | `#4FCAC8` | `$primary-light` / `$primary-dark` |
| `--primary-light` | `#F5FCFC` | `#0D4746` | `$primary-light-light-mode` / `$primary-light-dark-mode` |
| `--warning` | `#E2A01C` | `#F4C25E` | `$warning-light` / `$warning-dark` |
| `--error` | `#F44336` | `#FF8282` | `$error-light` / `$error-dark` |
| `--border` | `#e2e6e9` | `#37383A` | `$border-light` / `$border-dark` |
| `--icon-secondary` | `#0F1316` | `#FFFFFF` | `$icon-secondary-light` / `$icon-secondary-dark` |
| `--bg` | `#FFFFFF` | `#202122` | `$bg-light` / `$bg-dark` |
| `--text-header` | `#0F1316` | `#F3F5F7` | `$text-header-light` / `$text-header-dark` |
| `--text-body` | `#7F868D` | `#C1C5C9` | `$text-body-light` / `$text-body-dark` |
| `--card` | `#F7F9FA` | `#2D2F31` | `$card-light` / `$card-dark` |
| `--btn-delete-text` | `#F3F5F7` | `#0F1316` | (inverted text-header) |
| `--mdc-theme-primary` | `#289694` | `#4FCAC8` | (set in theme.scss) |
| `--mdc-theme-primary-dark` | `#00716F` | `#00ADAB` | `$primary-dark-light-mode` / `$primary-dark-dark-mode` |
| `--tp-td-bg` | `#ffffff` | `#424242` | time-planning table |
| `--tp-th-bg` | `#f7f9fa` | `#424242` | time-planning table header |
| `--tp-border` | `#EBEFF2` | `#2B2B2B` | time-planning border |
| `--tp-text` | `#111827` | `#E6E6E6` | time-planning text |
| `--tp-white-text` | `#0F1316` | `white` | time-planning white text |
| `--black-800` | `#242729` | -- | text color |
| `--blue-600` | `#0077cc` | -- | link color |
| `--rounded-full` | `9999px` | same | border-radius utility |

## Color

### Brand / Primary

| Token | Light | Dark | Source | Example |
|---|---|---|---|---|
| `--brand-teal` | `#289694` | `#4FCAC8` | already tokenized | primary color |
| `--brand-teal-dark` | `#00716F` | `#00ADAB` | already tokenized | nav active bg |
| `--brand-teal-light` | `#F5FCFC` | `#0D4746` | already tokenized | tree-select hover |

### Surface & Background

| Token | Light | Dark | Source | Example |
|---|---|---|---|---|
| `--surface-elevated` | `#F7F9FA` | `#2D2F31` | already tokenized as `--card` | card backgrounds |
| `--surface-subtle` | `#f9fafb` | TBD-dark | kanban board-settings:4 | `.column-row { background }` |
| `--surface-muted` | `#f5f5f5` | TBD-dark | styles.scss:145 (license page) | `.background: #f5f5f5` |
| `--surface-powder` | `#b3d3ea` | `#4c6071` | _table.scss:31/36 | table highlight row bg |
| `--surface-success-light` | `#D4EDDA` | TBD-dark | styles.scss:279 | `.green-background` (already uses `var(--success-light)`) |
| `--surface-error-light` | `#F8D7DA` | TBD-dark | styles.scss:319 | `.red-background` (already uses `var(--error-light)`) |
| `--surface-warning-light` | `#fef3c7` | TBD-dark | timeplanning assigned-site:68 | warning badge bg |
| `--surface-info-light` | `#e3f2fd` | TBD-dark | cms-menu-edit:30 | info highlight bg |
| `--surface-purple-light` | `#f3e5f5` | TBD-dark | license-page:85 | license type bg |
| `--surface-error-row` | `#fef2f2` | TBD-dark | kanban board-reports:26 | `.overdue-item { background }` |
| `--surface-success-badge` | `#d1fae5` | TBD-dark | kanban board-statistics:9 | `.stat-badge.positive { background }` |
| `--surface-error-badge` | `#fee2e2` | TBD-dark | kanban board-statistics:10 | `.stat-badge.negative { background }` |
| `--surface-yellow` | `#e6d178` | `#7e6f3a` | _table.scss:32/37 | table yellow row bg |
| `--surface-red-dark` | `#f5a5a8` | `#f5a5a8` | _table.scss:34 | table red-dark row bg |
| `--surface-red-light-row` | `#f8d7da` | TBD-dark | styles.scss:171 | `.priority-low` bg |
| `--calendar-event-bg` | `rgba(26, 115, 232, 0.08)` | TBD-dark | calendar-week-grid:187 | calendar event highlight |
| `--calendar-column-bg` | `#fafafa` | TBD-dark | calendar-week-grid:4 | calendar week header bg |
| `--kanban-column-bg` | `#f4f5f7` | TBD-dark | board-column:1 | `.column { background }` |
| `--kanban-drag-placeholder` | `#e2e8f0` | TBD-dark | board-view:10 | drag placeholder bg |
| `--tracker-highlight` | `#fff2cc` | TBD-dark | task-tracker-table | tracker row bg |

### Text

| Token | Light | Dark | Source | Example |
|---|---|---|---|---|
| `--text-primary` | `#0F1316` | `#F3F5F7` | already tokenized as `--text-header` | headings |
| `--text-secondary` | `#7F868D` | `#C1C5C9` | already tokenized as `--text-body` | body text |
| `--text-tertiary` | `#6b7280` | TBD-dark | kanban (many), timeplanning assigned-site:5 | secondary labels, meta text |
| `--text-quaternary` | `#9ca3af` | TBD-dark | kanban column-menu:77, board-column:12 | placeholder/hint text |
| `--text-placeholder` | `#B3B9BF` | TBD-dark | styles.scss:363 | `.device-icon { color }`, `.grey-text` |
| `--text-on-dark` | `#374151` | TBD-dark | kanban card:38, gantt:374151 | dark text on light bg |
| `--text-error` | `#DB0D0D` | TBD-dark | styles.scss:323 | `.red-text`, `.red-background .plan-text` |
| `--text-link` | `#0D96DB` | TBD-dark | styles.scss:390 | `.blue-text` |
| `--text-link-alt` | `#1976d2` | `#90caf9` | license-page:81/178 | license link color |
| `--text-calendar-accent` | `#1a73e8` | TBD-dark | calendar-sidebar:18 | calendar today, links |
| `--text-calendar-secondary` | `#5f6368` | TBD-dark | calendar-sidebar:173 | calendar label text |
| `--text-calendar-muted` | `#70757a` | TBD-dark | calendar-week-grid:11 | calendar day label |
| `--text-subheader-link` | `#0275d8` | TBD-dark | eform-new-subheader:16 | subheader breadcrumb link |
| `--text-warning-dark` | `#92400e` | TBD-dark | assigned-site:69 | warning badge text |

### State (hover, pressed, focus, disabled)

| Token | Light | Dark | Source | Example |
|---|---|---|---|---|
| `--state-hover-bg` | `#f3f4f6` | TBD-dark | kanban board-reports:9 | button hover bg |
| `--state-active-bg` | `#3b82f6` | TBD-dark | kanban board-reports:8 | `.active { background }` |
| `--state-focus-ring` | `#3b82f6` | TBD-dark | kanban column-menu:30 | input focus border |
| `--state-highlight-yellow` | `#fbc02d` | TBD-dark | time-plannings-table:43 | highlight outline |
| `--state-highlight-overlay` | `rgba(255, 249, 196, 0.5)` | TBD-dark | time-plannings-table:45 | yellow highlight inset |
| `--state-scrollbar-thumb` | `#999999` | same | styles.scss:41 | scrollbar thumb |

### Border & Divider

| Token | Light | Dark | Source | Example |
|---|---|---|---|---|
| `--border-primary` | `#e2e6e9` | `#37383A` | already tokenized as `--border` | main border |
| `--border-secondary` | `#e5e7eb` | TBD-dark | kanban (many), timeplanning assigned-site:29 | secondary borders |
| `--border-muted` | `#e0e0e0` | TBD-dark | cms-menu-edit:2, backendconfig calendar (many) | subtle borders |
| `--border-lighter` | `#EBEFF2` | `#2B2B2B` | already tokenized as `--tp-border` | table borders |
| `--border-dashed` | `#d1d5db` | TBD-dark | kanban board-view:28, assigned-site:62 | dashed drop-zone borders |
| `--border-drag` | `#94a3b8` | TBD-dark | kanban board-view:12, board-column:7 | drag placeholder border |
| `--border-separator` | `#edeff3` | TBD-dark | assigned-site:7, property-worker-create:50 | section separator |
| `--border-calendar` | `#dadce0` | TBD-dark | calendar-week-grid:25 (approx) | calendar grid border |
| `--border-input` | `#dee2e6` | TBD-dark | version-history-modal:46 | input/panel border |

### Status (error, warning, success, info)

| Token | Light | Dark | Source | Example |
|---|---|---|---|---|
| `--status-active-bg` | `#4caf50` | TBD-dark | styles.scss:133 | `.status-active { background }` |
| `--status-inactive-bg` | `#f44336` | TBD-dark | styles.scss:138 | `.status-inactive { background }` |
| `--status-success` | `#319C4C` | TBD-dark | styles.scss:403 | progress circle gradient |
| `--status-error-icon` | `#d32f2f` | TBD-dark | styles.scss:445 | red warning icon |
| `--status-error-text` | `#DB0D0D` | TBD-dark | styles.scss:386 | `.red-text` |
| `--status-error-strong` | `#a71d2a` | TBD-dark | styles.scss:156 | `.priority-urgent { background }` |
| `--status-error-calendar` | `#ea4335` | TBD-dark | calendar-day-column:49 | calendar error marker |
| `--status-warning-orange` | `#ff9800` | TBD-dark | absence-requests-table:7 | pending status icon |
| `--status-success-icon` | `#4caf50` | TBD-dark | absence-requests-table:12 | approved status icon |
| `--status-error-reject` | `#f44336` | TBD-dark | absence-requests-table:17 | rejected status icon |
| `--status-danger-high` | `#dc3545` | TBD-dark | styles.scss:161 | `.priority-high { background }` |
| `--status-danger-medium` | `#f5a5a8` | TBD-dark | styles.scss:166 | `.priority-medium { background }` |
| `--status-danger-low` | `#f8d7da` | TBD-dark | styles.scss:171 | `.priority-low { background }` |
| `--status-safe` | `#a3d7b1` | TBD-dark | styles.scss:151 | `.priority-green { background }` |
| `--status-kanban-positive` | `#10b981` | TBD-dark | kanban board-list:10b981 | positive trend color |
| `--status-kanban-negative` | `#ef4444` | TBD-dark | kanban board-reports:19 | negative trend / danger |
| `--status-kanban-positive-bg` | `#059669` | TBD-dark | kanban board-statistics:9 | positive badge text |
| `--status-kanban-negative-bg` | `#dc2626` | TBD-dark | kanban board-statistics:10 | negative badge text |
| `--status-tracker-blue` | `#1e88e5` | TBD-dark | task-tracker-table | tracker status icon |
| `--status-tracker-yellow` | `#fada22` | TBD-dark | task-tracker-table | tracker warning |
| `--status-bar-0` | `#bdbdbd` | same | status-bar-compact:2 | case status 0 |
| `--status-bar-33` | `#757575` | same | status-bar-compact:3 | case status 33 |
| `--status-bar-66` | `#ffbb33` | same | status-bar-compact:4 | case status 66 |
| `--status-bar-70` | `#ff8800` | same | status-bar-compact:5 | case status 70 |
| `--status-bar-77` | `#0099cc` | same | status-bar-compact:6 | case status 77 |
| `--status-bar-100` | `#007e33` | same | status-bar-compact:7 | case status 100 |
| `--status-bar-110` | `#d50000` | same | status-bar-compact:8 | case status 110 |
| `--status-bar-track` | `#e9ecef` | same | status-bar-compact:16 | progress bar track |

### Misc Colors (plugin-specific, not shared enough for global tokens)

| Color | Source | Context |
|---|---|---|
| `#085293` | backendconfig file-drop-zone:3 | drop zone text |
| `#948efb` | backendconfig file-drop-zone:7 | drop zone hover |
| `#1558b0` | calendar-mini-calendar | calendar today circle dark |
| `#3c4043` | task-preview-modal | modal text |
| `#c62828` | license-page:141 | error license |
| `#ef5350` | license-page:204, task-create-edit-modal | delete/error |
| `#ce93d8` | license-page:183 | purple (dark theme license) |
| `#7b1fa2` | license-page:86 | purple license type |
| `#5b21b6` | kanban card | purple badge text |
| `#1e40af` | kanban card | blue badge text |
| `#991b1b` | kanban card | red badge text |
| `#dbeafe` | kanban card | blue badge bg |
| `#ede9fe` | kanban card | purple badge bg |
| `#f0f0f0` | calendar-day-column:41 | calendar allday bg |
| `#007bff` | version-history-modal:101 | link color |
| `#666` | cms-header:43, pay-day-rule-list:26 | muted text |
| `#333` | backendconfig property-worker:27, calendar-sidebar | dark text |
| `#ccc` | calendar-mini-calendar, schedule-view:30 | light border |
| `#888` | calendar-sidebar:147, schedule-view:7 | muted text |
| `#555` | calendar-sidebar:144 | secondary text |
| `#444` | calendar-schedule-view:18 | date header text |
| `#9e9e9e` | calendar-sidebar:40 | checkbox border |
| `#721c24` | break-policy-rule-form:21 | error text |
| `#f5c6cb` | break-policy-rule-form:17 | error border |
| `#f8f9fa` | version-history-modal:34 | header bg |
| `#6c757d` | version-history-modal:77 | muted text |
| `#ddd` | basecustomer import:11 | table border |
| `#FFFFFF` | dashboard chart (4 plugins) | chart background |

## Typography

| Token | Value | Dark | Source | Example |
|---|---|---|---|---|
| `--font-family` | `"Nunito Sans", Roboto, "Helvetica Neue", sans-serif` | same | already tokenized in :root | global font |
| `--font-size-base` | `14px` | same | styles.scss:10 | `html, body { font-size }` |
| `--font-size-body` | `16px` | same | theme.scss body-1 | body text size |
| `--font-size-table-header` | `12.8px` | same | theme.scss subtitle-2 | table header text |
| `--font-size-button` | `14px` | same | theme.scss button level | button text |
| `--font-size-plan-title` | `20px` | same | styles.scss:370 | `.neutral-icon { font-size }` |
| `--font-size-plan-warning` | `17px` | same | styles.scss:417 | `.red-warning-avatar-icon { font-size }` |
| `--font-weight-light` | `200` | same | styles.scss:369 | icon font-weight |
| `--font-weight-normal` | `300` | same | theme.scss (all levels) | default body weight |
| `--font-weight-medium` | `500` | same | styles.scss:21, 1029, 1050 | `b, strong`, card titles |
| `--font-weight-semibold` | `600` | same | styles.scss:580, 647, 676... | table headers, labels |
| `--font-weight-bold` | `700` | same | styles.scss:1257, 1499 | emphasis text |

## Shape (border-radius)

| Token | Value | Dark | Source | Example |
|---|---|---|---|---|
| `--radius-sm` | `4px` | same | styles.scss:616, 791, 892, 1565 | chip, input, card corners |
| `--radius-md` | `6px` | same | kanban board-reports:6 | report filter buttons |
| `--radius-lg` | `8px` | same | kanban board-view:11, board-column:1 | kanban cards, columns |
| `--radius-xl` | `20px` | same | theme.scss:230-243 | all buttons, FABs, dialogs |
| `--radius-full` | `50%` | same | styles.scss:401, 435 | avatar circles, dots |
| `--radius-dialog` | `20px` | same | theme.scss:216 | `container-shape: 20px` |
| `--radius-rounded-full` | `9999px` | same | already tokenized as `--rounded-full` | pill shapes |
| `--radius-checkbox` | `0.125em` | same | _checkbox-material:13 | checkbox corners |
| `--radius-tag` | `18px` | same | _tag.scss:17 | `border-radius: $icon-size` |

## Sizing (heights, widths)

| Token | Value | Dark | Source | Example |
|---|---|---|---|---|
| `--icon-btn-size` | `28px` | same | theme.scss:178-179 | `.mat-mdc-icon-button { width, height }` |
| `--icon-size` | `18px` | same | _variables.scss:27 | `$icon-size` |
| `--calendar-btn-size` | `40px` | same | theme.scss:181 | calendar nav button size |
| `--progress-circle-size` | `50px` | same | styles.scss:399-400 | `.progress-circle { width, height }` |
| `--progress-avatar-size` | `35px` | same | styles.scss:460-461 | `.progress-circle .avatar { width, height }` |
| `--warning-icon-size` | `19px` | same | styles.scss:427-428 | `mat-icon.red-warning-avatar-icon` |
| `--kanban-column-width` | `280px` | same | board-column:1 | `.column { min-width, max-width }` |
| `--card-detail-panel-width` | `480px` | same | card-detail-dialog:2 | side panel width |
| `--scrollbar-size` | `8px` | same | styles.scss:34-35 | scrollbar width/height |

## Spacing (padding, margin, gap)

| Token | Value | Dark | Source | Example |
|---|---|---|---|---|
| `--spacing-xs` | `4px` | same | styles.scss:471-472 | progress container padding |
| `--spacing-sm` | `5px` | same | styles.scss:198, 477 | plan-content padding |
| `--spacing-md` | `8px` | same | theme.scss:184, 201 | calendar btn padding, plan-icons gap |
| `--spacing-lg` | `12px` | same | kanban board-reports:6 | report filter padding |
| `--spacing-xl` | `16px` | same | kanban board-statistics:4 | summary padding |
| `--spacing-2xl` | `20px` | same | theme.scss:218-219 | dialog actions padding |
| `--chip-padding-top` | `3px` | same | theme.scss:168 | `.mdc-evolution-chip__action { padding-top }` |

## Elevation (box-shadow)

| Token | Light | Dark | Source | Example |
|---|---|---|---|---|
| `--elevation-card` | `0 4px 20px 0 rgba(0, 0, 0, 0.10)` | TBD-dark | styles.scss:1103 | card shadow |
| `--elevation-panel` | `0 0 20px 0 rgba(0, 0, 0, 0.05)` | TBD-dark | styles.scss:1410, 1416 | side panel shadow |
| `--elevation-dropdown` | `0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)` | same | _material-dropdown:184 | dropdown menu shadow |
| `--elevation-dropdown-up` | `0 -5px 5px -3px rgba(0,0,0,.2), 0 -8px 10px 1px rgba(0,0,0,.14), 0 -3px 14px 2px rgba(0,0,0,.12)` | same | _material-dropdown:188 | dropdown up shadow |
| `--elevation-scrollbar` | `inset 0 0 6px rgba(0, 0, 0, 0.1)` | same | styles.scss:40 | scrollbar track/thumb shadow |
| `--elevation-detail-panel` | `-4px 0 24px rgba(0,0,0,0.15)` | TBD-dark | card-detail-dialog:2 | kanban detail panel |
| `--elevation-calendar-event` | `0 2px 6px rgba(0, 0, 0, 0.25)` | TBD-dark | calendar-week-grid:165 | calendar event popover |
| `--elevation-calendar-modal` | `0 8px 28px rgba(0, 0, 0, 0.28)` | TBD-dark | task-create-edit-modal:5 | calendar task modal |
| `--elevation-hover` | `0 4px 12px rgba(0, 0, 0, 0.15)` | TBD-dark | kanban board-list:4 | board card hover |

## Plugin Coverage

| Plugin | .scss files | Unique hardcoded values |
|---|---|---|
| eform-angular-appointment-plugin | 6 | 0 |
| eform-angular-basecustomer-plugin | 7 | 1 |
| eform-angular-chemical-plugin | 8 | 0 |
| eform-angular-eform-dashboard-plugin | 16 | 2 |
| eform-angular-greate-belt-plugin | 2 | 0 |
| eform-angular-insight-dashboard-plugin | 24 | 2 |
| eform-angular-inventory-plugin | 28 | 0 |
| eform-angular-items-planning-plugin | 14 | 0 |
| eform-angular-monitoring-plugin | 4 | 0 |
| eform-angular-outer-inner-resource-plugin | 12 | 0 |
| eform-angular-rentableitem-plugin | 17 | 0 |
| eform-angular-sportfederation-plugin | 0 | 0 |
| eform-angular-timeplanning-plugin | 37 | 62 |
| eform-angular-trash-inspection-plugin | 21 | 0 |
| eform-angular-workflow-plugin | 7 | 0 |
| eform-angular-work-orders-plugin | 7 | 0 |
| eform-backendconfiguration-plugin | 91 | 78 |
| eform-kanban-plugin | 21 | 98 |
| **Host app (eform-angular-frontend)** | **191** | **~120** |
| **TOTAL** | **513** | **~363** |

## Summary

- **Total unique visual values found**: ~120 unique colors + ~15 sizing/shape + ~9 elevation + ~12 typography = **~156 unique values**
- **Already tokenized as CSS custom properties**: 21 (the `--primary`, `--border`, `--text-header`, etc. in styles.scss)
- **New tokens proposed**: ~135
- **Biggest offenders** (most hardcoded values): kanban-plugin (98), backendconfiguration-plugin (78), timeplanning-plugin (62), host app (~120)
- **Colors needing dark-mode values (TBD-dark)**: ~50 colors. Many are Tailwind palette colors used in kanban/timeplanning that have no dark counterparts defined.
- **Most repeated un-tokenized color**: `#6b7280` (Tailwind gray-500) appears across kanban, timeplanning, and backendconfiguration -- should become `--text-tertiary`.
- **Most repeated un-tokenized border**: `#e5e7eb` (Tailwind gray-200) appears across kanban, timeplanning, backendconfiguration -- should become `--border-secondary`.
