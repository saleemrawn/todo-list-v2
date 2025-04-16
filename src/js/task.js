export default class Task {
  #id;
  #name;
  #description;
  #dueDate;
  #priority;
  #notes;

  constructor({ name, description = "", dueDate = "", priority = 0, notes = "" }) {
    this.#id = crypto.randomUUID();
    this.#name = name;
    this.#description = description;
    this.#dueDate = dueDate;
    this.#priority = priority;
    this.#notes = notes;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  get description() {
    return this.#description;
  }

  get dueDate() {
    return this.#dueDate;
  }

  get priority() {
    return this.#priority;
  }

  get notes() {
    return this.#notes;
  }

  set name(name) {
    this.#name = String(name);
  }

  set description(text) {
    this.#description = String(text);
  }

  set dueDate(date) {
    this.#dueDate = date;
  }

  set priority(level) {
    if (typeof level !== "number" || level < 0 || level > 2) {
      throw new Error(
        `Invalid argument: Expected a type 'number' between 0 to 3, received ${level} of type '${typeof level}'.`
      );
    }

    this.#priority = level;
  }

  set notes(text) {
    this.#notes = String(text);
  }
}
