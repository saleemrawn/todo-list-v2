import Project from "./project.js";
import Task from "./task.js";
import loadToday from "./today.js";
import loadUpcoming from "./upcoming.js";
import loadProject from "./projectTemplate.js";
import { projectsCollection, setProjectObjPrototype } from "./projectsCollection.js";
import {
  addProjectButtonsToDOM,
  addTaskToDOM,
  closeDialog,
  loadProjectsToDropdown,
  reloadPage,
  resetAddTaskForm,
  updateSelectedPage,
} from "./domController.js";
import {
  addAllProjectsToStorage,
  addProjectToStorage,
  loadProjectsFromStorage,
  clearStorage,
  deleteProjectFromStorage,
} from "./storage.js";
import { addTaskToProject } from "./projectTaskConnector.js";
import { findParentElement } from "./helpers.js";

export function loadEventListeners() {
  addGlobalEventListener("click", ".today-button", (button) => {
    loadToday();
    updateSelectedPage(button);
  });
  addGlobalEventListener("click", ".upcoming-button", (button) => {
    loadUpcoming();
    updateSelectedPage(button);
  });
  addGlobalEventListener("click", ".new-project-button", handleNewProjectDialogEvent);
  addGlobalEventListener("click", ".new-project-cancel-button", handleCancelNewProjectEvent);
  addGlobalEventListener("submit", ".new-project-form", handleNewProjectSubmitEvent);
  addGlobalEventListener("click", ".add-task-button", handleAddTaskDialogEvent);
  addGlobalEventListener("click", ".task-edit-button", handleEditTaskEvent);
  addGlobalEventListener("click", ".task-cancel-button", handleCancelAddTaskEvent);
  addGlobalEventListener("click", ".task-delete-button", handleDeleteTaskEvent);
  addGlobalEventListener("submit", ".add-task-form", handleAddTaskSubmitEvent);
  addGlobalEventListener("click", ".project-button", handleProjectSidebarButton);
  addGlobalEventListener("click", ".edit-project", handleEditProjectEvent);
}

export function loadApp() {
  window.addEventListener("DOMContentLoaded", () => {
    loadProjectsFromStorage();
    setProjectObjPrototype();
    loadToday();
    loadProjectSidebarButtons();
    loadEventListeners();
  });
}

function addGlobalEventListener(type, selector, callback, parent = document) {
  parent.addEventListener(type, (event) => {
    if (event.target.matches(selector)) {
      callback(event);
    }
  });
}

function handleAddTaskDialogEvent() {
  const dialog = document.querySelector(".add-task-dialog");

  loadProjectsToDropdown();
  resetAddTaskForm();
  dialog.showModal();
}

function handleEditTaskEvent(button) {
  const dialog = document.querySelector(".add-task-dialog");
  const form = document.querySelector(".add-task-form");

  loadProjectsToDropdown();
  resetAddTaskForm();
  dialog.showModal();

  const projects = projectsCollection.getProjects();
  const parent = findParentElement(button.target, ".task-card");
  const projectID = parent.getAttribute("data-project-id");
  const taskID = parent.getAttribute("data-task-id");

  projects.forEach((project) => {
    if (project.id === projectID) {
      project.taskList.forEach((task) => {
        if (task.taskID === taskID) {
          form.elements["task-name"].value = task.name;
          form.elements["task-description"].value = task.description;
          form.elements["task-due-date"].value = task.dueDate;
          form.elements["task-priority"].value = task.priority;
          form.elements["task-project"].value = task.projectID;
          form.elements["task-notes"].value = task.notes;
          form.elements["taskID"].value = task.taskID;
        }
      });
    }
  });
}

function handleDeleteTaskEvent(button) {
  const projects = projectsCollection.getProjects();
  const parent = findParentElement(button.target, ".task-card");
  const projectID = parent.getAttribute("data-project-id");
  const taskID = parent.getAttribute("data-task-id");

  if (window.confirm("Are you sure you want to permanently delete the task?")) {
    for (const project of projects) {
      if (project.id === projectID) {
        const index = project.taskList.findIndex((task) => task.id === taskID);

        deleteProjectFromStorage(projectID);
        project.taskList.splice(index, 1);
        addProjectToStorage(projectID, project);

        parent.remove();
      }
    }
  }
}

function handleCancelAddTaskEvent() {
  const dialog = document.querySelector(".add-task-dialog");
  resetAddTaskForm();
  dialog.close();
}

function handleAddTaskSubmitEvent(event) {
  event.preventDefault();

  const form = document.querySelector(".add-task-form");
  const formData = new FormData(form);
  const projects = projectsCollection.getProjects();

  for (const project of projects) {
    if (project.id === formData.get("task-project") && formData.get("taskID") === "") handleNewTask(project, formData);

    for (const task of project.taskList) {
      if (task.taskID === formData.get("taskID") && project.id === formData.get("task-project")) {
        updateTaskToCurrentProject(task, formData);
        return;
      }

      if (task.taskID === formData.get("taskID") && project.id !== formData.get("task-project")) {
        updateTaskToNewProject(project, task, formData);
        return;
      }
    }
  }
}

function handleNewProjectDialogEvent() {
  const dialog = document.querySelector(".new-project-dialog");
  const form = document.querySelector(".new-project-form");

  form.reset();
  dialog.showModal();
}

function handleCancelNewProjectEvent() {
  const dialog = document.querySelector(".new-project-dialog");
  const form = document.querySelector(".new-project-form");

  form.reset();
  dialog.close();
}

function handleNewProjectSubmitEvent(event) {
  event.preventDefault();

  const form = document.querySelector(".new-project-form");
  const dialog = document.querySelector(".new-project-dialog");
  const formData = new FormData(form);
  const project = new Project({
    name: formData.get("new-project-name"),
    description: formData.get("new-project-description"),
  });

  projectsCollection.addProject(project);
  addProjectToStorage(project.id, project);

  form.reset();
  dialog.close();

  loadProjectSidebarButtons();
}

function handleEditProjectEvent() {
  const dialog = document.querySelector(".new-project-dialog");
  const form = document.querySelector(".new-project-form");

  form.reset();
  dialog.showModal();

  const projects = projectsCollection.getProjects();
  const parent = document.querySelector("#content");
  const projectID = parent.getAttribute("data-project-id");

  projects.forEach((project) => {
    if (project.id === projectID) {
      form.elements["new-project-name"].value = project.projectName;
      form.elements["new-project-description"].value = project.description;
      form.elements["projectID"].value = project.id;
    }
  });
}

function handleNewTask(project, form) {
  const task = new Task({
    name: form.get("task-name"),
    description: form.get("task-description"),
    dueDate: form.get("task-due-date"),
    priority: form.get("task-priority"),
    projectID: form.get("task-project"),
    notes: form.get("task-notes"),
  });

  project.addTask(task);
  addProjectToStorage(project.id, project);
  addTaskToDOM(project, task);

  resetAddTaskForm();
  closeDialog(".add-task-dialog");
  reloadPage();
}

function handleProjectSidebarButton(event) {
  const id = event.target.getAttribute("data-project-id");
  loadProject(id);
  updateSelectedPage(event);
}

function updateTaskToCurrentProject(task, form) {
  Object.assign(task, getSourceFormObj(form));
  clearStorage();
  addAllProjectsToStorage();
  resetAddTaskForm();
  closeDialog(".add-task-dialog");
  reloadPage();
}

function updateTaskToNewProject(project, task, form) {
  const projectID = form.get("task-project");
  const index = project.taskList.findIndex((task) => task.id === form.get("taskID"));

  Object.assign(task, getSourceFormObj(form));

  project.taskList.splice(index, 1);
  addTaskToProject(projectID, task);

  clearStorage();
  addAllProjectsToStorage();

  resetAddTaskForm();
  closeDialog(".add-task-dialog");
  reloadPage();
}

function loadProjectSidebarButtons() {
  const container = document.querySelector(".my-project-buttons");
  container.innerHTML = "";
  addProjectButtonsToDOM(container);
}

function updateExistingProject(formData) {
  const projects = projectsCollection.getProjects();

  for (const project of projects) {
    if (formData.get("projectID") === project.id) {
      project.projectName = formData.get("new-project-name");
      project.description = formData.get("new-project-description");
    }
  }

  clearStorage();
  addAllProjectsToStorage();
}

function getSourceFormObj(form) {
  const source = {
    id: form.get("taskID"),
    name: form.get("task-name"),
    description: form.get("task-description"),
    dueDate: form.get("task-due-date"),
    priority: form.get("task-priority"),
    projectID: form.get("task-project"),
    notes: form.get("task-notes"),
  };

  return source;
}
