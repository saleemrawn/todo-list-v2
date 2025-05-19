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
    if (project.getID() === id) {
      setPageType("project");
      setProjectID("#content", project.getID());
      addPageTitleToDOM(project.projectName.toLowerCase());
      addPageDescriptionToDOM(project.description);
      addProjectActionButtonsToDOM();
      sortTasksByDueDateAsc(project.getTasks());
      for (const task of project.getTasks()) {
        addTaskToDOM(task);
      }
    }
  }
}
