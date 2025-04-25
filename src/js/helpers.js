export function getPriorityName(val) {
  if (val === "0") {
    return "Low";
  }

  if (val === "1") {
    return "Medium";
  }

  if (val === "2") {
    return "High";
  }
}
