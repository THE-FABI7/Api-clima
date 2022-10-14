import Helpers from "./helpers.js";

const apiKey = "268c15cf80793c2a3f0c58478328d1f8";
let worldCities;
let map;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    worldCities = await Helpers.fetchData(
      "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json"
    );

    const countries = [
      ...new Map(worldCities.map((item) => [item.country, item])).values(),
    ];

    const selectCountries = await Helpers.populateSelectList(
      "#countries",
      countries,
      "country",
      "country"
    );

    selectCountries.selectedIndex = 46;

    selectCountries.addEventListener("change", refreshCities);

    selectCountries.dispatchEvent(new Event("change"));

    showMap();
  } catch (error) {
    Toast.info({
      message: "no se puede acceder a los paises",
      mode: "danger",
      error,
    });
  }
});

/**
 * Actualizará la lista de ciudades según el país seleccionado
 * @param e - El objeto de evento.
 */
const refreshCities = (e) => {
  document.querySelector("#weather-info").innerText = "INFORMACION DEL CLIMA";

  const cities = worldCities.filter((item) => item.country == e.target.value);

  const selectedCities = Helpers.populateSelectList(
    "#cities",
    cities,
    "geonameid",
    "name",
    "Seleccione una localidad"
  );

  selectedCities.addEventListener("change", loadWeatherInfo);
};

/**
 * Obtiene los datos meteorológicos de la API de OpenWeatherMap y los representa en la página
 */
const loadWeatherInfo = async () => {
  const country = document.querySelector("#countries").value;
  const city = Helpers.selectedItemList("#cities").text;
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`;

  try {
    const weather = await Helpers.fetchData(url);
    renderWeather(weather);
    showMap(weather.coord.lat, weather.coord.lon)
    Toast.info({
      message: "si existe el estado del clima de " + city + " - " + country,
      mode: "success",
    });

  } catch (e) {
    Toast.info({
      message: "no hay informacion de dicha ciudad",
      mode: "warning",
      e,
    });
  }
};
/**
 * Toma un objeto de datos meteorológicos y devuelve una cadena de HTML que muestra los datos meteorológicos
 * @param weatherData: los datos devueltos por la API.

 */
const renderWeather = (weatherData) => {
  const { name, sys, main, weather, wind } = weatherData; // ← desestructuración
  const image = `http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

  const html = `
    <div class="bg-orange-200 h-full m-4 w-full rounded flex flex-col border-2 border-black">
        <h2 class="mt-6 font-medium font-roboto text-red-500 self-center">
            ${name}, ${sys.country}
        </h2>

        <div>
            <img  class="block mx-auto" src="${image}">
            <h3 class="font-bold text-center font-roboto text-white">
                ${weather[0].main}
            </h3>
        </div>

        <div class="grid grid-cols-2 grid-rows-2 gap-3 text-white">
            <p class="col-span-2 text-center temp-text text-white">
               Temp: ${kelvinToCelsius(main.temp)} °C
            </p>
            <p class="text-center temp-text text-white">
               Min: ${kelvinToCelsius(main.temp_min)} °C
            </p>
            <p class="text-center temp-text text-white">
               Max: ${kelvinToCelsius(main.temp_max)} °C
            </p>
        </div>

        <div class="grid grid-cols-2 grid-rows-2 gap-3 text-white rounded">
            <p class="col-span-2 text-center temp-text text-white border-8">
               Descripcion: ${weather[0].description} 
            </p>
            <p class="col-span-2 text-center temp-text text-three ">
               Viento: ${wind.deg} Velocidad: ${wind.speed} Rafaga:${wind.gust}
            </p>   
        </div>
    </div>
    `;
  document.querySelector("#weather-info").innerHTML = html;
};

const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(2);

/**
 * Toma un mensaje como argumento y luego muestra un mensaje de error al DOM
 * @param message - El mensaje de error a mostrar
 */
const renderError = (message) => {
  const html = `
        <h2 class="text-9xl text-red-600">!</h2>
        <p class="text-xl text-red-600">
           <span class="font-bold">Error: </span>${message}
       </p>
    `;
  document.querySelector("#weather-info").innerHTML = html;
};

/**
 * Crea un mapa, y si el usuario no ha hecho clic en el mapa, centra el mapa en un valor predeterminado
 * ubicación, de lo contrario, centra el mapa en la ubicación en la que el usuario hizo clic
 * @param x: la latitud de la ubicación en la que desea centrar el mapa.
 * @param y - latitud
 */
const showMap = async (x,y) => {
    //mostrar mapa de leaflet
    if (map) {
      map.off();
      map.remove();
    }
    if (!x && !y) {
      map = L.map("map").setView([41.66, -4.72], 15);
    } else {
      map = L.map("map").setView([x, y], 12);
    }
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
      maxZoom: 18,
}).addTo(map);
}