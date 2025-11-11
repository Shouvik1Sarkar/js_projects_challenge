const user_input = document.getElementById("username");
const search_btn = document.getElementById("search-btn");
const username = document.getElementById("name");
const profile_div = document.getElementById("profile");
const img = document.getElementById("avatar");
const bio = document.getElementById("bio");
const error_div = document.getElementById("error");

const followers = document.getElementById("followers");
const repos_div = document.getElementById("repos");
const top_repo = document.getElementById("top-repo");

const lang_stat = document.getElementById("sum");

const profile_link = document.getElementById("profile-link");

async function fetch_data(user_input) {
  try {
    const promise = await fetch(`https://api.github.com/users/${user_input}`);
    const parsed_data = await promise.json();
    console.log(parsed_data);
    return parsed_data;
  } catch (error) {
    profile_div.classList.add("hidden");
    error_div.classList.remove("hidden");

    error_div.innerText = `Error fetching data: ${error.message}`;
  }
}
async function repos(user_input) {
  try {
    const promise = await fetch(
      `https://api.github.com/users/${user_input}/repos`
    );
    const parsed_data = await promise.json();
    return parsed_data;
  } catch (error) {
    error_div.classList.remove("hidden");
    profile_div.classList.add("hidden");
    error_div.innerText = `Error fetching data: ${error.message}`;
  }
}
let language_store = {};
let sum = 0;

async function language(user_input, repo) {
  const langRes = await fetch(
    `https://api.github.com/repos/${user_input}/${repo}/languages`
  );

  const parsed_data = await langRes.json();
  console.log("PARSED DATA: ", parsed_data);
  // for (const key in parsed_data) {
  //   language_store[key] = (language_store[key] || 0) + parsed_data[key];
  // }
  // for (const key in language_store) {
  //   sum += language_store[key];
  // }
  // // for (let i = 0; i < Object.keys(language_store).length; i++) {
  // for (const key in language_store) {
  //   const ptag = document.createElement("h4");
  //   ptag.innerHTML = `${key}: ${(language_store[key] / sum) * 100}`;
  //   lang_stat.appendChild(ptag);
  // }

  // console.log("Lang: ", language_store);
  return parsed_data;
}

search_btn.addEventListener("click", async () => {
  const user = user_input.value.trim();
  if (!user) return;

  error_div.classList.add("hidden");
  profile_div.classList.add("hidden");
  lang_stat.classList.add("hidden");
  lang_stat.innerHTML = "";
  let language_store = {};
  let sum = 0;

  // Add loading state
  search_btn.disabled = true;
  search_btn.textContent = "Loading...";
  try {
    const get_data = await fetch_data(user);
    if (!get_data) {
      throw new Error("Unexpected repo data format.");
    }
    if (get_data.message == "Not Found") {
      profile_div.classList.add("hidden");
      error_div.classList.remove("hidden");
      error_div.innerText = "USER NOT FOUND";
      return;
    }
    profile_div.classList.remove("hidden");
    console.log("get data: ", get_data);
    img.src = get_data.avatar_url;
    username.innerText = get_data.name;
    bio.innerText = get_data.bio || "No bio available.";
    followers.innerText = get_data.followers;

    const repo_count = await repos(user);
    console.log("repo count: ", repo_count);
    if (!Array.isArray(repo_count))
      throw new Error("Unexpected repo data format.");
    repos_div.innerText = repo_count.length;
    profile_link.href = `https://github.com/${user}`;
    console.log("USER: ", user);
    console.log(typeof repo_count);
    if (repo_count.length > 0) {
      const topRepos = repo_count
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);

      console.log("top-repos", topRepos);
      //   top_repo.innerText = topRepos;
      top_repo.innerText =
        // `${topRepos[0].name} - ⭐(${topRepos[0].stargazers_count})` || "N/A";
        topRepos.map((e) => `\n${e.name} - ⭐${e.stargazers_count}`).join(",");
      let parsed_data = await Promise.all(
        topRepos.map((repo) => language(user, repo.name))
      );
      console.log("PARSED DATA:------ ", parsed_data);
      if (parsed_data.message === "API rate limit exceeded") {
        error_div.innerText = `GitHub API rate limit exceeded. Try again later.`;
        throw new Error("GitHub API rate limit exceeded. Try again later.");
      }
      // for (const key in parsed_data) {
      //   console.log("xxxxxxx: ", key);
      //   language_store[key] = (language_store[key] || 0) + parsed_data[key];
      // }
      parsed_data.forEach((repoLangObj) => {
        for (const [lang, bytes] of Object.entries(repoLangObj)) {
          language_store[lang] = (language_store[lang] || 0) + bytes;
        }
      });

      console.log("language: ", language_store);

      for (const key in language_store) {
        sum += language_store[key];
      }

      // Display language stats
      lang_stat.classList.remove("hidden");

      for (const key in language_store) {
        const ptag = document.createElement("p");
        const language_name = document.createElement("span");
        const language_num = document.createElement("span");

        language_name.classList.add("language_name");
        language_num.classList.add("language_num");

        console.log("language store in loop: ", language_store);
        console.log("language store key in loop: ", key);
        console.log("language store value in loop: ", language_store[key]);
        language_name.innerText = `${key}: `;
        language_num.innerText = `${((language_store[key] / sum) * 100).toFixed(
          2
        )}%`;

        // ptag.innerHTML = `${language_name}: ${language_num}%`;
        ptag.appendChild(language_name);
        ptag.appendChild(language_num);
        lang_stat.appendChild(ptag);
      }

      // console.log("Lang: ", language_store);
    } else {
      top_repo.innerText = "No Repositories Found";
    }
  } catch (error) {
    profile_div.classList.add("hidden");
    error_div.classList.remove("hidden");
    const get_data = await fetch_data(user);
    if (
      get_data.message.slice(0, "API rate limit exceeded".length) ==
      "API rate limit exceeded"
    ) {
      error_div.innerText = "API rate limit exceeded";
      throw new Error("API rate limit exceeded.");
    } else {
      error_div.innerText = error.message;
      console.log(get_data.message);
    }
  } finally {
    // Reset loading state
    search_btn.disabled = false;
    search_btn.textContent = "Search";
  }
});
