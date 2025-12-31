export function formatPercentage(value) {
  if (Number.isNaN(value)) return '0%';
  return `${value.toFixed(1)}%`;
}

export function formatSeconds(value) {
  return `${value.toFixed(1)}s`;
}
