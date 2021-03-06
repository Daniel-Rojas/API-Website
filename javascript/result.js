$(document).ready(function() {
  $("select").formSelect();
  $(".parallax").parallax();

  //  let userData = new UserData();
  //  userData.getData();
  let userData = new FormData();
  userData.getDataFromUrl();

  let currentCity = userData.currentCity.cityName;
  let destinationCity = userData.destinationCity.cityName;

  document.getElementById("current-city").innerHTML += currentCity;
  loadCurrentMap(currentCity);
  loadCurrentForecast(currentCity);

  document.getElementById("destination-city").innerHTML += destinationCity;
  loadDestinationMap(destinationCity);
  loadDestinationForecast(destinationCity);
});

function loadCurrentMap(currentCity) {
  let currentMap = new GoogleMap("current-city-map", {
    lat: -34.397,
    lng: 150.644
  });
  let currentPin = new GooglePin(currentCity);
  currentPin.getGeocodingInfo();
  currentMap.addPin(currentPin);
  currentMap.map.setCenter(currentPin.position);
}

function loadCurrentForecast(currentCity) {
  let currentCityWeather = new WeeklyForecast(currentCity);
  currentCityWeather.getWeatherForecast();

  for (let i = 0; i < currentCityWeather.forecast.length; i++) {
    document.getElementById("cur-condition-day" + i.toString()).innerHTML =
      currentCityWeather.forecast[i].condition;
    document.getElementById("cur-high-day" + i.toString()).innerHTML +=
      currentCityWeather.forecast[i].maxTemperature;
    document.getElementById("cur-low-day" + i.toString()).innerHTML +=
      currentCityWeather.forecast[i].minTemperature;
    document.getElementById("cur-precip-day" + i.toString()).innerHTML +=
      currentCityWeather.forecast[i].precipitation;
    document.getElementById("cur-wind-day" + i.toString()).innerHTML +=
      currentCityWeather.forecast[i].windSpeed +
      currentCityWeather.forecast[i].windDirection;
  }
}

function loadDestinationMap(destinationCity) {
  let destinationMap = new GoogleMap("destination-city-map", {
    lat: -34.397,
    lng: 150.644
  });
  let destinationPin = new GooglePin(destinationCity);
  destinationPin.getGeocodingInfo();
  destinationMap.addPin(destinationPin);
  destinationMap.map.setCenter(destinationPin.position);
}

function loadDestinationForecast(destinationCity) {}

class WeeklyForecast {
  constructor(location) {
    this.forecast = [];
    this.location = location;
    this.locationKey = this.getLocationKey();
  }

  getLocationKey() {
    let apiUrl = "https://dataservice.accuweather.com/locations/v1/search";
    let apiKey = "tCZnjOflxGgwGubWXbpj3yhbOS2kZXdZ";
    let parameters = { apiKey: apiKey, q: this.location };

    var tempLocationKey;

    $.get({
      url: apiUrl,
      xhrFields: { withCredentials: true },
      data: parameters,
      async: false,
      success: function(response) {
        tempLocationKey = response[0].Key;
      }
    });
    return tempLocationKey;
  }

  getWeatherForecast() {
    let apiUrl =
      "https://dataservice.accuweather.com/forecasts/v1/daily/5day/" +
      this.locationKey;
    let apiKey = "tCZnjOflxGgwGubWXbpj3yhbOS2kZXdZ";
    let details = "true";
    let parameters = { apiKey: apiKey, details: details };

    var tempForecast = [];

    $.get({
      url: apiUrl,
      xhrFields: { withCredentials: true },
      data: parameters,
      async: false,
      success: function(response) {
        for (let i = 0; i < 5; i++) {
          let data = response.DailyForecasts[i];
          let day = new DayForecast();
          day.getForecastInfo(data);
          tempforecast[i] = day;
        }
      }
    });
    this.forecast = tempForecast;
  }
}

class DayForecast {
  constructor() {
    this.date;
    this.condition;
    this.icon;
    this.minTemperature;
    this.maxTemperature;
    this.precipitation;
    this.windSpeed;
    this.windDirection;
  }

  getForecastInfo(data) {
    this.date = data.Date;
    this.minTemperature = data.Temperature.Minimum.Value;
    this.maxTemperature = data.Temperature.Maximum.Value;
    this.condition = data.Day.IconPhrase;
    this.precipitation = data.Day.PrecipitationProbability;
    this.windSpeed = data.Day.Wind.Speed;
    this.windDirection = data.Day.Wind.Direction.Localized;
    let iconNumber = data.Day.Icon;
    this.icon = "../images/icons/weather/" + String(iconNumber) + ".png";
  }
}
