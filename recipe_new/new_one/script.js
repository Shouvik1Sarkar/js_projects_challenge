// DOM refs (kept same names)

const grid = document.getElementById("grid_id");

const search = document.getElementById("search"); // search  button
const user_input = document.getElementById("user_input"); // user input box

const brand_id = document.getElementById("brand_id");

const error_text = document.getElementById("error_text");
const errormessage = document.getElementById("errormessage");

const chips = document.querySelectorAll(".chip");

const saved_grid = document.getElementById("saved-grid"); // grid to save items

const card_items = document.querySelectorAll(".card-item");

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

  //   save_item_function(save_button, dish.strMeal);

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

  save_item_function(save_button, dish.strMeal);
  update_all_save_buttons();
  //   display_full_recipe();
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
  category.classList.add("pill");
  const origin = document.createElement("div");
  origin.classList.add("pill");
  const save_button = document.createElement("button");
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
  //   display_full_recipe();
}

function save_item_function(save_button, title) {
  save_button.addEventListener("click", (e) => {
    e.stopPropagation();
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
    saved_items_display();
  });
}

function update_all_save_buttons() {
  //   console.log("THIS IS BUTTON: ", document.querySelectorAll(".save-button"));
  document.querySelectorAll(".save-button").forEach((btn) => {
    // console.log("BUTTON: ", btn);
    const exists = saved_dishes.find((e) => e.name == btn.dataset.dish);
    btn.innerHTML = exists ? "⭐" : "🔖";
  });
}

function saved_items_display() {
  saved_grid.innerHTML = "";
  saved_dishes.forEach((dish) => {
    console.log("this dish: ", dish);
    get_recipe(dish.name)
      .then((dish_array) => {
        if (!dish_array) return;

        let dish = dish_array.meals[0];

        console.log("dish: ", dish);
        const article = document.createElement("article");
        article.classList.add("card-item");
        const image = document.createElement("img");
        const card_body = document.createElement("div");
        card_body.classList.add("card_body");
        const title = document.createElement("h3");

        const meta = document.createElement("div");
        const category = document.createElement("div");
        const origin = document.createElement("div");

        image.src = dish.strMealThumb;
        title.innerHTML = dish.strMeal;
        category.innerHTML = dish.strCategory;
        origin.innerHTML = dish.strArea;

        article.appendChild(image);
        article.appendChild(title);
        article.appendChild(category);
        article.appendChild(origin);

        saved_grid.appendChild(article);
      })
      .catch((err) => {});
  });
  //   display_full_recipe();
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
  as();
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
  saved_items_display();
  update_all_save_buttons();
});

brand_id.addEventListener("click", () => {
  grid.innerHTML = "";
  localStorage.removeItem("last_searched");

  get_recipe("sweet")
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

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    grid.innerHTML = "";
    const value = chip.innerHTML;

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
  });
});
const a = document.getElementsByClassName("show_grid");

for (let i = 0; i < a.length; i++) {
  a[i].addEventListener("click", (event) => {
    let card = event.target.closest(".card-item");
    if (!card) return;

    const modal_content = document.createElement("div");
    modal_content.classList.add("modal-content");

    const close_button = document.createElement("button");
    close_button.classList.add("close-btn");
    close_button.innerHTML = "✕";

    const save_button = document.createElement("button");
    save_button.classList.add("save-button");

    const image = document.createElement("img");
    image.id = "modal-img";
    image.src = card.querySelector("img")?.src;

    const modal_title = document.createElement("h2");
    modal_title.id = "modal-title";
    modal_title.innerHTML = card.querySelector("h3")?.innerHTML;

    const ingredients_title = document.createElement("h3");
    ingredients_title.classList.add("section-title");
    ingredients_title.innerHTML = "Ingredients";

    const ingredients_list = document.createElement("ul");
    ingredients_list.id = "modal-ingredients";
    ingredients_list.classList.add("ingredients-list");

    const instruction_title = document.createElement("h3");
    instruction_title.classList.add("section-title");
    instruction_title.innerHTML = "Instruction";

    const instruction = document.createElement("p");
    instruction.classList.add("instructions");
    instruction.id = "modal-instructions";

    const watch_tutorial = document.createElement("h3");
    watch_tutorial.classList.add("section-title");
    watch_tutorial.innerHTML = "Watch Tutorial";

    const watch_tutorial_link = document.createElement("a");
    watch_tutorial_link.classList.add("tutorial-link");
    watch_tutorial_link.id = "modal-video";
    watch_tutorial_link.target = "_blank";
    watch_tutorial_link.innerHTML = "▶ Watch on YouTube";

    save_button.innerHTML = "🔖";

    save_button.dataset.dish = card.querySelector("h3")?.innerHTML;

    get_recipe(card.querySelector("h3")?.innerHTML).then((data) => {
      instruction.innerHTML = data.meals[0].strInstructions;

      watch_tutorial_link.href = data.meals[0].strYoutube;
      for (let i = 1; i <= 20; i++) {
        const ingredient = data.meals[0][`strIngredient${i}`];
        const measure = data.meals[0][`strMeasure${i}`];
        if (ingredient && ingredient.toString().trim()) {
          const li = document.createElement("li");
          // measure may be null/empty -> fallback to empty string
          li.textContent = `${(
            measure || ""
          ).trim()} ${ingredient.trim()}`.trim();
          ingredients_list.appendChild(li);
        }
      }
    });
    recipe_modal.appendChild(close_button);

    modal_content.appendChild(image);
    modal_content.appendChild(save_button);
    modal_content.appendChild(modal_title);
    modal_content.appendChild(ingredients_title);
    modal_content.appendChild(ingredients_list);
    modal_content.appendChild(instruction_title);
    modal_content.appendChild(instruction);
    modal_content.appendChild(watch_tutorial);
    modal_content.appendChild(watch_tutorial_link);

    recipe_modal.appendChild(modal_content);

    console.log("CLICKING THIS: ", card.querySelector("h3")?.innerHTML);

    save_button.addEventListener("click", (e) => {
      e.stopPropagation();
      const dish_info = {};
      const exists = saved_dishes.find(
        (e) => e.name == save_button.dataset.dish
      );
      if (!exists) {
        dish_info.name = save_button.dataset.dish;
        saved_dishes.push(dish_info);
        save_button.innerHTML = "⭐";
      } else {
        saved_dishes = saved_dishes.filter(
          (e) => e.name != save_button.dataset.dish
        );
        save_button.innerHTML = "🔖";
      }
      console.log("saved Dishes: ", saved_dishes);
      localStorage.setItem("saved_dishes", JSON.stringify(saved_dishes));
      saved_items_display();
    });

    update_all_save_buttons();

    close_display(close_button);
    recipe_modal.classList.remove("hidden");
    // alert(card.querySelector("h3")?.innerHTML);
  });
}

function close_display(close_button) {
  close_button.addEventListener("click", () => {
    recipe_modal.classList.add("hidden");
    recipe_modal.innerHTML = "";
  });
}
/** 
  <div class="modal-content">
        <button class="close-btn">✕</button>

        <img id="modal-img" src="" alt="Recipe" />

        <h2 id="modal-title">Recipe Title</h2>

        <h3 class="section-title">Ingredients</h3>
        <ul id="modal-ingredients" class="ingredients-list"></ul>

        <h3 class="section-title">Instructions</h3>
        <p id="modal-instructions" class="instructions"></p>

        <h3 class="section-title">Watch Tutorial</h3>
        <a id="modal-video" class="tutorial-link" href="#" target="_blank">
            ▶ Watch on YouTube
        </a>
      </div>
*/
