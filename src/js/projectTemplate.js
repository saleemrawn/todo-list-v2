import { projectsCollection } from "./projectsCollection.js";
import {
  addPageTitleToDOM,
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
      addProjectActionButtonsToDOM();
      for (const task of project.taskList) {
        addTaskToDOM(project, task);
      }
    }
  }
}
