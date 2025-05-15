import { projectsCollection, sortTasksByDueDateAsc } from "./projectsCollection.js";
import {
  addPageTitleToDOM,
  addPageDescriptionToDOM,
  addProjectActionButtonsToDOM,
  addTaskToDOM,
  resetContentContainer,
  setPageType,
  setProjectID,
} from "./domController.js";
import { updateSelectedPage } from "./domController.js";

export default function loadProject(id) {
  const projects = projectsCollection.getProjects();

  resetContentContainer();
  updateSelectedPage();

  for (const project of projects) {
    if (project.id === id) {
      setPageType("project");
      setProjectID("#content", project.id);
      addPageTitleToDOM(project.projectName.toLowerCase());
      addPageDescriptionToDOM(project.description);
      addProjectActionButtonsToDOM();
      sortTasksByDueDateAsc(project.taskList);
      for (const task of project.taskList) {
        addTaskToDOM(task);
      }
    }
  }
}
