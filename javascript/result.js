$(document).ready(function() {
  $("select").formSelect();
  $(".parallax").parallax();

  let userData = new UserData();
  userData.getData();

  document.getElementById("current-city").innerHTML += userData.currentCity;
  loadCurrentMap(userData.currentCity);

  document.getElementById("destination-city").innerHTML +=
    userData.destinationCity;
  loadDestinationMap(userData.destinationCity);
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

function loadDestinationMap(destinationCity) {
  let destinationMap = new GoogleMap("destination-city-map", {
    lat: -34.397,
    lng: 150.644
  });
  let destinationPin = new GooglePin(userData.destinationCity);
  destinationPin.getGeocodingInfo();
  destinationMap.addPin(destinationPin);
  destinationMap.map.setCenter(destinationPin.position);
}

class UserData {
  constructor() {
    this.currentCity;
    this.destinationCity;
    this.departureDate;
    this.returnDate;
  }

  getData() {
    this.currentCity = this.getUrlParameter("current-city");
    this.destinationCity = this.getUrlParameter("destination-city");

    let departureDay = this.getUrlParameter("departure-day");
    let departureMonth = this.getUrlParameter("departure-month");
    let departureYear = this.getUrlParameter("departure-year");
    this.departureDate = new FlightDate(
      departureDay,
      departureMonth,
      departureYear
    );

    let returnDay = this.getUrlParameter("return-day");
    let returnMonth = this.getUrlParameter("return-month");
    let returnYear = this.getUrlParameter("return-year");
    this.returnDate = new FlightDate(returnDay, returnMonth, returnYear);
  }

  getUrlParameter(parameterToFind) {
    let pageUrl = location.search.substring(1);
    let parameterAndValues = pageUrl.split("&");
    for (let i = 0; i < parameterAndValues.length; ++i) {
      let parameter = parameterAndValues[i].split("=");
      if (parameter[0] == parameterToFind) {
        return parameter[1];
      }
    }
    return "N/A";
  }
}

class FlightDate {
  constructor(day, month, year) {
    this.day = day;
    this.month = month;
    this.year = year;
  }
}

class GoogleMap {
  constructor(id, centerLocation) {
    this.mapID = id;
    this.centerLocation = centerLocation;
    this.map;

    let options = {
      zoom: 10,
      center: this.centerLocation
    };
    this.map = new google.maps.Map(
      document.getElementById(this.mapID),
      options
    );
  }

  addPin(pin) {
    let parameters = {
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: pin.position
    };
    let marker = new google.maps.Marker(parameters);
  }
}

class GooglePin {
  constructor(name) {
    this.name = name;
    this.actualName;
    this.address;
    this.latitude;
    this.longitude;
    this.position;
  }

  getGeocodingInfo() {
    let apiUrl = "https://maps.googleapis.com/maps/api/geocode/json";
    let apiKey = "AIzaSyB8u-TY08yY4gI6sIz1nAJ3RihJNJN91fg";
    let tempName = this.name + "+airport";
    let parameters = { address: tempName, key: apiKey };

    var tempActualName;
    var tempAddress;
    var tempLatitude;
    var tempLongitude;
    var tempPosition;

    $.get({
      url: apiUrl,
      data: parameters,
      async: false,
      success: function(response) {
        let coordinates = response.results[0].geometry.location;
        let addressComponents = response.results[0].address_components;
        tempActualName = addressComponents[0].short_name;
        let addrNum = addressComponents[1].short_name;
        let addrStreet = addressComponents[2].short_name;
        let addrCity = addressComponents[3].short_name;
        let addrState = addressComponents[4].short_name;
        let addrZip = addressComponents[5].short_name;
        tempAddress =
          addrNum +
          " " +
          addrStreet +
          ", " +
          addrCity +
          ", " +
          addrState +
          " " +
          addrZip;

        tempLatitude = coordinates.lat;
        tempLongitude = coordinates.lng;
        tempPosition = { lat: tempLatitude, lng: tempLongitude };
      }
    });
    this.actualName = tempActualName;
    this.address = tempAddress;
    this.latitude = tempLatitude;
    this.longitude = tempLongitude;
    this.position = tempPosition;

    //console.log(this.position);
  }
}
