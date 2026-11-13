// One derivation for the stored mode, shared by the localStorage mirror (read by the pre-boot script in
// index.html) and selectThemeMode, so the first paint and Angular can never disagree.
// Blobs saved before the mode existed carry only the darkTheme bool: derive from it so nobody's appearance
// changes on upgrade. 'system' only when neither field is present. The === false check is strict on purpose.
export type DerivedThemeMode = 'system' | 'light' | 'dark';

export function deriveThemeMode(
  user: { themeMode?: string | null; darkTheme?: boolean | null } | null | undefined
): DerivedThemeMode {
  const mode = user?.themeMode;
  if (mode === 'system' || mode === 'light' || mode === 'dark') {
    return mode;
  }
  if (user?.darkTheme === true) {
    return 'dark';
  }
  if (user?.darkTheme === false) {
    return 'light';
  }
  return 'system';
}
