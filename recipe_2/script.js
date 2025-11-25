// ===== Rewritten script (same architecture, .then() promises) =====

// DOM refs (kept same names)
const grid = document.getElementById("grid_id");
const search = document.getElementById("search");
const user_input = document.getElementById("user_input");
const brand_id = document.getElementById("brand_id");
const error_text = document.getElementById("error_text");
const errormessage = document.getElementById("errormessage");
const chips = document.querySelectorAll(".chip");
const card_items = document.querySelectorAll(".card-item");
const saved_grid = document.getElementById("saved-grid");
const recipe_modal = document.getElementById("recipe-modal");
const content_container = document.getElementById("content_container");
const sort = document.getElementById("sort");

// state (kept same-ish)
let dish_name = "";
let saved_items = JSON.parse(localStorage.getItem("saved_dishes")) || [];

// CHANGE: Add a simple in-memory cache so we avoid repeating the same fetch many times.
// This keeps the same API usage style (.then) but reduces network calls.
const recipeCache = {};

// Utility: cached fetch wrapper
function get_recipe_cached(name) {
  const key = String(name || "")
    .trim()
    .toLowerCase();
  if (!key) return Promise.resolve({ meals: null }); // graceful
  if (recipeCache[key]) {
    return Promise.resolve(recipeCache[key]);
  }
  return fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
      name
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      recipeCache[key] = data; // cache the raw response
      return data;
    })
    .catch((e) => {
      console.error("Fetch error:", e);
      return { meals: null };
    });
}

// KEEP: original get_recipe for compatibility if needed (uses cache internally)
function get_recipe(user_input) {
  return get_recipe_cached(user_input);
}

// CHANGE: helper to safely check meals response
function hasMeals(data) {
  return (
    data && data.meals && Array.isArray(data.meals) && data.meals.length > 0
  );
}

// CHANGE: reuse render function to avoid repeated logic across handlers
function displayRecipesList(dishes_list) {
  grid.innerHTML = ""; // okay to clear main grid
  for (let i = 0; i < dishes_list.length; i++) {
    const dish = dishes_list[i];
    if (i === 0) {
      featured_dish_card_onreload(dish);
    } else {
      small_dish_card_onreload(dish);
    }
  }
  // CHANGE: update save-buttons after we've appended cards
  update_all_save_buttons();
}

// CHANGE: fix `sort` handler bug (use location_value consistently and show correct error)
sort.addEventListener("change", () => {
  const location_value = sort.value;
  if (!location_value || location_value.trim() === "") {
    return;
  }

  fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
      location_value
    )}`
  )
    .then((res) => res.json())
    .then((data) => {
      // Note: this API returns meals array with id & thumb; keep behaviour but guard nulls
      if (!data || !data.meals || data.meals.length === 0) {
        grid.innerHTML = "";
        error_text.innerHTML = `Recipe for ${location_value} is not available`; // CHANGE: use correct var
        errormessage.classList.remove("hidden");
        return;
      }
      errormessage.classList.add("hidden");

      // The filter.php returns less info than search.php. We'll just map it into call flow.
      displayRecipesList(data.meals);
    })
    .catch((e) => {
      console.error("Sort fetch error:", e);
      errormessage.classList.remove("hidden");
      error_text.innerHTML = `Unable to fetch recipes for ${location_value}`;
    });
});

// KEEP: retrieve saved items from localStorage (initial)
saved_items = JSON.parse(localStorage.getItem("saved_dishes")) || [];

// CHANGE: click handler for chips - uses cached get_recipe and reuses display function
chips.forEach((element) => {
  element.addEventListener("click", () => {
    errormessage.classList.add("hidden");
    localStorage.setItem("dish_name", element.innerText.trim());
    get_recipe(element.innerText.trim()).then((data) => {
      if (!hasMeals(data)) {
        error_text.innerHTML = `Recipe for ${element.innerText.trim()} is not available`;
        errormessage.classList.remove("hidden");
        return;
      }
      errormessage.classList.add("hidden");
      displayRecipesList(data.meals);
    });
  });
});

// featured and small card functions (kept architecture but improved)
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
  const category = document.createElement("div");
  const origin = document.createElement("div");
  const save_button = document.createElement("button");
  save_button.classList.add("save-button");

  // CHANGE: store dish name on dataset for update_all_save_buttons
  save_button.dataset.dish = dish.strMeal;

  featured_timing_div.classList.add("featured_timing_div");
  category.classList.add("pill");
  origin.classList.add("pill");

  image.src = dish.strMealThumb || "";
  title.textContent = dish.strMeal || "Unknown dish";
  p.textContent = `Creamy, comforting and elegant — perfect for weekend dinner.`; // kept placeholder
  category.textContent = dish.strCategory || "";
  origin.textContent = dish.strArea || "";

  featured_timing_div.appendChild(category);
  featured_timing_div.appendChild(origin);

  info.appendChild(title);
  info.appendChild(p);
  info.appendChild(featured_timing_div);

  article.appendChild(save_button);
  article.appendChild(image);
  article.appendChild(info);
  grid.appendChild(article);

  // CHANGE: attach save handler after element is in DOM, and then update save icons
  save_item_function(save_button, dish.strMeal);
  // update_all_save_buttons(); // moved to caller or will be called after batch rendering
  click_card(article, dish);
}

function small_dish_card_onreload(dish) {
  const article = document.createElement("article");
  article.classList.add("card-item");

  const image = document.createElement("img");
  const card_body = document.createElement("div");
  card_body.classList.add("card_body");
  const title = document.createElement("h3");

  const meta = document.createElement("div");
  const category = document.createElement("div");
  const origin = document.createElement("div");
  const save_button = document.createElement("button");
  save_button.classList.add("save-button");

  save_button.dataset.dish = dish.strMeal;

  meta.classList.add("meta");
  category.classList.add("muted");
  origin.classList.add("muted");

  image.src = dish.strMealThumb || "";
  title.textContent = dish.strMeal || "Unknown dish";
  category.textContent = dish.strCategory || "";
  origin.textContent = dish.strArea || "";

  meta.appendChild(category);
  meta.appendChild(origin);
  card_body.appendChild(title);
  card_body.appendChild(meta);

  article.appendChild(save_button);
  article.appendChild(image);
  article.appendChild(card_body);
  grid.appendChild(article);

  // CHANGE: attach save handler after adding to DOM
  save_item_function(save_button, dish.strMeal);
  click_card(article, dish);
  // update_all_save_buttons will be called by caller after all cards are added
}

// SEARCH button click (kept architecture)
search.addEventListener("click", () => {
  if (user_input.value.trim() === "") return;
  const value = user_input.value.trim();

  get_recipe(value).then((data) => {
    if (!hasMeals(data)) {
      grid.innerHTML = "";
      error_text.innerHTML = `Recipe for ${value} is not available`;
      errormessage.classList.remove("hidden");
      return;
    }

    console.log("DATA PASSED FROM GET RECIPE: ", data);
    console.log("SAVED DATA IN THE CACHE: ", recipeCache);

    errormessage.classList.add("hidden");
    displayRecipesList(data.meals);
  });

  localStorage.setItem("dish_name", value);
  user_input.value = "";
});

// BRAND button click (kept behavior)
brand_id.addEventListener("click", () => {
  localStorage.removeItem("dish_name");
  get_recipe("sweet").then((data) => {
    if (!hasMeals(data)) {
      error_text.innerHTML = `Recipe for sweet is not available`;
      errormessage.classList.remove("hidden");
      return;
    }
    displayRecipesList(data.meals);
  });
});

// On load: fetch last used or default and render saved items.
// CHANGE: avoid duplicate saved display by rendering saved_grid from saved_items only once.
window.addEventListener("load", () => {
  const retrieved_value = localStorage.getItem("dish_name") || "sweet";
  saved_grid.innerHTML = "";

  get_recipe(retrieved_value).then((data) => {
    if (!hasMeals(data)) {
      error_text.innerHTML = `Recipe for ${retrieved_value} is not available`;
      errormessage.classList.remove("hidden");
      return;
    }
    displayRecipesList(data.meals);
  });

  // render saved items (no duplicates)
  refresh_saved_section();
});

// CHANGE: save button handling kept similar but improved to avoid redundant fetches and re-render
function save_item_function(save_button, title) {
  save_button.addEventListener("click", (e) => {
    e.stopPropagation();
    const item_data = { name: title };

    const exists = saved_items.find((s) => s.name === title);

    if (!exists) {
      // ADD
      save_button.innerHTML = "⭐";
      saved_items.push(item_data);

      // CHANGE: use cached fetch and then render the saved card
      get_recipe(title).then((dishData) => {
        if (hasMeals(dishData)) {
          // prepend to saved grid so newest saved shows first (optional)
          saved_dish_card(dishData.meals[0], true);
        }
      });
    } else {
      // REMOVE
      save_button.innerHTML = "💾";
      saved_items = saved_items.filter((s) => s.name !== title);

      // CHANGE: refresh saved section only once after update
      refresh_saved_section();
    }

    localStorage.setItem("saved_dishes", JSON.stringify(saved_items));
    update_all_save_buttons();
  });
}

// saved_dish_card: accepts an optional prepend flag
function saved_dish_card(dish, prepend = false) {
  // guard
  if (!dish) return;

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

  image.src = dish.strMealThumb || "";
  title.textContent = dish.strMeal || "Unknown";
  category.textContent = dish.strCategory || "";
  origin.textContent = dish.strArea || "";

  meta.appendChild(category);
  meta.appendChild(origin);
  card_body.appendChild(title);
  card_body.appendChild(meta);

  article.appendChild(image);
  article.appendChild(card_body);

  // CHANGE: prevent duplicates in saved grid by checking existing names
  const existing = Array.from(saved_grid.querySelectorAll("h3")).find(
    (h3) => h3.textContent === dish.strMeal
  );
  if (existing) return;

  if (prepend && saved_grid.firstChild) {
    saved_grid.insertBefore(article, saved_grid.firstChild);
  } else {
    saved_grid.appendChild(article);
  }

  click_card(article, dish);
}

// CHANGE: single place to render all saved items from saved_items
function refresh_saved_section() {
  saved_grid.innerHTML = ""; // okay to clear, we'll re-add
  if (!Array.isArray(saved_items) || saved_items.length === 0) return;

  // Use Promise.all to render once all fetches resolve (optional)
  const promises = saved_items.map((s) => get_recipe(s.name));
  Promise.all(promises)
    .then((results) => {
      results.forEach((data) => {
        if (hasMeals(data)) {
          saved_dish_card(data.meals[0]);
        }
      });
    })
    .catch((e) => {
      console.error("Error refreshing saved section:", e);
    });
}

// click_card: open modal with details (kept architecture but fixed ingredients parsing & modal cleanup)
function click_card(article, dish) {
  article.addEventListener("click", () => {
    recipe_modal.classList.remove("hidden");

    // CHANGE: clear modal content first to ensure no stale content remains
    recipe_modal.innerHTML = "";

    // CHANGE: hide main content container (kept)
    if (content_container) content_container.classList.add("hidden");

    // --- Bookmark Button ---
    const bookmark_button = document.createElement("button");
    bookmark_button.classList.add("bookmark-btn");
    bookmark_button.dataset.dish = dish.strMeal;

    const exists = saved_items.find((e) => e.name == dish.strMeal);
    bookmark_button.innerHTML = exists ? "⭐" : "💾";

    const modal_content = document.createElement("div");
    modal_content.classList.add("modal-content");

    const close_button = document.createElement("button");
    close_button.classList.add("close-btn");
    close_button.innerHTML = "✕";

    close_button.addEventListener("click", (ev) => {
      recipe_modal.classList.add("hidden");
      recipe_modal.innerHTML = "";
      if (content_container) content_container.classList.remove("hidden");
    });

    const tutorial_title = document.createElement("h3");
    tutorial_title.classList.add("section-title");
    tutorial_title.textContent = "Watch Tutorial";

    const tutorial_link = document.createElement("a");
    tutorial_link.classList.add("tutorial-link");
    tutorial_link.id = "modal-video";
    tutorial_link.href = dish.strYoutube || "#";
    tutorial_link.target = "_blank";
    tutorial_link.textContent = "▶ Watch on YouTube";

    const image = document.createElement("img");
    image.id = "modal-img";
    image.src = dish.strMealThumb || "";

    const title = document.createElement("h2");
    title.id = "modal-title";
    title.textContent = dish.strMeal || "Unknown";

    const ingredients_title = document.createElement("h3");
    ingredients_title.classList.add("section-title");
    ingredients_title.textContent = "Ingredients";

    const list_container = document.createElement("ul");
    list_container.classList.add("ingredients-list");
    list_container.id = "modal-ingredients";

    const instructions_title = document.createElement("h3");
    instructions_title.classList.add("section-title");
    instructions_title.textContent = "Instruction";

    const instructions = document.createElement("p");
    instructions.classList.add("instructions");
    instructions.id = "modal-instructions";
    instructions.textContent = dish.strInstructions || "";

    // CHANGE: Proper ingredient+measure pairing (handles empty/null gracefully)
    for (let i = 1; i <= 20; i++) {
      const ingredient = dish[`strIngredient${i}`];
      const measure = dish[`strMeasure${i}`];
      if (ingredient && ingredient.toString().trim()) {
        const li = document.createElement("li");
        // measure may be null/empty -> fallback to empty string
        li.textContent = `${(
          measure || ""
        ).trim()} ${ingredient.trim()}`.trim();
        list_container.appendChild(li);
      }
    }

    // bookmark toggle inside modal
    bookmark_button.addEventListener("click", (e) => {
      e.stopPropagation();
      const exists = saved_items.find((s) => s.name === dish.strMeal);
      if (exists) {
        saved_items = saved_items.filter((s) => s.name !== dish.strMeal);
        bookmark_button.innerHTML = "💾";
      } else {
        saved_items.push({ name: dish.strMeal });
        bookmark_button.innerHTML = "⭐";
      }
      localStorage.setItem("saved_dishes", JSON.stringify(saved_items));
      update_all_save_buttons();
      refresh_saved_section();
    });

    modal_content.appendChild(close_button);
    modal_content.appendChild(image);
    modal_content.appendChild(bookmark_button);
    modal_content.appendChild(title);
    modal_content.appendChild(ingredients_title);
    modal_content.appendChild(list_container);
    modal_content.appendChild(instructions_title);
    modal_content.appendChild(instructions);
    modal_content.appendChild(tutorial_title);
    modal_content.appendChild(tutorial_link);

    recipe_modal.appendChild(modal_content);
  });
}

// CHANGE: update_all_save_buttons now strictly syncs dataset-dish to icon
function update_all_save_buttons() {
  document.querySelectorAll(".save-button").forEach((btn) => {
    const dishName = btn.dataset.dish;
    const exists = saved_items.find((e) => e.name == dishName);
    btn.innerHTML = exists ? "⭐" : "💾";
  });
}

// END: script
