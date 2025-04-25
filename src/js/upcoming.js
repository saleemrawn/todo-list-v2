import { lightFormat } from "date-fns";
import { projectsCollection } from "./projectsCollection.js";
import { getPriorityName } from "./helpers.js";

export default function loadUpcoming() {
  const content = document.querySelector("#content");
  const projects = projectsCollection.getProjects();
  const todayDate = lightFormat(new Date(), "yyyy-MM-dd");

  content.innerHTML = "";
  content.insertAdjacentHTML("beforeend", "<h2>Upcoming</h2>");

  for (const project of projects) {
    for (const task of project.taskList) {
      if (todayDate < task.dueDate) {
        content.insertAdjacentHTML(
          "beforeend",
          `
            <div class="task-card" data-task-id="${task.id}" data-project-id="${project.id}">
              <p class="task-card-name">${task.name}</p>
              <p class="task-card-description">${task.description}</p>
              <p class="task-card-date">${lightFormat(task.dueDate, "dd/MM/yyyy")}</p>
              <p class="task-card-project">${project.projectName}</p>
              <div class="task-card-priority-pill">
                <p class="task-card-priority">${getPriorityName(task.priority)}</p>
              </div>
              <div class="task-card-action-buttons">
                <button class="task-edit-button">Edit</button>
                <button class="task-delete-button">Delete</button>
              </div>
            </div>
            `
        );
      }
    }
  }
}
