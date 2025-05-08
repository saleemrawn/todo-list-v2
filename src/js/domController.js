import { lightFormat } from "date-fns";
import { projectsCollection } from "./projectsCollection.js";
import loadToday from "./today.js";
import loadUpcoming from "./upcoming.js";
import loadProject from "./projectTemplate.js";

export function addTaskToDOM(project, task) {
  const content = document.querySelector("#content");

  content.insertAdjacentHTML(
    "beforeend",
    `
      <div class="task-card" data-task-id="${task.taskID}" data-project-id="${project.id}">
        <div class="task-card-details">
            <div class="task-card-name-date-container">
              <p class="task-card-name">${task.name}</p>
              <p class="task-card-date">${lightFormat(task.dueDate, "dd/MM/yyyy")}</p>
            </div>
            <div class="task-card-priority-pill" data-priority="${task.priority}">
              <p class="task-card-priority">${getPriorityName(task.priority)}</p>
            </div>
            <button class="task-edit-button">Edit</button>
        </div>
      </div>
    `
  );

  setPriorityColours();
}

export function addPageTitleToDOM(title) {
  const content = document.querySelector("#content");
  content.insertAdjacentHTML(
    "beforeend",
    `
    <div class="page-title-container">
      <h2>${title}</h2>
    </div>
    `
  );
}

export function addProjectActionButtonsToDOM() {
  const container = document.querySelector(".page-title-container");
  container.insertAdjacentHTML(
    "beforeend",
    `
      <div class="project-action-buttons">
        <button class="edit-project secondary" title="Edit Project"></button>
        <button class="delete-project secondary" title="Delete Project"></button>
      </div>
    `
  );
}

export function addProjectButtonsToDOM(container) {
  const projects = projectsCollection.getProjects();

  projects.forEach((project) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <button class="project-button secondary" data-project-id="${project.id}">${project.projectName}</button>
      `
    );
  });
}

export function resetContentContainer() {
  const content = document.querySelector("#content");
  content.innerHTML = "";
}

export function loadProjectsToDropdown() {
  const projects = projectsCollection.getProjects();
  const dropdown = document.querySelector("#task-project");

  dropdown.innerHTML = "";

  for (const project of projects) {
    dropdown.insertAdjacentHTML("beforeend", `<option value="${project.id}">${project.projectName}</option>`);
  }
}

export function reloadPage(projectID) {
  const content = document.querySelector("#content");

  if (content.getAttribute("data-page") === "today") loadToday();
  if (content.getAttribute("data-page") === "upcoming") loadUpcoming();
  if (content.getAttribute("data-page") === "project") loadProject(projectID);
}

export function setPageType(type) {
  const content = document.querySelector("#content");
  content.setAttribute("data-page", `${type}`);
}

export function setProjectID(selector, id) {
  const container = document.querySelector(selector);
  container.setAttribute("data-project-id", `${id}`);
}

export function updateSelectedPage(button) {
  const appButtons = document.querySelectorAll(".app-buttons button");

  appButtons.forEach((button) => button.classList.remove("selected"));
  button?.target.classList.add("selected");
}

export function setProjectSelectedPage(projectID) {
  const button = document.querySelector(`button[data-project-id="${projectID}"]`);
  button.classList.add("selected");
}

export function resetAddTaskForm() {
  const form = document.querySelector(".add-task-form");

  form.reset();
  form.elements["taskID"].value = "";
  form.elements["task-due-date"].value = lightFormat(new Date(), "yyyy-MM-dd");
}

export function resetProjectForm() {
  const form = document.querySelector(".new-project-form");

  form.reset();
  form.elements["projectID"].value = "";
}

export function closeDialog(selector) {
  const dialog = document.querySelector(selector);
  dialog?.close();
}

function getPriorityName(val) {
  if (val === "0") {
    return "Low";
  }

  if (val === "1") {
    return "Medium";
  }

  if (val === "2") {
    return "High";
  }
}

function setPriorityColours() {
  const priorityPill = document.querySelectorAll(".task-card-priority-pill");

  priorityPill.forEach((pill) => {
    if (pill.getAttribute("data-priority") === "0") {
      pill.classList.add("low-priority");
    }

    if (pill.getAttribute("data-priority") === "1") {
      pill.classList.add("med-priority");
    }

    if (pill.getAttribute("data-priority") === "2") {
      pill.classList.add("high-priority");
    }
  });
}
