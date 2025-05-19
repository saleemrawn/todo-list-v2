import { getAllTasks, sortTasksByDueDateAsc } from "./projectsCollection.js";
import {
  addPageTitleToDOM,
  addTaskToDOM,
  removeProjectID,
  resetContentContainer,
  setPageType,
} from "./domController.js";
import { getTodayTimestamp } from "./helpers.js";

export default function loadUpcoming() {
  const tasks = getAllTasks();
  const todayDate = getTodayTimestamp();

  resetContentContainer();
  setPageType("upcoming");
  removeProjectID("#content");
  addPageTitleToDOM("upcoming");
  sortTasksByDueDateAsc(tasks);

  for (const task of tasks) {
    if (todayDate < task.getDueDate()) {
      addTaskToDOM(task);
    }
  }
}
