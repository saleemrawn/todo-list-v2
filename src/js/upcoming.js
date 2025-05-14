import { projectsCollection, sortTasksByDueDateAsc } from "./projectsCollection.js";
import { addPageTitleToDOM, addTaskToDOM, resetContentContainer, setPageType } from "./domController.js";
import { getTodayTimestamp } from "./helpers.js";

export default function loadUpcoming() {
  const projects = projectsCollection.getProjects();
  const todayDate = getTodayTimestamp();

  resetContentContainer();
  setPageType("upcoming");
  addPageTitleToDOM("upcoming");

  for (const project of projects) {
    sortTasksByDueDateAsc(project);
    for (const task of project.taskList) {
      if (todayDate < task.dueDate) {
        addTaskToDOM(project, task);
      }
    }
  }
}
