import { lightFormat } from "date-fns";

export function findParentElement(element, selector) {
  while ((element = element.parentElement) && !element.matches(selector));
  return element;
}

export function getFormattedDate(date) {
  if (date === "") {
    return "--/--/----";
  }

  const timestamp = new Date(date);
  return lightFormat(timestamp, "dd/MM/yyyy");
}

export function getFormattedDatePicker(date) {
  if (date === "") {
    return;
  }

  const timestamp = new Date(date);
  return lightFormat(timestamp, "yyyy-MM-dd");
}

export function getTodayTimestamp() {
  const date = new Date();
  return Date.parse(lightFormat(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, "yyyy-MM-dd"));
}
