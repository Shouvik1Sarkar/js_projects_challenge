const task_input_box = document.getElementById("task_input");
const task_button = document.getElementById("input_button");
const container_div = document.getElementById("container");
const save_button = document.getElementById("save_button");

let current_task = null;

let task_done = false;
const task_data_base = { task_name: "", task_done: false };

let task_data = [];
let data = JSON.parse(localStorage.getItem("task_saved")) || [];
task_data = data;
if (data.length > 0) {
  // Find the maximum ID in the stored tasks
  id_num = Math.max(...data.map((task) => task.id)) + 1; // gotta learn this
} else {
  id_num = 0;
}

window.addEventListener("load", () => {
  for (let i = 0; i < data.length; i++) {
    const task_div = document.createElement("div");
    task_div.classList.add("task_div");
    container_div.append(task_div);
    task_div.id = data[i].id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    task_div.append(checkbox);

    const task_name = document.createElement("p");
    task_name.classList.add("task");
    task_div.append(task_name);

    const edit_button = document.createElement("button");
    edit_button.classList.add("edit");
    edit_button.innerHTML = "edit";
    task_div.append(edit_button);

    const delete_button = document.createElement("button");
    delete_button.classList.add("delete");
    delete_button.innerHTML = "x";
    task_div.append(delete_button);

    if (data[i].status == true) {
      task_name.style.textDecoration = "line-through";
      checkbox.checked = true;
    }

    task_name.innerText = data[i].task;
    delete_task(delete_button, task_div);
    checkbox_click(checkbox, task_name, task_div);
    checkbox_click(checkbox, task_name, task_div);
    edit_task(edit_button, task_name, task_div);
  }
});

task_button.addEventListener("click", () => {
  createTask(task_input_box, container_div);
});

save_button.addEventListener("click", () => {
  current_task.innerHTML = task_input_box.value;
  task_button.style.display = "inline";
  save_button.style.display = "none";
  task_data.forEach((e) => {
    if (e.id == current_task.parentElement.id) {
      console.log("edit worked....");
      e.task = task_input_box.value;
    }
  });
  localStorage.setItem("task_saved", JSON.stringify(task_data));
  // console.log("parent: ", current_task);
  task_input_box.value = "";
  current_task = null;
});

function createTask(task_input_box, container_div) {
  if (task_input_box.value.trim() == "") {
    return;
  }
  id_num += 1;
  const task_div = document.createElement("div");
  task_div.classList.add("task_div");
  container_div.append(task_div);
  task_div.id = id_num;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  task_div.append(checkbox);

  const task_name = document.createElement("p");
  task_name.classList.add("task");
  task_div.append(task_name);

  const edit_button = document.createElement("button");
  edit_button.classList.add("edit");
  edit_button.innerHTML = "edit";
  task_div.append(edit_button);

  const delete_button = document.createElement("button");
  delete_button.classList.add("delete");
  delete_button.innerHTML = "x";
  task_div.append(delete_button);

  //   console.log("---", task_input_box.value);

  task_name.innerText = task_input_box.value;
  task_input_box.value = "";

  delete_task(delete_button, task_div);
  edit_task(edit_button, task_name);
  checkbox_click(checkbox, task_name);

  let task_set = {};
  task_set.task = task_name.innerText;
  task_set.status = task_done;
  task_set.id = id_num;

  task_data.push(task_set);

  localStorage.setItem("task_saved", JSON.stringify(task_data));
}

function delete_task(delete_button, task_div) {
  delete_button.addEventListener("click", () => {
    task_data = task_data.filter((task) => task.id != task_div.id);
    localStorage.setItem("task_saved", JSON.stringify(task_data));
    console.log(task_data);
    task_div.remove();
  });
}

function edit_task(edit_button, task_name, task_div) {
  edit_button.addEventListener("click", () => {
    task_input_box.value = task_name.innerHTML;
    current_task = task_name;
    task_button.style.display = "none";
    save_button.style.display = "inline";
  });
}

function checkbox_click(checkbox, task_name, task_div) {
  checkbox.addEventListener("click", () => {
    if (checkbox.checked) {
      task_name.style.textDecoration = "line-through";
      task_done = true;
    } else {
      task_name.style.textDecoration = "none";
      task_done = false;
    }
    task_data.map((e) => {
      if (e.id == task_div.id) {
        if (checkbox.checked) {
          console.log("finally=======");
          e.status = true;
        } else {
          console.log("finally nooooooo");
          e.status = false;
        }
      }

      localStorage.setItem("task_saved", JSON.stringify(task_data));
    });
  });
}

// function save() {
//   task_data.forEach((e) => {
//     if (e.task == ) {
//       console.log("edit worked....");
//       e.task = task_input_box.value;
//     }
//   });
//   localStorage.setItem("task_saved", JSON.stringify(task_data));
// }
