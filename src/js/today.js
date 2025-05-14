import { getAllTasks, sortTasksByDueDateAsc } from "./projectsCollection.js";
import { addPageTitleToDOM, addTaskToDOM, resetContentContainer, setPageType } from "./domController.js";
import { getTodayTimestamp } from "./helpers.js";

export default function loadToday() {
  const tasks = getAllTasks();
  const todayDate = getTodayTimestamp();

  resetContentContainer();
  setPageType("today");
  addPageTitleToDOM("today");
  sortTasksByDueDateAsc(tasks);

  for (const task of tasks) {
    if (todayDate >= task.dueDate) {
      addTaskToDOM(task);
    }
  }
}
