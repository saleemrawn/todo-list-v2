import { lightFormat } from "date-fns";
import { projectsCollection } from "./projectsCollection.js";
import { addPageTitleToDOM, addTaskToDOM, resetContentContainer, setPageType } from "./domController.js";
import { updateSelectedPage } from "./domController.js";

export default function loadUpcoming() {
  const projects = projectsCollection.getProjects();
  const todayDate = lightFormat(new Date(), "yyyy-MM-dd");

  resetContentContainer();
  setPageType("upcoming");
  addPageTitleToDOM("upcoming");
  updateSelectedPage();

  for (const project of projects) {
    for (const task of project.taskList) {
      if (todayDate < task.dueDate) {
        addTaskToDOM(project, task);
      }
    }
  }
}
