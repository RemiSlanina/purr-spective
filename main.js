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

    const response = generateJudgment(codeInput.value);
    let responseString = "";
    // no response?
    if (response.length === 0) {
      const praise = [
        "🐈 The cat ran your code through its brain. It came out the other side unchanged. 🧠🐾\n",
        "🐈 No syntax errors detected. The cat is still unimpressed 🎭\n",
        "🐈 🐾 (Translation: The cat has no notes. This time.)\n",
        "🐈 The cat linted your code and found only void. The void lints back.\n",
      ];
      responseString = praise[Math.floor(Math.random() * praise.length)];
    } else {
      response.forEach((r) => {
        responseString += r + "\n";
      });
    }

    const reviewElement = document.createElement("p");
    reviewElement.textContent = `Cat says: \n\n${responseString}`;
    reviewElement.style.whiteSpace = "pre-line"; // preserves \n

    const adviceElement = document.createElement("p");
    adviceElement.textContent = `Final judgment: ${randomAdvice.comment}`;

    reviewOutput.appendChild(imgElement);
    reviewOutput.appendChild(reviewElement);
    reviewOutput.appendChild(adviceElement);

    // Optional: Display user's code if provided
    if (codeInput.value.trim()) {
      const codeElement = document.createElement("pre");
      codeElement.textContent = `Your code:\n${codeInput.value}`;
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
    "https://api.thecatapi.com/v1/images/search?limit=5",
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

async function fetchSnarkyAdvice() {
  const response = await fetch("snark.json");
  const data = await response.json();
  return data;
}

// also catches this strangely: let x let y let hello
function detectTinyVariables(code) {
  // edge cases: let x_y or var $x would slip through
  // \b word border, \s = whitespace /g = global
  const matches = code.match(/\b(let|const|var)\s+([a-zA-Z])\b/g);
  return matches ? matches.length : 0;
}

function generateJudgment(code) {
  const judgmentalList = [];
  if (!code.trim()) {
    judgmentalList.push("🐈 No code at all? Bad human.");
  }
  console.log(judgmentalList);
  // Regexp: word border: code includes var
  if (/\bvar\b/.test(code)) {
    judgmentalList.push("🐈 var detected. The cat is disappointed.");
  }
  // REGEXP expression: do not use eval
  // eval bad
  // https://www.w3schools.com/jsref/jsref_eval.asp
  if (/eval\s*\(/.test(code)) {
    judgmentalList.push("🐈 eval detected. Danger. The cat is hissing.");
  }
  if (/innerHTML\s*=/g.test(code)) {
    judgmentalList.push(
      "🐈 innerHTML? The cat is concerned about XSS. Use textContent.",
    );
  }
  if (/10px\b/.test(code)) {
    judgmentalList.push("🐈 Why only 10px?  The cat demands more space!");
  }
  // look for long lines
  const longLine = code.split("\n").some((l) => l.length > 120);
  if (longLine) {
    judgmentalList.push("🐈 This line is longer than the cat's tail.");
  }
  // ;;
  if (/;;+/.test(code)) {
    judgmentalList.push("🐈 The cat wonders why there are so many semicolons.");
  }
  // one character variables?
  if (detectTinyVariables(code) >= 3) {
    judgmentalList.push("🐈 The cat wonders what this variable means...");
  }
  // inifinite loop paranoia
  if (/while\s*\(true\)/.test(code)) {
    judgmentalList.push(
      "🐈 while (true)? Infinite loop detected. The cat has left the building.",
    );
  }

  // to be continued...
  return judgmentalList;
}

/* Combine cat images with snarky advice */
/* console only:  */
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

// Test fetching cat images
// console.log("Fetching a cat image...");
// fetchCatImage()
//   .then((url) => {
//     console.log("Here’s your cat, you monster:", url);
//   })
//   .catch((error) => {
//     console.error("The cats have rejected you:", error);
//   });
