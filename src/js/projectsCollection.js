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
