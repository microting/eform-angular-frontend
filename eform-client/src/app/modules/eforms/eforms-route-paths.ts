/**
 * Paths of the lazy sub-modules under My eForms (the app's '' route).
 * Side-effect free, so the menu editor can check links against them without
 * importing the eForms routing and its components (#8103).
 */
export const eformsChildRoutePaths = {
  docxReport: 'docx-report',
  xlsxReport: 'xlsx-report',
  visualEditor: 'visual-editor',
} as const;
