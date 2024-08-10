// -----------------------animations------------------------

function AnimationsforWeather() {
  const timeline = gsap.timeline();
  gsap.from(".weatherhead h1", {
    y: -100,
    duration: 1,
    opacity: 0
  });
  gsap.from(".left label", {
    x: -200,
    duration: 1,
    opacity: 0
  });
  gsap.from(".left input", {
    x: -200,
    duration: 1,
    opacity: 0
  });

  gsap.from(".left p", {
    x: -200,
    duration: 1,
    opacity: 0
  });
  timeline.from(".cityInfoDiv ", {
    x: 600,
    duration: 1,
    opacity: 0
  });
  gsap.from(".cityInfoDiv h1 ", {
    x: 600,
    duration: 1,
    opacity: 0
  });

  timeline.from(".cityInfoDiv h3", {
    x: 600,
    duration: 1,
    opacity: 0,
    stagger: 0.3
  });
  timeline.from("#weatherIcon img", {
    y: -300,
    duration: 0.5,
    opacity: 0
  });
  timeline.from(".Day5", {
    duration: 1,
    opacity: 0
  });
  timeline.from(".fiveDiv div", {
    x: 600,
    duration: 0.6,
    opacity: 0,
    stagger: 0.23
  });
}

AnimationsforWeather();

async function data() {
  loader.style.display = "block";
  const apiKey = "c89a8318a018d5aca771a95bc6e3bb7c";
  const cityName = document.querySelector("input").value;

  document.querySelector("input").value = "";
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const responseJSON = await response.json();
    console.log(responseJSON);
    assignValue(responseJSON);
    let cityNameArray = JSON.parse(localStorage.getItem("cityNameArray")) || [];
    cityNameArray.push({ name: cityName });

    if (cityNameArray.length >= 5) {
      cityNameArray.shift();
    }

    localStorage.setItem("cityNameArray", JSON.stringify(cityNameArray));
  } catch (err) {
    showAlert("Invalid City Name. Please enter a valid city.");
    console.log(err);
  } finally {
    loader.style.display = "none";
  }
}

function assignValue(data) {
  // ----------------Assign City Name--------------------

  console.log(data.city.name);
  const cityNameElement = document.querySelector("#cityName");
  let time = data.list[0].dt_txt;
  let cityName = data.city.name + " " + `(${time} Am) `;
  cityNameElement.textContent =
    cityName.charAt(0).toUpperCase() + cityName.slice(1);

  // ----------------Assign temp --------------------

  let tempElement = document.querySelector("#temp");
  let temp = data.list[0].main.temp - 273.15;
  console.log(data.list[0].main.temp - 273.15);
  temp = temp.toString();
  temp = temp.substring(0, 4);
  tempElement.innerHTML = `<i class="fa-solid text-red-500 fa-temperature-high"></i>  Temperature : ${temp} C°`;

  // ----------------------Assign Wind----------------------------

  console.log(data.list[0].wind.gust);
  let windElement = document.querySelector("#Wind");
  windElement.innerHTML = `<i class="fa-solid text-yellow-400 fa-fan"></i>&nbsp;Wind : ${data
    .list[0].wind.gust} m/s`;

  // ----------------------Assign humidity----------------------------

  console.log(data.list[0].main.humidity);
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = `<i class="fa-solid  text-blue-700 fa-droplet"></i> &nbsp;Humidity :${data
    .list[0].main.humidity} %`;

  // ----------------------------------------------Icon Change----------------------------------------

  let iconCode = data.list[0].weather[0].icon;
  const imgElement = document.querySelector("#imgEl");
  imgElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconCode}.png`
  );
  const iconDesc = document.querySelector("#iconDesc");
  iconDesc.textContent = data.list[0].weather[0].description;

  // -----------------------------------------Bottom Five----------------------------------

  for (let i = 6; i <= 38; i += 8) {
    // ----------------------------Date set for---------------------

    let date = data.list[i].dt_txt.toString();
    date = date.substring(0, 10);
    document.querySelector(`#Date${i}`).textContent = `( ${date} )`;

    // ----------------------------temp set for---------------------

    let temp = data.list[i].main.temp - 273.15;
    temp = temp.toString();
    temp = temp.substring(0, 4);
    document.querySelector(
      `#temp${i}`
    ).innerHTML = `<i class="fa-solid text-red-200 fa-temperature-high"></i>&nbsp;Temp <i
                                    class="fa-solid fa-arrow-right"></i> ${temp} C°`;

    // ----------------------------wind set for---------------------

    document.querySelector(
      `#Wind${i}`
    ).innerHTML = `<i class="fa-solid text-red-200 fa-fan"></i>&nbsp;Wind <i
                                    class="fa-solid fa-arrow-right"></i>  ${data
                                      .list[i].wind.gust} m/s`;

    // ----------------------------humidity set---------------------

    document.querySelector(
      `#humidity${i}`
    ).innerHTML = `<i class="fa-solid  text-red-200 fa-droplet"></i> &nbsp;Humidity <i
                                    class="fa-solid fa-arrow-right"></i> ${data
                                      .list[i].main.humidity} %`;

    // --------------------------Set Icons------------------------------

    let iconCode = data.list[i].weather[0].icon;
    const imgElement = document.querySelector(`.imgElClass${i}`);
    imgElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${iconCode}.png`
    );
    const iconDesc = document.querySelector(`.iconDescClass${i}`);
    iconDesc.textContent = data.list[i].weather[0].description;
  }
}

// --------------------------- Recent Search-------------------------------

function Search() {
  let recentSearchDiv = document.querySelector(".recentSearchesDiv");
  let inputElement = document.querySelector("#inputEl");
  inputElement.addEventListener("click", function() {
    let cityNameArray = JSON.parse(localStorage.getItem("cityNameArray")) || [];
    if (cityNameArray.length === 0) {
      recentSearchDiv.style.display = "none";
    } else {
      recentSearchDiv.style.display = "block";
    }

    let recentSearchesDiv = document.querySelector(".recentSearches");
    recentSearchesDiv.innerHTML = "";

    cityNameArray.reverse();
    for (let city of cityNameArray) {
      let searchListDiv = document.createElement("div");
      searchListDiv.classList.add("searchList");

      let para1 = document.createElement("p");
      let para2 = document.createElement("p");
      para1.innerHTML = `<i class="fa-regular fa-clock"></i> ${city.name}`;
      para2.textContent = "X";

      para1.addEventListener("click", () => {
        inputElement.value = para1.textContent;
      });

      para2.addEventListener("click", function() {
        cityNameArray = cityNameArray.filter(c => c.name !== city.name);
        localStorage.setItem("cityNameArray", JSON.stringify(cityNameArray));
        searchListDiv.remove();
      });

      searchListDiv.appendChild(para1);
      searchListDiv.appendChild(para2);
      recentSearchesDiv.appendChild(searchListDiv);
    }
  });

  let searchBtn = document
    .querySelector(".searchBtn")
    .addEventListener("click", () => {
      recentSearchDiv.style.display = "none";
    });

  let cross = document.querySelector(".cross").addEventListener("click", () => {
    recentSearchDiv.style.display = "none";
  });

  document
    .querySelector(".halfRightDashboard")
    .addEventListener("click", () => {
      recentSearchDiv.style.display = "none";
    });
  document.querySelector(".weatherhead").addEventListener("click", () => {
    recentSearchDiv.style.display = "none";
  });
}

let recentSearchDiv = document.querySelector(".recentSearchesDiv");
recentSearchDiv.style.display = "none";

Search();

function fetchLocation() {
  let apiKey = "8253ad72e9e33eddee65652361af4b06";
  console.log("enter");
  navigator.geolocation.getCurrentPosition(
    async position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const res = await response.json();
        console.log(res.name);
        document.querySelector("input").value = res.name;
        data();
      } catch (err) {
        console.log(err);
      }
    },
    error => {
      console.error(`Error Code = ${error.code} - ${error.message}`);
    }
  );
}

//--------------------------alrt pop--up-------------------------------

function showAlert(message) {
  const customAlert = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");
  alertMessage.textContent = message;
  customAlert.style.display = "flex";
  // alertMessage.textContent = alert("please enter a valid city name");
}

function closeAlert() {
  const customAlert = document.getElementById("customAlert");
  customAlert.style.display = "none";
}
