export function debounce(func: Function, wait: number, immediate?: boolean) {
  let timeout: NodeJS.Timeout | null;
  return function (this: any) {
    const args = arguments;
    const later = function (this: any) {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}
