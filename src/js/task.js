export default class Task {
  constructor({ name, description = "", dueDate = "", priority = 0, notes = "" }) {
    this.id = crypto.randomUUID();
    this.dateCreated = Date.now();
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.notes = notes;
  }
}
