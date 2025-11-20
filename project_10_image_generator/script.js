const image = document.getElementById("random-img");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const copyBtn = document.getElementById("copyBtn");
let url;
fetch("https://picsum.photos/v2/list").then((res) => {
  console.log(res.headers.get("content-type"));
});
function api_fetch() {
  return fetch("https://picsum.photos/v2/list");
}

generateBtn.addEventListener("click", () => {
  api_fetch()
    .then((res) => res.json())
    .then((data) => {
      const random_number = Math.floor(Math.random() * 31);
      image.src = data[random_number].download_url;
      console.log(data[random_number].download_url);
      url = data[random_number].download_url;
    });
});
copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(url);
  } catch (error) {
    console.log("ERROR: ", error);
  }
});

downloadBtn.addEventListener("click", async () => {
  const response = await fetch(url, { mode: "cors" });
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = "random-image.jpg";
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(blobUrl);
});
