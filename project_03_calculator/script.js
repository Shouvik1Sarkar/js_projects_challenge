const digit = document.querySelectorAll("span");
const display = document.getElementById("display");
// let container = document.getElementById("container");
digit.forEach((e) => {
  e.addEventListener("click", () => {
    if (e.innerText != "=") {
      console.log(e.id);
      display.value += e.id;
      //   container.value += e.id;
    } else {
      console.log(container);
      const value = eval(display.value);
      display.value = value;
    }
  });
});
