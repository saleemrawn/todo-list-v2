import Project from "./project.js";
import Task from "./task.js";
import loadToday from "./today.js";
import loadUpcoming from "./upcoming.js";
import loadProject from "./projectTemplate.js";
import { projectsCollection, setProjectObjPrototype, setTaskObjPrototype } from "./projectsCollection.js";
import {
  addProjectButtonsToDOM,
  addTaskToDOM,
  closeDialog,
  collapseTaskCard,
  expandTaskCard,
  loadProjectsToDropdown,
  reloadPage,
  resetAddTaskForm,
  resetProjectForm,
  setProjectSelectedPage,
  toggleCheckedAttribute,
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
import { findParentElement, getFormattedDatePicker } from "./helpers.js";

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
  addGlobalEventListener("click", ".project-cancel-button", handleCancelNewProjectEvent);
  addGlobalEventListener("submit", ".project-form", handleNewProjectSubmitEvent);
  addGlobalEventListener("click", ".add-task-button", handleAddTaskDialogEvent);
  addGlobalEventListener("click", ".task-edit-button", handleEditTaskEvent);
  addGlobalEventListener("click", ".task-cancel-button", handleCancelAddTaskEvent);
  addGlobalEventListener("click", ".task-delete-button", handleDeleteTaskEvent);
  addGlobalEventListener("submit", ".task-form", handleAddTaskSubmitEvent);
  addGlobalEventListener("click", ".project-button", handleProjectSidebarButton);
  addGlobalEventListener("click", ".edit-project", handleEditProjectEvent);
  addGlobalEventListener("click", ".delete-project", handleDeleteProjectEvent);
  addGlobalEventListener("click", ".task-card", (card) => {
    handleCollapsibleTaskCardEvent(card);
  });
  addGlobalEventListener("click", ".task-checkbox", (checkbox) => {
    handleTaskCheckboxEvent(checkbox);
  });
}

export function loadApp() {
  window.addEventListener("DOMContentLoaded", () => {
    loadProjectsFromStorage();
    setProjectObjPrototype();
    setTaskObjPrototype();
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
  const dialog = document.querySelector(".task-dialog");

  loadProjectsToDropdown();
  resetAddTaskForm();
  setProjectFormDropdown();

  dialog.showModal();
}

function handleEditTaskEvent(button) {
  const dialog = document.querySelector(".task-dialog");
  const form = document.querySelector(".task-form");

  loadProjectsToDropdown();
  resetAddTaskForm();
  dialog.showModal();

  const projects = projectsCollection.getProjects();
  const parent = findParentElement(button.target, ".task-card");
  const projectID = parent.getAttribute("data-project-id");
  const taskID = parent.getAttribute("data-task-id");

  projects.forEach((project) => {
    if (project.getID() === projectID) {
      project.getTasks().forEach((task) => {
        if (task.getID() === taskID) {
          form.elements["task-name"].value = task.getName();
          form.elements["task-description"].value = task.getDescription();
          form.elements["task-due-date"].value = getFormattedDatePicker(task.getDueDate());
          form.elements["task-priority"].value = task.getPriorityLevel();
          form.elements["task-project"].value = task.projectID;
          form.elements["taskID"].value = task.getID();
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
      if (project.getID() === projectID) {
        project.removeTask(taskID);
        deleteProjectFromStorage(projectID);
        addProjectToStorage(projectID, project);
        parent.remove();
      }
    }
  }
}

function handleCancelAddTaskEvent() {
  const dialog = document.querySelector(".task-dialog");
  resetAddTaskForm();
  dialog.close();
}

function handleAddTaskSubmitEvent(event) {
  event.preventDefault();

  const form = document.querySelector(".task-form");
  const formData = new FormData(form);
  const projects = projectsCollection.getProjects();

  for (const project of projects) {
    if (project.getID() === formData.get("task-project") && formData.get("taskID") === "")
      handleNewTask(project, formData);

    for (const task of project.getTasks()) {
      if (task.getID() === formData.get("taskID") && project.getID() === formData.get("task-project")) {
        updateTaskToCurrentProject(task, formData);
        return;
      }

      if (task.getID() === formData.get("taskID") && project.getID() !== formData.get("task-project")) {
        updateTaskToNewProject(project, task, formData);
        return;
      }
    }
  }
}

function handleNewProjectDialogEvent() {
  const dialog = document.querySelector(".project-dialog");

  resetProjectForm();
  dialog.showModal();
}

function handleCancelNewProjectEvent() {
  const dialog = document.querySelector(".project-dialog");

  resetProjectForm();
  dialog.close();
}

function handleNewProjectSubmitEvent(event) {
  event.preventDefault();

  const form = document.querySelector(".project-form");
  const dialog = document.querySelector(".project-dialog");
  const formData = new FormData(form);
  const project = new Project({
    id: formData.get("projectID"),
    name: formData.get("project-name"),
    description: formData.get("project-description"),
  });

  if (formData.get("projectID") !== "") {
    updateExistingProject(formData);
    loadProjectSidebarButtons();
    loadProject(formData.get("projectID"));
    setProjectSelectedPage(formData.get("projectID"));
    resetProjectForm();
    dialog.close();
    return;
  }

  projectsCollection.addProject(project);
  addProjectToStorage(project.getID(), project);
  resetProjectForm();
  loadProjectSidebarButtons();
  dialog.close();
}

function handleEditProjectEvent() {
  const dialog = document.querySelector(".project-dialog");
  const form = document.querySelector(".project-form");

  resetProjectForm();
  dialog.showModal();

  const projects = projectsCollection.getProjects();
  const parent = document.querySelector("#content");
  const projectID = parent.getAttribute("data-project-id");

  projects.forEach((project) => {
    if (project.getID() === projectID) {
      form.elements["project-name"].value = project.getName();
      form.elements["project-description"].value = project.getDescription();
      form.elements["projectID"].value = project.getID();
    }
  });
}

function handleDeleteProjectEvent() {
  const projectID = document.querySelector("#content").getAttribute("data-project-id");

  if (confirm("Are you sure you want to delete the project?\rWARNING: You will lose all tasks saved to the project.")) {
    deleteProjectFromStorage(projectID);
    window.location.reload();
  }
}

function handleNewTask(project, form) {
  const task = new Task({
    name: form.get("task-name"),
    description: form.get("task-description"),
    dueDate: Date.parse(form.get("task-due-date")),
    priority: form.get("task-priority"),
    projectID: form.get("task-project"),
  });

  project.addTask(task);
  addProjectToStorage(project.getID(), project);
  addTaskToDOM(task);

  resetAddTaskForm();
  closeDialog(".task-dialog");
  reloadPage(form.get("task-project"));
}

function handleProjectSidebarButton(event) {
  const id = event.target.getAttribute("data-project-id");
  loadProject(id);
  updateSelectedPage(event);
}

function handleCollapsibleTaskCardEvent(event) {
  const content = event.target.querySelector(".task-card-content");

  if (content.style.maxHeight) {
    collapseTaskCard(content);
    return;
  }

  expandTaskCard(content);
}

function handleTaskCheckboxEvent(checkbox) {
  const projects = projectsCollection.getProjects();
  const parent = findParentElement(checkbox.target, ".task-card");
  const projectID = parent.getAttribute("data-project-id");
  const taskID = parent.getAttribute("data-task-id");

  for (const project of projects) {
    for (const task of project.getTasks()) {
      if (task.getID() === taskID) {
        if (task.completed === false) {
          task.completed = true;
          addProjectToStorage(projectID, project);
          toggleCheckedAttribute(checkbox);
          return;
        }

        task.completed = false;
        addProjectToStorage(projectID, project);
        toggleCheckedAttribute(checkbox);
      }
    }
  }
}

function updateTaskToCurrentProject(task, form) {
  Object.assign(task, getSourceFormObj(form));
  clearStorage();
  addAllProjectsToStorage();
  resetAddTaskForm();
  closeDialog(".task-dialog");
  reloadPage(form.get("task-project"));
}

function updateTaskToNewProject(project, task, form) {
  const projectID = form.get("task-project");

  project.removeTask(form.get("taskID"));
  Object.assign(task, getSourceFormObj(form));
  addTaskToProject(projectID, task);

  clearStorage();
  addAllProjectsToStorage();

  resetAddTaskForm();
  closeDialog(".task-dialog");
  reloadPage(form.get("task-project"));
}

function loadProjectSidebarButtons() {
  const container = document.querySelector(".my-project-buttons");
  container.innerHTML = "";
  addProjectButtonsToDOM(container);
}

function updateExistingProject(formData) {
  const projects = projectsCollection.getProjects();

  for (const project of projects) {
    if (formData.get("projectID") === project.getID()) {
      project.setName(formData.get("project-name"));
      project.setDescription(formData.get("project-description"));
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
    dueDate: Date.parse(form.get("task-due-date")),
    priority: form.get("task-priority"),
    projectID: form.get("task-project"),
  };

  return source;
}

function setProjectFormDropdown() {
  const parent = document.querySelector("#content");

  if (parent.hasAttribute("data-project-id")) {
    const form = document.querySelector(".task-form");
    form.elements["task-project"].value = parent.getAttribute("data-project-id");
  }
}
