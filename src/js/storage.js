import { projectsCollection } from "./projectsCollection.js";

export function addProjectToStorage(projectID, project) {
  localStorage.setItem(projectID, JSON.stringify(project));
}

export function deleteProjectFromStorage(projectID) {
  localStorage.removeItem(String(projectID));
}

export function loadProjectsFromStorage() {
  Object.values(window.localStorage).forEach((project) => {
    projectsCollection.addProject(JSON.parse(project));
  });
}
