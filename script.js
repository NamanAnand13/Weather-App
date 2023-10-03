const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfo = document.querySelector(".user-info-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");

let searchInput = document.querySelector("[data-searchInput]");

setBgImg();
function setBgImg() {
    document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?nature')";
}
let currTab = userTab;
const API_key = "4d74f1fc3a859a0ea013efc003302c4b";
getFromSessionStorage();

currTab.classList.add("current-tab");

function switchTab(clickedTab) {
    if (clickedTab != currTab) {
        currTab.classList.remove("current-tab");
        currTab = clickedTab;
        currTab.classList.add("current-tab");

        if (!searchForm.classList.contains("active")) {
            searchForm.classList.add("active");
            userInfo.classList.remove("active");
            // grantAccessContainer.classList.remove("active");
        }
        else {
            searchForm.classList.remove("active");
            userInfo.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

//check if coordinates are already present in session storage
function getFromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (localCoordinates) {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
    else {
        grantAccessContainer.classList.add("active");
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err) {
        loadingScreen.classList.remove("active");
        //HW
    }
}

function renderWeatherInfo(weatherInfo) {
    //fetching the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temperature = document.querySelector("[data-temperature]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloud = document.querySelector("[data-cloud]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloud.innerText = `${weatherInfo?.clouds?.all} %`;
    try {
        document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${weatherInfo?.name}')`;
    }
    catch (err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
}

function getLocation() {
    loadingScreen.classList.add("active");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error, options);
    }
    loadingScreen.classList.remove("active");

}

const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
};

function success(pos) {
    const crd = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(crd));
    fetchUserWeatherInfo(crd);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
grantAccessButton.addEventListener("click", getLocation);

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let city = searchInput.value;
    if (searchInput.value == "") {
        return;
    }
    else {
        fetchSearchWeatherInfo(city);
    }
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfo.classList.remove("active");
    grantAccessButton.classList.remove("active");

    try {
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (error) {
        console.log(error);
    }
}