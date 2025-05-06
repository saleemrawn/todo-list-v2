import { lightFormat } from "date-fns";
import { projectsCollection } from "./projectsCollection.js";
import loadToday from "./today.js";
import loadUpcoming from "./upcoming.js";

export function addTaskToDOM(project, task) {
  const content = document.querySelector("#content");

  content.insertAdjacentHTML(
    "beforeend",
    `
      <div class="task-card" data-task-id="${task.taskID}" data-project-id="${project.id}">
        <p class="task-card-name">${task.name}</p>
        <!-- <p class="task-card-description">${task.description}</p> -->
        <p class="task-card-date">${lightFormat(task.dueDate, "dd/MM/yyyy")}</p>
        <div class="task-card-project-pill">
          <p class="task-card-project">${project.projectName}</p>
        </div>
        <div class="task-card-priority-pill" data-priority="${task.priority}">
          <p class="task-card-priority">${getPriorityName(task.priority)}</p>
        </div>
        <div class="task-card-action-buttons">
          <button class="task-edit-button">Edit</button>
          <button class="task-delete-button">Delete</button>
        </div>
      </div>
    `
  );

  setPriorityColours();
}

export function addPageTitleToDOM(title) {
  const content = document.querySelector("#content");
  content.insertAdjacentHTML("beforeend", `<h2>${title}</h2>`);
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

export function reloadPage() {
  const content = document.querySelector("#content");

  if (content.getAttribute("data-page") === "today") loadToday();
  if (content.getAttribute("data-page") === "upcoming") loadUpcoming();
}

export function setPageType(type) {
  const content = document.querySelector("#content");
  content.setAttribute("data-page", `${type}`);
}

export function updateSelectedPage(button) {
  const appButtons = document.querySelectorAll(".app-buttons button");

  appButtons.forEach((button) => button.classList.remove("selected"));
  button?.target.classList.add("selected");
}

export function resetAddTaskForm() {
  const form = document.querySelector(".add-task-form");

  form.reset();
  form.elements["taskID"].value = "";
  form.elements["task-due-date"].value = lightFormat(new Date(), "yyyy-MM-dd");
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
