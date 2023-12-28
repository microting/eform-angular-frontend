export function arrayToggle<T>(arr: T[], val: T, forced?: boolean): T[] {
  if (forced && arr.includes(val)) {
    return [...arr];
  } else if (forced === false || arr.includes(val)) {
    return arr.filter((v: typeof val) => v !== val);
  }
  return [...arr, val];
}
