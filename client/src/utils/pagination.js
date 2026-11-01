// Page numbers to show in a pager: always the first and last pages, the
// current page with `siblings` pages around it, and "gap" markers between.
export function getPageItems(currentPage, totalPages, siblings = 1) {
  if (totalPages <= 1) return [];

  const pages = new Set([1, totalPages]);
  for (
    let page = Math.max(1, currentPage - siblings);
    page <= Math.min(totalPages, currentPage + siblings);
    page += 1
  ) {
    pages.add(page);
  }

  const items = [];
  let previous = 0;
  for (const page of [...pages].sort((a, b) => a - b)) {
    if (page - previous === 2) items.push(previous + 1);
    else if (page - previous > 2) items.push(`gap-${page}`);
    items.push(page);
    previous = page;
  }
  return items;
}
