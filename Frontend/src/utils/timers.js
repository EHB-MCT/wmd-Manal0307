export function startTimer() {
  return performance.now();
}

export function getElapsedSeconds(startTime) {
  return Math.round((performance.now() - startTime) / 10) / 100;
}
