import { projectsCollection } from "./projectsCollection.js";

export function addTaskToProject(projectID, task) {
  if (typeof task !== "object") {
    throw new Error(`Invalid argument: Expected type 'object', received type '${typeof task}'`);
  }

  const projects = projectsCollection.getProjects();

  projects.forEach((project) => {
    if (project.getID() === projectID) {
      project.addTask(task);
    }
  });
}

export function removeTaskFromProject(taskID) {
  const projects = projectsCollection.getProjects();

  for (const project of projects) {
    project.removeTask(taskID);
  }
}
