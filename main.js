// main.js
// 2024 Remi Slanina
// Fetch cat images from cat AI and snarky advice from local JSON file

// vars and constants
const button = document.querySelector(".get-purr-spective");
const reviewOutput = document.getElementById("reviewOutput");
const codeInput = document.getElementById("codeInput");

// Event listener for button click
button.addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent form submission

  // Clear previous output
  reviewOutput.innerHTML = "";

  try {
    const catUrl = await fetchCatImage();
    const adviceList = await fetchSnarkyAdvice();
    const randomAdvice =
      adviceList[Math.floor(Math.random() * adviceList.length)];

    // Display cat image and advice
    const imgElement = document.createElement("img");
    imgElement.src = catUrl;
    imgElement.alt = "Judgmental Cat";
    imgElement.style.maxWidth = "300px";
    imgElement.style.display = "block";
    imgElement.style.marginBottom = "10px";

    const adviceElement = document.createElement("p");
    adviceElement.textContent = `Cat says: ${randomAdvice.comment}`;

    reviewOutput.appendChild(imgElement);
    reviewOutput.appendChild(adviceElement);

    // Optional: Display user's code if provided
    if (codeInput.value.trim()) {
      const codeElement = document.createElement("pre");
      codeElement.textContent = `Your code:\n${codeInput.value}\nI didn't even need to read it to judge you.`;
      reviewOutput.appendChild(codeElement);
    }

    // delete codeInput value after use
    codeInput.value = "";
  } catch (error) {
    console.error("Error displaying cats with advice:", error);
    reviewOutput.textContent =
      "Failed to get purr-spective. The cats are displeased.";
  }
});

/* fetch cat images from the cat API (?limit=5) =  5 images */
async function fetchCatImages() {
  const response = await fetch(
    "https://api.thecatapi.com/v1/images/search?limit=5"
  );
  const data = await response.json();
  return data.map((cat) => cat.url);
}

/* fetch only 1 cat image */
async function fetchCatImage() {
  const response = await fetch("https://api.thecatapi.com/v1/images/search");
  const [cat] = await response.json();
  return cat.url;
}

// Test fetching cat images
console.log("Fetching a cat image...");
fetchCatImage()
  .then((url) => {
    console.log("Here’s your cat, you monster:", url);
  })
  .catch((error) => {
    console.error("The cats have rejected you:", error);
  });

/* 
// Testing cat image
console.log("Fetching cat images...");
fetchCatImages()
    .then(urls => {
        urls.forEach(url => console.log("Here’s your cat, you monster:", url));
    })
    .catch(error => {
        console.error("The cats have rejected you:", error);
    }); */

/* Fetch all snarky advice from data/snark.json */

async function fetchSnarkyAdvice() {
  const response = await fetch("snark.json");
  const data = await response.json();
  return data;
}

/* 
// Test fetching snarky advice
    console.log("Fetching snarky advice...");
    fetchSnarkyAdvice()
        .then(advice => {
            advice.forEach(advice => console.log("Cat says:", advice.comment));
        })
        .catch(error => {
            console.error("Failed to fetch snarky advice:", error);
        });
 */

/* Combine cat images with snarky advice */

async function displayCatsWithAdvice() {
  try {
    const catUrl = await fetchCatImage();
    const adviceList = await fetchSnarkyAdvice();
    const randomAdvice =
      adviceList[Math.floor(Math.random() * adviceList.length)];

    console.log("Behold your feline judge:");
    console.log("Cat Image URL:", catUrl);
    console.log("Cat's Advice:", randomAdvice.comment);
  } catch (error) {
    console.error("Error displaying cats with advice:", error);
  }
}

displayCatsWithAdvice();
