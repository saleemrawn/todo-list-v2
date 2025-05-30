export default class Project {
  constructor({ name, description = "" }) {
    this.id = crypto.randomUUID();
    this.dateCreated = Date.now();
    this.projectName = name;
    this.description = description;
    this.taskList = [];
  }

  getID() {
    return this.id;
  }

  getName() {
    return this.projectName;
  }

  setName(name) {
    this.projectName = String(name);
  }

  getDescription() {
    return this.description;
  }

  setDescription(description) {
    this.description = String(description);
  }

  getTasks() {
    return this.taskList;
  }

  addTask(task = {}) {
    if (typeof task !== "object") {
      throw new Error(`Invalid argument: expected type 'object', but received type '${typeof task}'.`);
    }

    this.taskList.push(task);
  }

  removeTask(taskID) {
    const index = this.taskList.findIndex((task) => task.getID() === taskID);
    if (index !== -1) {
      this.taskList.splice(index, 1);
    }
  }
}
