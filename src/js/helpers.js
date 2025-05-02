export function findParentElement(element, selector) {
  while ((element = element.parentElement) && !element.matches(selector));
  return element;
}
