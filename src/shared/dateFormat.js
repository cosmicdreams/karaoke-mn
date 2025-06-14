export function formatDate(date, options) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleString(undefined, options);
}
