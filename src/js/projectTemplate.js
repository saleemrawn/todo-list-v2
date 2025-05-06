import { projectsCollection } from "./projectsCollection.js";
import { addPageTitleToDOM, addTaskToDOM, resetContentContainer, setPageType } from "./domController.js";
import { updateSelectedPage } from "./domController.js";

export default function loadProject(id) {
  const projects = projectsCollection.getProjects();

  resetContentContainer();
  updateSelectedPage();

  for (const project of projects) {
    if (project.id === id) {
      setPageType("project");
      addPageTitleToDOM(project.projectName.toLowerCase());
      for (const task of project.taskList) {
        addTaskToDOM(project, task);
      }
    }
  }
}
