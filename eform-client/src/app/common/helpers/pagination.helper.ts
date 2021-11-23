export function getOffset(pageSize, offset, total): number {
  while (getCurrentPage(pageSize, offset) > getTotalPages(pageSize, total)) {
    offset -= pageSize;
  }
  if (
    getCurrentPage(pageSize, offset) === 1 &&
    getTotalPages(pageSize, total) === 1
  ) {
    offset = 0;
  }
  return offset;
}

function getCurrentPage(pageSize: number, offset: number): number {
  return Math.floor(offset / pageSize) + 1;
}

function getTotalPages(pageSize: number, total: number): number {
  return Math.ceil(Math.max(total, 1) / Math.max(pageSize, 1));
}
