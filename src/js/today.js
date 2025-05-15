import { getAllTasks, sortTasksByDueDateAsc } from "./projectsCollection.js";
import {
  addPageTitleToDOM,
  addTaskToDOM,
  removeProjectID,
  resetContentContainer,
  setPageType,
} from "./domController.js";
import { getTodayTimestamp } from "./helpers.js";

export default function loadToday() {
  const tasks = getAllTasks();
  const todayDate = getTodayTimestamp();

  resetContentContainer();
  setPageType("today");
  removeProjectID("#content");
  addPageTitleToDOM("today");
  sortTasksByDueDateAsc(tasks);

  for (const task of tasks) {
    if (todayDate >= task.dueDate) {
      addTaskToDOM(task);
    }
  }
}
