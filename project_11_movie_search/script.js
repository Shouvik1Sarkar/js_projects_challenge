import { moview_api } from "../api_key.js";

const searchInput = document.getElementById("searchInput");
const btn = document.getElementById("btn");
const category = document.getElementById("category");
const result_container = document.getElementById("result_container");
let movie_val = "";
const pageNumber = document.getElementById("pageNumber");
let types = "";
let year = "";
let page = 1;
let max_page = 1;
const search_for = document.getElementById("search_for");
const logo = document.getElementById("logo");
const pagination_id = document.getElementById("pagination_id");
// const modal_body = document.getElementById("modal_body");
const modal_content = document.getElementById("modal-content");
const parent_container = document.getElementById("parent_container");

const movieModal = document.getElementById("movieModal");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
// const closeModal = document.getElementById("closeModal");
const movieModal_skeleton = document.getElementById("movieModal_skeleton");
const favoritesSection = document.getElementById("favoritesSection");
const fav_section = document.getElementById("fav_section");
const favoritesContainer = document.getElementById("favoritesContainer");
const search_container = document.getElementById("search_container");

let favourite_list = [];

prevBtn.classList.add("hidden");

category.addEventListener("change", () => {
  types = category.value;
});
function home_load() {
  pagination_id.classList.add("hidden");
  action("kids", 1);
}

// result_container.innerHTML = "";
logo.addEventListener("click", () => {
  localStorage.removeItem("page_no");
  location.reload();
});

window.addEventListener("load", () => {
  const retirieved_data = JSON.parse(localStorage.getItem("page_no"));
  if (!retirieved_data) {
    home_load();
    return;
  }
  // console.log(retirieved_data);
  // console.log(retirieved_data.page);
  // console.log(retirieved_data.movie_name);
  // console.log(retirieved_data.types);

  page = retirieved_data.page;
  movie_val = retirieved_data.movie_name;
  types = retirieved_data.types;
  search_for.innerHTML = `Showing result for "${movie_val.toUpperCase()}"`;

  action(movie_val, page);
});

function api_fetch(movie_name, types, year, page) {
  const stored_data = {};
  stored_data.movie_name = movie_name;
  stored_data.types = types;
  stored_data.page = page;
  localStorage.setItem("page_no", JSON.stringify(stored_data));
  return fetch(
    `https://www.omdbapi.com/?apikey=${moview_api}&s=${movie_name}&type=${types}&y=${year}&page=${page}`
    // `https://www.omdbapi.com/?apikey=6c0af67a&i=tt3896198`
  );
}
btn.addEventListener("click", () => {
  page = 1;
  const movie_name = searchInput.value;
  movie_val = movie_name;
  pagination_id.classList.remove("hidden");
  action(movie_name, page);
  search_for.innerHTML = `Showing result for "${movie_name.toUpperCase()}"`;
});

function showSkeletonLoader() {
  result_container.innerHTML = "";

  for (let i = 0; i < 10; i++) {
    const skeleton = document.createElement("div");
    skeleton.classList.add("skeleton-card");

    skeleton.innerHTML = `
      <div class="skeleton poster"></div>
      <div class="skeleton title"></div>
      <div class="skeleton line"></div>
      <div class="skeleton line"></div>
    `;

    result_container.appendChild(skeleton);
  }
}
function showSkeletonLoaderDetail() {
  movieModal_skeleton.innerHTML = "";
  movieModal_skeleton.classList.remove("hidden");

  const skeleton = document.createElement("div");
  skeleton.classList.add("modal-skeleton");

  skeleton.innerHTML = `
      <div class="skeleton poster-big"></div>

      <div class="skeleton title-big"></div>
      <div class="skeleton line"></div>
      <div class="skeleton line"></div>
      <div class="skeleton line"></div>
      <div class="skeleton line small"></div>
      <div class="skeleton line small"></div>
  `;

  movieModal_skeleton.appendChild(skeleton);
}

function action(movie_name, page) {
  result_container.innerHTML = "";
  if (movie_name.trim() === "") return;
  // show loading animation
  showSkeletonLoader();
  api_fetch(movie_name, types, year, page)
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      result_container.innerHTML = "";
      console.log("datta: ", data);
      // console.log(data.Response);
      // console.log(data.Search);
      if (data.Response === "False") {
        result_container.innerHTML = "<p>No results found.</p>";
        return;
      }
      max_page = Math.floor(data.totalResults / 10) + 1;
      for (const key of data.Search) {
        const card = document.createElement("div");
        card.classList.add("card");
        const poster = document.createElement("img");
        const title = document.createElement("h3");
        const year = document.createElement("p");
        const content_type = document.createElement("p");
        const imdbID = key.imdbID;
        let book_marked = false;
        // console.log("KKKKK: ", key);
        // console.log("KKKKK: ", imdbID);

        poster.src = key.Poster;
        title.innerHTML = key.Title;
        year.innerHTML = key.Year;
        content_type.innerHTML = key.Type;

        card.appendChild(poster);
        card.appendChild(title);
        card.appendChild(year);
        card.appendChild(content_type);
        result_container.appendChild(card);

        car_click(card, imdbID, book_marked);
      }
      // poster.src = data.
      pageNumber.innerHTML = page;

      searchInput.value = "";
    })
    .catch((e) => {
      console.log("ERROR: ", e);
    });
}

prevBtn.addEventListener("click", () => {
  if (page > 1) {
    page -= 1;
    nextBtn.classList.remove("hidden");

    if (page === 1) {
      prevBtn.classList.add("hidden");
    }

    action(movie_val, page);
  }
});

nextBtn.addEventListener("click", () => {
  if (page < max_page) {
    page += 1;
    prevBtn.classList.remove("hidden");

    if (page === max_page) {
      nextBtn.classList.add("hidden");
    }

    action(movie_val, page);
  }
});
{
  /* <button id="bookmarkBtn" class="bookmark-btn">⭐ Bookmark</button> */
}
function car_click(card, imdbID, book_marked) {
  card.addEventListener("click", () => {
    showSkeletonLoaderDetail();

    setTimeout(() => {
      movieModal_skeleton.classList.add("hidden");
      movieModal.classList.remove("hidden");
    }, 500);
    // show_favourites(imdbID);
    display_details(imdbID, book_marked);
  });
}

function display_details(imdbID, book_marked) {
  fetch(`https://www.omdbapi.com/?apikey=${moview_api}&i=${imdbID}`)
    .then((data) => data.json())
    .then((data) => {
      console.log("DATA: ", data);

      const image = document.createElement("img");
      image.id = "modalPoster";

      const bookmarkBtn = document.createElement("span");
      bookmarkBtn.id = "bookmarkBtn";
      bookmarkBtn.classList.add("bookmark-btn");
      bookmarkBtn.innerHTML = `⭐ Bookmark`;

      const closeModal = document.createElement("span");
      closeModal.id = "closeModal";
      closeModal.classList.add("close");
      closeModal.innerHTML = `&times;`;

      const modal_details = document.createElement("div");
      modal_details.id = "modal_details";
      modal_details.classList.add("modal-details");

      const modal_body = document.createElement("div");
      modal_body.id = "modal_body";
      modal_body.classList.add("modal-body");

      const modalTitle = document.createElement("h2");
      modalTitle.id = "modalTitle";

      const modalYear = document.createElement("p");
      modalYear.id = "modalYear";

      const modalType = document.createElement("p");
      modalType.id = "modalType";

      const modalRated = document.createElement("p");
      modalRated.id = "modalRated";

      const modalReleased = document.createElement("p");
      modalReleased.id = "modalReleased";

      const modalRuntime = document.createElement("p");
      modalRuntime.id = "modalRuntime";

      const modalGenre = document.createElement("p");
      modalGenre.id = "modalGenre";

      const modalDirector = document.createElement("p");
      modalDirector.id = "modalDirector";

      const modalActors = document.createElement("p");
      modalActors.id = "modalActors";

      const modalPlot = document.createElement("p");
      modalPlot.id = "modalPlot";

      // const book_mark = document.createElement("p");
      // book_mark.id = "bookmarkBtn";

      bookmarkBtn.addEventListener("click", () => {
        toggleBookmark(data, imdbID);
        console.log("FAVOURITE LIST: ", favourite_list);
      });

      image.src = data.Poster;

      modalTitle.innerHTML = data.Title;
      modalYear.innerHTML = `<span class="label">Year:</span> <span class="modal_data">${data.Year}</span>`;
      modalType.innerHTML = `<span class="label">Type:</span> <span class="modal_data">${data.Type}</span>`;
      modalRated.innerHTML = `<span class="label">Rating:</span> <span class="modal_data">${data.Rated}</span>`;
      modalReleased.innerHTML = `<span class="label">Released:</span> <span class="modal_data">${data.Released}</span>`;
      modalRuntime.innerHTML = `<span class="label">Duration:</span> <span class="modal_data">${data.Runtime}</span>`;
      modalGenre.innerHTML = `<span class="label">Genre:</span> <span class="modal_data">${data.Genre}</span>`;
      modalDirector.innerHTML = `<span class="label">Director:</span> <span class="modal_data">${data.Director}</span>`;
      modalActors.innerHTML = `<span class="label">Actors:</span> <span class="modal_data">${data.Actors}</span>`;
      modalPlot.innerHTML = `<span class="label">Plot:</span> <span class="modal_data">${data.Plot}</span>`;

      modal_details.appendChild(modalTitle);
      modal_details.appendChild(bookmarkBtn);
      modal_details.appendChild(modalYear);
      modal_details.appendChild(modalType);
      modal_details.appendChild(modalRated);
      modal_details.appendChild(modalReleased);
      modal_details.appendChild(modalRuntime);
      modal_details.appendChild(modalGenre);
      modal_details.appendChild(modalDirector);
      modal_details.appendChild(modalActors);
      modal_details.appendChild(modalPlot);

      // modal_body.appendChild(image);
      modal_body.appendChild(image);
      modal_body.appendChild(modal_details);

      modal_content.appendChild(closeModal);

      modal_content.appendChild(modal_body);

      close_button(closeModal, modal_content);
      const retirieved_fav = JSON.parse(localStorage.getItem("favourite"));
      // console.log("r: ", retirieved_fav);
      favourite_list = retirieved_fav || [];

      // favourite_list.forEach((e) => {
      //   if (e.imdbID == data) {

      //   }
      // });
      const exists = favourite_list.find((m) => m.imdbID === data.imdbID);
      if (!exists) {
        bookmarkBtn.innerHTML = `⭐ Bookmark`;
      } else {
        bookmarkBtn.innerHTML = `⭐ Bookmarked 👍`;
      }
    })
    .catch((e) => console.log("ERROR: ", e));
}

// function book_mark_click(book_mark, data, imdbID) {
//   book_mark.addEventListener("click", () => {
//     toggleBookmark(data, imdbID);
//   });
// }

function toggleBookmark(data) {
  const exists = favourite_list.find((m) => m.imdbID === data.imdbID);
  let fav_data = {};

  if (!exists) {
    fav_data.imdbID = data.imdbID;
    fav_data.title = data.Title;
    favourite_list.push(fav_data); // add
    bookmarkBtn.innerHTML = `⭐ Bookmarked 👍`;
  } else {
    favourite_list = favourite_list.filter((m) => m.imdbID !== data.imdbID); // remove
    bookmarkBtn.innerHTML = `⭐ Bookmark`;
  }
  localStorage.setItem("favourite", JSON.stringify(favourite_list));
  console.log("FAV LIST", favourite_list);
}

// function renderBookmarks(bookmarkBtn) {
//   if (condition) {

//   }

// }

function close_button(closeModal, modal_content) {
  closeModal.addEventListener("click", () => {
    modal_content.innerHTML = "";
    movieModal.classList.add("hidden");
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    movieModal.classList.add("hidden");
    // favoritesSection.classList.add("hidden");
    result_container.classList.remove("hidden");
    fav_section.classList.remove("hidden");
    favoritesSection.classList.add("hidden");
    pagination_id.classList.remove("hidden");
    search_container.classList.remove("hidden");
  }
});

function show_favourites(imdbID) {
  fetch(`https://www.omdbapi.com/?apikey=${moview_api}&i=${imdbID}`)
    .then((data) => data.json())
    .then((data) => {
      // favoritesContainer.innerHTML = ""; // CLEAR OLD CARDS
      const card = document.createElement("div");
      card.classList.add("card");
      const poster = document.createElement("img");
      const title = document.createElement("h3");
      const year = document.createElement("p");
      const content_type = document.createElement("p");
      // const imdbID = key.imdbID;
      let book_marked = false;
      // console.log("KKKKK: ", key);
      // console.log("KKKKK: ", imdbID);

      poster.src = data.Poster;
      title.innerHTML = data.Title;
      year.innerHTML = data.Year;
      content_type.innerHTML = data.Type;

      card.appendChild(poster);
      card.appendChild(title);
      card.appendChild(year);
      card.appendChild(content_type);
      favoritesContainer.appendChild(card);
      favoritesSection.appendChild(favoritesContainer);
      car_click(card, imdbID, book_marked);
    })
    .catch((e) => {
      console.log("ERROR: ", e);
    });
}
fav_section.addEventListener("click", () => {
  favoritesContainer.innerHTML = "";
  const get_fav = JSON.parse(localStorage.getItem("favourite"));
  favourite_list = get_fav || [];

  favourite_list.forEach((e) => {
    show_favourites(e.imdbID);
  });
  favoritesSection.classList.remove("hidden");
  result_container.classList.add("hidden");
  fav_section.classList.add("hidden");
  pagination_id.classList.add("hidden");
  search_container.classList.add("hidden");
});
document.getElementById("closeFav").addEventListener("click", () => {
  result_container.classList.remove("hidden");
  fav_section.classList.remove("hidden");
  favoritesSection.classList.add("hidden");
  pagination_id.classList.remove("hidden");
  search_container.classList.remove("hidden");
});
