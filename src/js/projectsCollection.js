import Project from "./project.js";

export const projectsCollection = (function () {
  const _projects = [];

  const addProject = (project) => {
    if (typeof project !== "object") {
      throw new Error(`Invalid argument: expected type 'object', but received type '${typeof project}'.`);
    }

    _projects.push(project);
  };

  const removeProject = (projectId) => {
    const index = _projects.findIndex((project) => project.id === projectId);
    if (index !== -1) {
      _projects.splice(index, 1);
    }
  };

  const getProjects = () => {
    return _projects;
  };

  const getProjectsCount = () => {
    return _projects.length;
  };

  return {
    addProject,
    removeProject,
    getProjects,
    getProjectsCount,
  };
})();

export function getProjectName(id) {
  const projects = projectsCollection.getProjects();

  for (const project of projects) {
    if (id === project.id) {
      return project.projectName;
    }
  }
}

export function getAllTasks() {
  const projects = projectsCollection.getProjects();
  const tasks = [];

  for (const project of projects) {
    for (const task of project.taskList) {
      tasks.push(task);
    }
  }

  return tasks;
}

export function setProjectObjPrototype() {
  const projects = projectsCollection.getProjects();
  projects.forEach((project) => {
    Object.setPrototypeOf(project, Project.prototype);
  });
}

export function sortTasksByDueDateAsc(tasks) {
  tasks.sort((a, b) => a.dueDate - b.dueDate);
}

export function sortTasksByDueDateDesc(tasks) {
  tasks.sort((a, b) => b.dueDate - a.dueDate);
}
