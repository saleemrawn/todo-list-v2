export default class Project {
  #id;
  #dateCreated;
  #projectName;
  #description;
  #taskList;

  constructor({ name, description = "" }) {
    this.#id = crypto.randomUUID();
    this.#dateCreated = Date.now();
    this.#projectName = name;
    this.#description = description;
    this.#taskList = [];
    this.toJSON = function () {
      return {
        id: this.#id,
        dateCreated: this.#dateCreated,
        name: this.#projectName,
        description: this.#description,
        taskList: this.#taskList,
      };
    };
  }

  get id() {
    return this.#id;
  }

  get dateCreated() {
    return this.#dateCreated;
  }

  get projectName() {
    return this.#projectName;
  }

  get description() {
    return this.#description;
  }

  get taskList() {
    return this.#taskList;
  }

  set projectName(name) {
    this.#projectName = String(name);
  }

  set description(text) {
    this.#description = String(text);
  }

  addTask(task = {}) {
    if (typeof task !== "object") {
      throw new Error(`Invalid argument: expected type 'object', but received type '${typeof task}'.`);
    }

    this.#taskList.push(task);
  }

  removeTask(taskId) {
    const index = this.#taskList.findIndex((task) => task.id === taskId);
    if (index !== -1) {
      this.#taskList.splice(index, 1);
    }
  }
}
