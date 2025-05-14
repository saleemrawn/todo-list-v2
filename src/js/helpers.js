import { lightFormat } from "date-fns";

export function findParentElement(element, selector) {
  while ((element = element.parentElement) && !element.matches(selector));
  return element;
}

export function getFormattedDate(date) {
  const timestamp = new Date(date);
  return lightFormat(timestamp, "dd/MM/yyyy");
}
