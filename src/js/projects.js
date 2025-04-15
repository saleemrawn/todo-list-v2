const projects = [];

export function createProject(name) {
  const _id = crypto.randomUUID();
  let _projectName = name;
  let _description = "";
  let _totalTasks = 0;
  let _todoList = [];

  const incrementTotalTasks = () => _totalTasks++;
  const decrementTotalTasks = () => _totalTasks--;
  const addTask = (task = {}) => {
    if (typeof task !== "object") {
      throw new Error(`Invalid argument: expected type 'object', but received type '${typeof task}'.`);
    }

    _todoList.push(task);
    incrementTotalTasks();
  };

  const removeTask = (taskId) => {
    const index = _todoList.findIndex((task) => task.id === taskId);
    if (index !== -1) {
      _todoList.splice(index, 1);
      decrementTotalTasks();
    }
  };

  return {
    get id() {
      return _id;
    },

    get projectName() {
      return _projectName;
    },

    get description() {
      return _description;
    },

    get totalTasks() {
      return _totalTasks;
    },

    get todoList() {
      return _todoList;
    },

    set projectName(name) {
      _projectName = String(name);
    },

    set description(text) {
      _description = String(text);
    },

    incrementTotalTasks,
    decrementTotalTasks,
    addTask,
    removeTask,
  };
}

export function addProject(project) {
  if (typeof project !== "object") {
    throw new Error(`Invalid argument: expected 'object', but received '${typeof project}'.`);
  }

  projects.push(project);
}

export function removeProject(id) {
  const index = projects.findIndex((project) => project.id === id);
  if (index !== -1) {
    projects.splice(index, 1);
    decrementTotalTasks();
  }
}

export function getProjects() {
  return projects;
}
