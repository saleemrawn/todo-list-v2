import { lightFormat } from "date-fns";
import { projectsCollection, getProjectName } from "./projectsCollection.js";
import { getFormattedDate } from "./helpers.js";
import loadToday from "./today.js";
import loadUpcoming from "./upcoming.js";
import loadProject from "./projectTemplate.js";

export function addTaskToDOM(task) {
  const content = document.querySelector("#content");

  content.insertAdjacentHTML(
    "beforeend",
    `
      <div class="task-card" data-task-id="${task.getID()}" data-project-id="${task.projectID}">
        <div class="task-card-details">
            <input type="checkbox" class="task-checkbox" ${task.completed === true ? 'checked="checked"' : ""} />
            <div class="task-card-name-date-container">
              <p class="task-card-name">${task.name}</p>
              <p class="task-card-date ${checkOverdueDate(task.dueDate)}">${getFormattedDate(task.dueDate)}</p>
            </div>
            <div class="task-card-priority-pill" data-priority="${task.priority}">
              <p class="task-card-priority">${getPriorityName(task.priority)}</p>
            </div>
            <div class="task-card-action-buttons">
              <button class="task-edit-button icon-only" title="Edit task"><span class="hide">Edit task</span></button>
              <button class="task-delete-button icon-only" title="Delete task"><span class="hide">Delete task</span></button>
            </div>
        </div>

        <div class="task-card-content">
              <div class="task-card-project-pill">
                <p class="task-card-project">${getProjectName(task.projectID)}</p>
              </div>
              <p class="task-card-description">${task.description}</p>
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
      <div class="page-info">
        <h2 class="page-title">${title}</h2>
      </div>
    </div>
    `
  );
}

export function addPageDescriptionToDOM(description) {
  const pageInfo = document.querySelector(".page-info");
  pageInfo.insertAdjacentHTML("beforeend", `<p class="page-description">${description !== "" ? description : ""}</p>`);
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
  projects.sort((a, b) => a.dateCreated - b.dateCreated);
  projects.forEach((project) => {
    container.insertAdjacentHTML(
      "beforeend",
      `
      <button class="project-button secondary" data-project-id="${project.getID()}">${project.getName()}</button>
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
  dropdown.insertAdjacentHTML("beforeend", `<option value="">--Please choose an option--</option>`);

  for (const project of projects) {
    dropdown.insertAdjacentHTML("beforeend", `<option value="${project.getID()}">${project.getName()}</option>`);
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

export function removeProjectID(selector) {
  const container = document.querySelector(selector);
  container.removeAttribute("data-project-id");
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
  const form = document.querySelector(".task-form");

  form.reset();
  form.elements["taskID"].value = "";
  form.elements["task-due-date"].value = lightFormat(new Date(), "yyyy-MM-dd");
}

export function resetProjectForm() {
  const form = document.querySelector(".project-form");

  form.reset();
  form.elements["projectID"].value = "";
}

export function closeDialog(selector) {
  const dialog = document.querySelector(selector);
  dialog?.close();
}

export function expandTaskCard(element) {
  element.style.maxHeight = element.scrollHeight + "px";
  element.style.marginBottom = "16px";
}

export function collapseTaskCard(element) {
  element.style.maxHeight = null;
  element.style.marginBottom = "0";
}

export function toggleCheckedAttribute(checkbox) {
  if (checkbox.target.hasAttribute("checked")) {
    checkbox.target.removeAttribute("checked");
    return;
  }

  checkbox.target.setAttribute("checked", "checked");
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

function checkOverdueDate(dueDate) {
  const date = new Date();
  const today = Date.parse(lightFormat(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`, "yyyy-MM-dd"));

  if (dueDate === "") {
    return;
  }

  if (dueDate < today) {
    return "overdue";
  }
}
