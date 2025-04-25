import { lightFormat } from "date-fns";
import { projectsCollection } from "./projectsCollection.js";
import { addPageTitleToDOM, addTaskToDOM, resetContentContainer } from "./domController.js";

export default function loadToday() {
  const projects = projectsCollection.getProjects();
  const todayDate = lightFormat(new Date(), "yyyy-MM-dd");

  resetContentContainer();
  addPageTitleToDOM("Today");

  for (const project of projects) {
    for (const task of project.taskList) {
      if (todayDate >= task.dueDate) {
        addTaskToDOM(project, task);
      }
    }
  }
}
