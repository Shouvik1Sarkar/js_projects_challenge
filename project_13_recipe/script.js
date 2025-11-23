const grid = document.getElementById("grid_id");
const search = document.getElementById("search");
const user_input = document.getElementById("user_input");
const brand_id = document.getElementById("brand_id");
const error_text = document.getElementById("error_text");
const errormessage = document.getElementById("errormessage");
const chips = document.querySelectorAll(".chip");

chips.forEach((element) => {
  user_input.innerHTML = "";
  element.addEventListener("click", () => {
    get_recipe(element.innerHTML).then((data) => {
      console.log("data: ", data);
      if (!data || data.length == 0 || !data.meals) {
        error_text.innerHTML = `Recipe for ${element.innerHTML} is not available`;
        errormessage.classList.remove("hidden");
        return;
      }
      console.log(data.meals);
      const dishes_list = data.meals;

      console.log(dishes_list);

      for (let i = 0; i < dishes_list.length; i++) {
        let dish = dishes_list[i];
        if (i == 0) {
          featured_dish(dish);
        } else {
          small_dish_card(dish);
        }
      }
    });
  });
});

// for (let i = 0; i < chips.length; i++) {
//   console.log(chips[i]);
//   chips[i].addEventListener("click", () => {
//     get_recipe(chips[i].innerHTML);
//   });
// }
function get_recipe(user_input) {
  return fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${user_input}`
  )
    .then((data) => {
      return data.json();
    })
    .catch((e) => e);
}

function featured_dish(dish) {
  grid.innerHTML = "";
  const article = document.createElement("article");
  article.classList.add("card-item", "featured");
  const image = document.createElement("img");
  const info = document.createElement("div");
  info.classList.add("info");
  const title = document.createElement("h3");
  const p = document.createElement("p");
  p.classList.add("muted");
  const featured_timing_div = document.createElement("div");
  const category = document.createElement("div");
  const origin = document.createElement("div");
  featured_timing_div.classList.add("featured_timing_div");
  category.classList.add("pill");
  origin.classList.add("pill");

  image.src = dish.strMealThumb;
  title.innerHTML = dish.strMeal;
  p.innerHTML = ` Creamy, comforting and elegant — perfect for weekend dinner.`;
  category.innerHTML = `${dish.strCategory}`;
  origin.innerHTML = `${dish.strArea}`;

  featured_timing_div.appendChild(category);
  featured_timing_div.appendChild(origin);

  info.appendChild(title);
  info.appendChild(p);
  info.appendChild(featured_timing_div);

  article.appendChild(image);
  article.appendChild(info);
  grid.appendChild(article);
}

function small_dish_card(dish) {
  const article = document.createElement("article");
  article.classList.add("card-item");
  const image = document.createElement("img");
  const card_body = document.createElement("div");
  card_body.classList.add("card_body");
  const title = document.createElement("h3");

  const meta = document.createElement("div");
  const category = document.createElement("div");
  const origin = document.createElement("div");
  meta.classList.add("meta");
  category.classList.add("muted");
  origin.classList.add("muted");

  image.src = dish.strMealThumb;
  title.innerHTML = dish.strMeal;
  category.innerHTML = `${dish.strCategory}`;
  origin.innerHTML = `${dish.strArea}`;

  meta.appendChild(category);
  meta.appendChild(origin);
  card_body.appendChild(title);
  card_body.appendChild(meta);

  article.appendChild(image);
  article.appendChild(card_body);
  grid.appendChild(article);
}

search.addEventListener("click", () => {
  if (user_input.value.trim() == "") return;
  const value = user_input.value;
  get_recipe(value).then((data) => {
    console.log("data: ", data.meals);
    if (!data || data.length == 0 || !data.meals) {
      grid.innerHTML = "";
      error_text.innerHTML = `Recipe for ${value} is not available`;
      errormessage.classList.remove("hidden");
      return;
    }
    errormessage.classList.add("hidden");
    console.log(data.meals);
    const dishes_list = data.meals;

    for (let i = 0; i < dishes_list.length; i++) {
      let dish = dishes_list[i];
      if (i == 0) {
        featured_dish(dish);
      } else {
        small_dish_card(dish);
      }
    }
  });
  user_input.value = "";
});

brand_id.addEventListener("click", () => {
  get_recipe("sweet").then((data) => {
    console.log("data: ", data.meals);

    const dishes_list = data.meals;

    for (let i = 0; i < dishes_list.length; i++) {
      let dish = dishes_list[i];
      if (i == 0) {
        featured_dish(dish);
      } else {
        small_dish_card(dish);
      }
    }
  });
});
// function error_message() {}
