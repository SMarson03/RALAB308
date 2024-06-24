import * as Carousel from "./Carousel.js";
import axios from "axios";

//I couldn't get this to work. I don't know where I went wrong but will revisit later

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_zpnkHSh34SMfnH4FmtRsAOsbn4zqInP009fLzw2HhpKZlBHBVQV1CDbRA2RY8kED";

axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */
const initialLoad = async () => {
  const response = await axios.get("https://api.thecatapi.com/v1/breeds", {
    headers: {
      "x-api-key": API_KEY,
    },
  });
  response.data.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed.id;
    option.text = breed.name;
    breedSelect.appendChild(option);
  });
};
initialLoad();
/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

breedSelect.addEventListener("change", loadCarousel);
async function loadCarousel() {
  const val = breedSelect.value;
  const url = `/images/search?limit=25&breed_ids=${val}`;

  const res = await axios(url, {
    onDownloadProgress: updateProgress,
  });

  buildCarousel(res.data);
}

const buildCarousel = (data, favourites) => {
  Carousel.clear();
  infoDump.innerHTML = "";

  data.forEach((ele) => {
    const item = Carousel.createCarouselItem(
      ele.url,
      breedSelect.value,
      ele.id
    );
    Carousel.appendCarousel(item);
  });

  if (favourites) {
    infoDump.innerHTML = "Here are your saved favourites!";
  } else if (data[0]) {
    const info = data[0].breeds || null;
    if (info && info[0].description) infoDump.innerHTML = info[0].description;
  } else {
    infoDump.innerHTML =
      "<div class='text-center'>No information on this breed, sorry!</div>";
  }

  Carousel.start();
};

/**
 * 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."
 */
/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

axios.interceptors.request.use((request) => {
  console.log("Request Started.");
  progressBar.style.transition = "none";
  progressBar.style.width = "0%";
  document.body.style.setProperty("cursor", "progress", "important");

  request.metadata = request.metadata || {};
  request.metadata.startTime = new Date().getTime();

  return request;
});

axios.interceptors.response.use(
  (response) => {
    response.config.metadata.endTime = new Date().getTime();
    response.config.metadata.durationInMS =
      response.config.metadata.endTime - response.config.metadata.startTime;

    console.log(
      `Request took ${response.config.metadata.durationInMS} milliseconds.`
    );
    document.body.style.cursor = "default";
    return response;
  },
  (error) => {
    error.config.metadata.endTime = new Date().getTime();
    error.config.metadata.durationInMS =
      error.config.metadata.endTime - error.config.metadata.startTime;

    console.log(
      `Request took ${error.config.metadata.durationInMS} milliseconds.`
    );
    document.body.style.cursor = "default";
    throw error;
  }
);

