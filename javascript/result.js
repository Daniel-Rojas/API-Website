$(document).ready(function() {
  let userData = new UserData();
  userData.getData();
  let currentPin = GooglePin(userData.currentCity);

  let map = new GoogleMap();
  map.loadMap();
});

class UserData {
  constructor() {
    this.currentCity;
    this.destinationCity;
    this.departureDate;
    this.returnDate;
  }

  getData() {
    this.currentCity = getUrlParameter("current-city");
    this.destinationCity = getUrlParameter("destination-city");
    this.departureDate = getUrlParameter("departure-date");
    this.returnDate = getUrlParameter("return-date");
  }

  getUrlParameter(parameterToFind) {
    let pageUrl = window.location.search;
    let parameterAndValues = pageUrl.split("&");
    for (let i = 0; i < urlParamters.length; ++i) {
      let parameter = parameterAndValues[i].split("=");
      if (parameter[0] == parameterToFind) {
        return parameter[1];
      }
    }
    return "N/A";
  }
}

class GoogleMap {
  constructor() {
    this.map;
    this.currentAirport;
    this.destinationAirport;
    // utilities
    this.geocoder;
  }

  loadMap() {
    let options = { zoom: 2 };
    this.map = new GoogleMap.maps.Map(document.getElementById("map"), options);
  }

  addPin(pin) {
    let parameters = {
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: pin.position
    };
    let marker = new GoogleMap.maps.Marker(parameters);
  }
}

class GooglePin {
  constructor(name) {
    this.name = name;
    this.actualName;
    this.address;
    this.latitude;
    this.longitude;
    this.positon;
  }

  getGeocodingInfo() {
    let url = "https://maps.googleapis.com/maps/api/geocode/json";
    let apiKey = "AIzaSyB8u-TY08yY4gI6sIz1nAJ3RihJNJN91fg";
    $.get(url, { address: location, key: apiKey }, function(response) {
      let coordinates = response.data.results[0].geometry.location;
      let addressComponents = response.data.results[0].address_components;

      this.actualName = addressComponents[0].short_name;

      let addrNum = addressComponents[1].short_name;
      let addrStreet = addressComponents[2].short_name;
      let addrCity = addressComponents[3].short_name;
      let addrState = addressComponents[4].short_name;
      let addrZip = addressComponents[5].short_name;
      this.address =
        addrNum +
        " " +
        addrStreet +
        ", " +
        addrCity +
        ", " +
        addrState +
        " " +
        addrZip;

      this.latitude = coordinates.lat;
      this.longitude = coordinates.lng;
      this.positon = { lat: this.latitude, lng: this.longitude };
    });
  }
}
