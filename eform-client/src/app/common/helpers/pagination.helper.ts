export function getOffset(pageSize, offset, total): number {
  const currentPage = Math.floor(offset / pageSize) + 1;
  const totalPages = Math.ceil(Math.max(total, 1) / Math.max(pageSize, 1));
  if (currentPage > totalPages) {
    return offset - pageSize;
  }
  return offset;
}
