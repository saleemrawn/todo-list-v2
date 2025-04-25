export default class Task {
  constructor({ name, projectID = "", description = "", dueDate = "", priority = 0, notes = "" }) {
    this.taskID = crypto.randomUUID();
    this.projectID = projectID;
    this.dateCreated = Date.now();
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
  }
}
