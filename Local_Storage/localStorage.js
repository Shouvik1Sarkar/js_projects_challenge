// Local Storage

const name = document.getElementById("name");
const box = document.getElementById("box");
const click = document.getElementById("click");
let data_set = [];
let id_num = 0;
let data_pack = {};

const list = document.getElementById("list");
// const element = document.getElementsByClassName("element");

const data = JSON.parse(localStorage.getItem("value")) || [];
console.log("data type", typeof data);
data_set = data;
// if (data.length > 3) {
//   data.splice(1, 1);
//   console.log("data;;;;;", data);
// }
window.addEventListener("load", () => {
  // console.log(data);
  for (let i = 0; i < data.length; i++) {
    const element = document.createElement("li");
    const del = document.createElement("button");
    del.innerText = "del";
    element.classList.add("element");

    del.classList.add("d");

    element.innerText = data[i].task;
    element.id = data[i].id;

    element.append(del);

    list.append(element);
    delete_task(del, element);
  }
  console.log(data);

  // element.innerText = box.value;
});

click.addEventListener("click", () => {
  // const data = {};
  // const val = box.value;
  // data.value = val;
  // data_set.push(data);
  // localStorage.setItem("value", JSON.stringify(data_set));
  id_num += 1;
  const element = document.createElement("li");
  element.classList.add("element");
  const del = document.createElement("button");
  del.innerText = "del";

  element.id = id_num;
  element.innerText = box.value;
  element.append(del);
  list.append(element);

  data_pack.task = box.value;
  data_pack.id = id_num;
  data_set.push(data_pack);
  data_pack = {};
  console.log(data_set);

  delete_task(del, element);

  localStorage.setItem("value", JSON.stringify(data_set));
});

function delete_task(del, element) {
  del.addEventListener("click", () => {
    data_set = data_set.filter((task) => task.id != element.id);

    localStorage.setItem("value", JSON.stringify(data_set));
    console.log("----", data_set);

    element.remove();
  });
}
