// DOM refs (kept same names)

const grid = document.getElementById("grid_id");

const search = document.getElementById("search"); // search  button
const user_input = document.getElementById("user_input"); // user input box

const brand_id = document.getElementById("brand_id");

const error_text = document.getElementById("error_text");
const errormessage = document.getElementById("errormessage");

const chips = document.querySelectorAll(".chip");
const card_items = document.querySelectorAll(".card-item");
const saved_grid = document.getElementById("saved-grid");
const recipe_modal = document.getElementById("recipe-modal");
const content_container = document.getElementById("content_container");
const sort = document.getElementById("sort");

const recipe_cache = {};
let last_searched = "";
let saved_dishes = JSON.parse(localStorage.getItem("saved_dishes")) || [];

// gets the dish and stores in the cache

function get_recipe_cache(name) {
  const key = String(name || "")
    .trim()
    .toLowerCase();
  if (!key) return Promise.resolve({ meals: null });

  if (recipe_cache[key]) {
    console.log("from cache");
    return Promise.resolve(recipe_cache[key]);
  }
  return fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    .then((data) => {
      recipe_cache[key] = data;
      console.log("from api", data);
      return data.json();
    })
    .then((data) => {
      recipe_cache[key] = data;
      console.log("from api", recipe_cache);
      return data;
    })
    .catch((err) => {
      console.error("ERROR MESSAGE get_recipe(name): ", err);
      return Promise.resolve({ meals: null });
    });
}

function get_recipe(name) {
  return get_recipe_cache(name);
}

function hasItem(name) {
  return (
    name && name.meals && name.meals.length > 0 && Array.isArray(name.meals)
  );
}

function displayRecipesList(data) {
  for (let i = 0; i < data.meals.length; i++) {
    if (i == 0) {
      console.log("this si data: ", data);
      featured_dish_card_onreload(data.meals[i]);
    } else {
      small_dish_card_onreload(data.meals[i]);
    }
  }
}

function featured_dish_card_onreload(dish) {
  // CHANGE: clear grid in caller; keep function focused on building the featured card
  const article = document.createElement("article");
  article.classList.add("card-item", "featured");

  const image = document.createElement("img");
  const info = document.createElement("div");
  info.classList.add("info");
  const title = document.createElement("h3");
  const p = document.createElement("p");
  p.classList.add("muted");
  const featured_timing_div = document.createElement("div");
  featured_timing_div.classList.add("featured_timing_div");
  const category = document.createElement("div");
  const origin = document.createElement("div");
  category.classList.add("pill");
  const save_button = document.createElement("button");
  origin.classList.add("pill");
  save_button.classList.add("save-button");
  //   save_button.innerHTML = "🔖";
  save_button.dataset.dish = dish.strMeal;

  save_item_function(save_button, dish.strMeal);

  image.src = dish.strMealThumb;
  title.innerHTML = dish.strMeal;
  category.innerHTML = dish.strCategory;
  origin.innerHTML = dish.strArea;
  p.innerText = "Creamy, comforting and elegant — perfect for weekend dinner.";

  featured_timing_div.appendChild(category);
  featured_timing_div.appendChild(origin);
  info.appendChild(title);
  info.appendChild(p);

  article.appendChild(save_button);
  article.appendChild(image);
  article.appendChild(info);
  //   article.appendChild(title);
  article.appendChild(featured_timing_div);

  grid.appendChild(article);
  //   update_all_save_buttons();
  save_item_function(save_button, title);
}

function small_dish_card_onreload(dish) {
  // CHANGE: clear grid in caller; keep function focused on building the featured card
  const article = document.createElement("article");
  article.classList.add("card-item");

  const image = document.createElement("img");
  const info = document.createElement("div");
  info.classList.add("info");
  const title = document.createElement("h3");

  const featured_timing_div = document.createElement("div");
  featured_timing_div.classList.add("featured_timing_div");
  const category = document.createElement("div");
  const origin = document.createElement("div");
  category.classList.add("pill");
  const save_button = document.createElement("button");
  origin.classList.add("pill");
  save_button.classList.add("save-button");

  save_button.dataset.dish = dish.strMeal;

  //   save_button.innerHTML = "🔖";

  image.src = dish.strMealThumb;
  title.innerHTML = dish.strMeal;
  category.innerHTML = dish.strCategory;
  origin.innerHTML = dish.strArea;

  featured_timing_div.appendChild(category);
  featured_timing_div.appendChild(origin);

  info.appendChild(title);

  article.appendChild(image);
  article.appendChild(save_button);
  article.appendChild(info);
  //   article.appendChild(title);
  article.appendChild(featured_timing_div);

  grid.appendChild(article);

  save_item_function(save_button, dish.strMeal);
  update_all_save_buttons();
}

function save_item_function(save_button, title) {
  save_button.addEventListener("click", () => {
    const dish_info = {};
    // dish_info.name = title;
    const exists = saved_dishes.find((e) => e.name == title);
    if (!exists) {
      dish_info.name = title;
      saved_dishes.push(dish_info);
      save_button.innerHTML = "⭐";
    } else {
      saved_dishes = saved_dishes.filter((e) => e.name != title);

      save_button.innerHTML = "🔖";
    }
    console.log("saved Dishes: ", saved_dishes);
    localStorage.setItem("saved_dishes", JSON.stringify(saved_dishes));
  });
}

function update_all_save_buttons() {
  document.querySelectorAll(".save-button").forEach((btn) => {
    const exists = saved_dishes.find((e) => e.name == btn.dataset.dish);
    btn.innerHTML = exists ? "⭐" : "🔖";
  });
}

search.addEventListener("click", () => {
  console.log("cache data: ", recipe_cache);
  if (user_input.value.trim() === "") {
    return;
  }
  grid.innerHTML = "";
  const value = user_input.value.trim();

  get_recipe(value)
    .then((data) => {
      if (!hasItem(data)) {
        error_text.innerHTML = `No recipe available for ${value}`;
        errormessage.classList.remove("hidden");
      }

      displayRecipesList(data);
      console.log("data: ", data);
    })
    .catch((err) => {
      console.error("ERROR: search.addEventListener", err);
    });
  last_searched = user_input.value.trim();
  localStorage.setItem("last_searched", JSON.stringify(last_searched));
  user_input.value = "";
});

window.addEventListener("load", () => {
  grid.innerHTML = "";
  const search_item =
    JSON.parse(localStorage.getItem("last_searched")) || "sweet";

  get_recipe(search_item)
    .then((data) => {
      if (!hasItem(data)) {
        error_text.innerHTML = `No recipe available for ${value}`;
        errormessage.classList.remove("hidden");
      }

      displayRecipesList(data);
      console.log("data: ", data);
    })
    .catch((err) => {
      console.error("ERROR: search.addEventListener", err);
    });
  update_all_save_buttons();
});
