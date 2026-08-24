#!/usr/bin/env node
/**
 * Button convention gate.
 *
 * The app has one button system: `.btn-primary` (filled), `.btn-cancel`
 * (outlined secondary), `.btn-delete` (destructive) and `.btn-quiet` (low
 * emphasis), and one order: **cancel first**, then the confirming or
 * destructive action. Angular Material's button directives are NOT part of it — the
 * theme's override targets `.mat-mdc-text-button`, a class Material 20 never
 * emits, so `mat-button` silently renders as a pill in the wrong colour.
 *
 * This script fails the build when a dialog action row uses anything else, and
 * when a template references a class that no stylesheet defines.
 *
 * Usage:  node scripts/check-button-conventions.js [rootDir ...]
 * Default root: src/app
 *
 * SCOPE — read this before trusting a green run. `src/app/plugins/` is
 * gitignored in this repo (the plugin modules are owned by their own repos and
 * copied in by devinstall), so a CI checkout here contains ONLY the core app:
 * this gate protects ~173 templates, not the whole platform. Locally, where the
 * plugin tree is present on disk, the same command does cover it.
 *
 * Each plugin repo therefore has to run this itself. Their CI already checks
 * out this frontend and copies their module into it, so the step is:
 *
 *   node eform-angular-frontend/eform-client/scripts/check-button-conventions.js \
 *     eform-angular-frontend/eform-client/src/app/plugins/modules/<name>
 *
 * Until that is wired up per plugin, a plugin can reintroduce a bare
 * `mat-button` with no CI signal.
 */

const fs = require('fs');
const path = require('path');

const APPROVED_CLASSES = ['btn-primary', 'btn-cancel', 'btn-delete', 'btn-quiet'];

// Material button directives. Present on an action button, these bypass the
// design system entirely.
//
// Both spellings are listed on purpose. Material 20 accepts the legacy
// hyphenated attributes AND a modern camelCase form — button.mjs declares
// `button[matButton], a[matButton]` (appearance chosen via matButton="filled"
// etc.) alongside `button[mat-button]`. Banning only the hyphenated set would
// leave `<button matButton>` sailing through the very check that exists to
// catch it.
const MATERIAL_BUTTON_ATTRS = [
  'mat-button',
  'mat-raised-button',
  'mat-flat-button',
  'mat-stroked-button',
  'mat-fab',
  'mat-mini-fab',
  'matButton',
  'matFab',
  'matMiniFab',
  'mdbBtn',
];

// Icon-only triggers are not action buttons; both spellings are excluded.
const ICON_BUTTON_ATTRS = ['mat-icon-button', 'matIconButton'];

// Classes referenced by templates but defined by no stylesheet in the repo —
// they render as unstyled browser buttons.
const UNDEFINED_CLASSES = [
  'btn-success',
  'btn-accent',
  'btn-small-height',
  'btn-block',
  'text-black-50',
];

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/**
 * Quote-aware tag scanner. A naive /<[^>]*>/ regex breaks on Angular bindings
 * such as [disabled]="a > b", which is common in exactly the buttons we care
 * about, so attribute values are consumed respecting quotes.
 */
function scanTags(html) {
  const tags = [];
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) break;
    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt);
      i = end === -1 ? html.length : end + 3;
      continue;
    }
    let j = lt + 1;
    let quote = null;
    while (j < html.length) {
      const ch = html[j];
      if (quote) {
        if (ch === quote) quote = null;
      } else if (ch === '"' || ch === "'") {
        quote = ch;
      } else if (ch === '>') {
        break;
      }
      j++;
    }
    if (j >= html.length) break;
    const raw = html.slice(lt, j + 1);
    const m = /^<\s*(\/?)\s*([a-zA-Z][\w-]*)/.exec(raw);
    if (m) {
      tags.push({
        raw,
        closing: m[1] === '/',
        name: m[2].toLowerCase(),
        selfClosing: /\/\s*>$/.test(raw) || VOID_ELEMENTS.has(m[2].toLowerCase()),
        start: lt,
      });
    }
    i = j + 1;
  }
  return tags;
}

function lineOf(html, index) {
  return html.slice(0, index).split('\n').length;
}

function attrNames(raw) {
  // Strip the tag name, then pull attribute names, ignoring values.
  const body = raw.replace(/^<\s*\/?\s*[a-zA-Z][\w-]*/, '').replace(/\/?>$/, '');
  const names = [];
  const re = /(^|\s)([@#[(]?[\w-]+[)\]]?)(\s*=\s*("[^"]*"|'[^']*'|\S+))?/g;
  let m;
  while ((m = re.exec(body)) !== null) names.push(m[2]);
  return names;
}

function classesOf(raw) {
  const m = /\sclass\s*=\s*"([^"]*)"/.exec(raw) || /\sclass\s*=\s*'([^']*)'/.exec(raw);
  return m ? m[1].split(/\s+/).filter(Boolean) : [];
}

/**
 * True when the tag opens a dialog action row.
 *
 * `.modal-footer` is included deliberately: it is the hand-rolled footer left
 * behind by the old MDBootstrap dialogs, and being invisible to this check is
 * how one of them ended up contradicting its own sibling on the same screen —
 * workflow's Assign-site dialog led with Cancel while Remove-site trailed it.
 * A row the gate cannot see is a row that drifts.
 */
function opensActionRow(tag) {
  if (tag.closing) return false;
  if (tag.name === 'mat-dialog-actions') return true;
  if (classesOf(tag.raw).includes('modal-footer')) return true;
  return attrNames(tag.raw).includes('mat-dialog-actions');
}

function checkFile(file) {
  const html = fs.readFileSync(file, 'utf8');
  const tags = scanTags(html);
  const violations = [];

  // ---- rule 1: dialog action rows may only contain approved buttons -------
  for (let i = 0; i < tags.length; i++) {
    if (!opensActionRow(tags[i])) continue;
    if (tags[i].selfClosing) continue;

    // Walk forward tracking depth until this row closes.
    const rowButtons = [];
    let depth = 0;
    for (let j = i; j < tags.length; j++) {
      const t = tags[j];
      if (!t.closing && !t.selfClosing) depth++;
      else if (t.closing) depth--;

      if (j > i && !t.closing && (t.name === 'button' || t.name === 'a')) {
        const attrs = attrNames(t.raw);
        const classes = classesOf(t.raw);

        rowButtons.push({ line: lineOf(html, t.start), classes, attrs });

        const material = MATERIAL_BUTTON_ATTRS.filter(a => attrs.includes(a));
        if (material.length) {
          violations.push({
            line: lineOf(html, t.start),
            rule: 'material-button-in-dialog',
            detail: `<${t.name} ${material.join(' ')}> — use ${APPROVED_CLASSES.join(' / ')}`,
          });
        } else if (!classes.some(c => APPROVED_CLASSES.includes(c))) {
          // Icon-only buttons (a lone mat-icon trigger) are not action buttons.
          const isIconButton = ICON_BUTTON_ATTRS.some(a => attrs.includes(a));
          if (!isIconButton) {
            violations.push({
              line: lineOf(html, t.start),
              rule: 'unapproved-dialog-button',
              detail: `<${t.name} class="${classes.join(' ')}"> — expected one of ${APPROVED_CLASSES.join(' / ')}`,
            });
          }
        }
      }

      if (depth === 0) break;
    }

    // ---- rule 3: cancel comes first ------------------------------------
    // A dialog's dismissing action leads; the confirming or destructive one
    // follows. Mixed ordering is the single button inconsistency a user
    // actually notices, because it moves the button under their cursor
    // between one dialog and the next.
    const actions = rowButtons.filter(b =>
      b.classes.some(c => APPROVED_CLASSES.includes(c)) &&
      !ICON_BUTTON_ATTRS.some(a => b.attrs.includes(a))
    );
    const cancelAt = actions.findIndex(b => b.classes.includes('btn-cancel'));
    if (cancelAt > 0) {
      const leading = actions[0].classes.filter(c => APPROVED_CLASSES.includes(c)).join(' ');
      violations.push({
        line: actions[0].line,
        rule: 'cancel-not-first',
        detail: `.${leading} precedes .btn-cancel — cancel leads the row`,
      });
    }
  }

  // ---- rule 2: no references to classes nothing defines -------------------
  for (const tag of tags) {
    if (tag.closing) continue;
    const classes = classesOf(tag.raw);
    const attrs = attrNames(tag.raw);
    const bad = classes.filter(c => UNDEFINED_CLASSES.includes(c));
    for (const c of bad) {
      violations.push({
        line: lineOf(html, tag.start),
        rule: 'undefined-class',
        detail: `class "${c}" is not defined by any stylesheet`,
      });
    }
    if (attrs.includes('mdbBtn')) {
      violations.push({
        line: lineOf(html, tag.start),
        rule: 'mdbootstrap-remnant',
        detail: 'mdbBtn — MDBootstrap is not installed',
      });
    }
  }

  return violations;
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full, out);
    } else if (entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function main() {
  const roots = process.argv.slice(2);
  const targets = roots.length ? roots : ['src/app'];

  const files = [];
  for (const root of targets) {
    if (!fs.existsSync(root)) {
      console.log(`  (skipped: ${root} not present)`);
      continue;
    }
    walk(root, files);
  }

  let total = 0;
  const byRule = {};

  for (const file of files.sort()) {
    const violations = checkFile(file);
    if (!violations.length) continue;
    total += violations.length;
    console.log(`\n${path.relative(process.cwd(), file)}`);
    for (const v of violations.sort((a, b) => a.line - b.line)) {
      byRule[v.rule] = (byRule[v.rule] || 0) + 1;
      console.log(`  ${String(v.line).padStart(4)}  [${v.rule}] ${v.detail}`);
    }
  }

  console.log(`\n${'─'.repeat(72)}`);
  console.log(`Scanned ${files.length} templates in: ${targets.join(', ')}`);

  if (!total) {
    console.log('Button conventions: OK — no violations.');
    process.exit(0);
  }

  console.log(`Button conventions: ${total} violation(s)\n`);
  for (const [rule, n] of Object.entries(byRule).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${rule}`);
  }
  console.log(
    '\nOne button system: .btn-primary (filled), .btn-cancel (outlined),\n' +
    '.btn-delete (destructive), .btn-quiet (low emphasis),\n' +
    'and one order: cancel first, then the confirming action.\n' +
    'Material button directives are not part of it — the theme override targets\n' +
    '.mat-mdc-text-button, which Angular Material 20 does not emit.'
  );
  process.exit(1);
}

main();
