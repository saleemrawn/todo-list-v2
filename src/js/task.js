export default class Task {
  constructor({ name, projectID = "", description = "", dueDate = "", priority = 0, completed = false }) {
    this.taskID = crypto.randomUUID();
    this.projectID = projectID;
    this.dateCreated = Date.now();
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
  }

  getID() {
    return this.taskID;
  }

  getName() {
    return this.name;
  }

  getDescription() {
    return this.description;
  }

  getDueDate() {
    return this.dueDate;
  }
}
