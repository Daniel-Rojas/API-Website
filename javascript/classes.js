class FormDate {
  constructor() {
    this.day;
    this.month;
    this.year;
  }

  getFormDate(dateType) {
    this.getFormDay(dateType);
    this.getFormMonth(dateType);
    this.getFormYear(dateType);
  }

  getFormDay(dateType) {
    let dayString = "-day";
    if (dateType == "departure" || dateType == "return") {
      dayString = dateType + dayString;
      this.day = document.forms["input-form"][dayString].value;
    } else {
      throw "Error: GetFormDay received invalid parameter";
    }
  }

  getFormMonth(dateType) {
    let monthString = "-month";
    if (dateType == "departure" || dateType == "return") {
      monthString = dateType + monthString;
      this.month = document.forms["input-form"][monthString].value;
    } else {
      throw "Error: GetFormMonth received invalid parameter";
    }
  }

  getFormYear(dateType) {
    let yearString = "-year";
    if (dateType == "departure" || dateType == "return") {
      yearString = dateType + yearString;
      this.year = document.forms["input-form"][yearString].value;
    } else {
      throw "Error: GetFormYear received invalid parameter";
    }
  }
}

class FormCity {
  constructor() {
    this.cityName;
  }

  getFormCity(cityType) {
    // intialize string to be added to city
    let cityString = "-city";
    if (cityType == "current" || cityType == "destination") {
      cityString = cityType + cityString;
      this.cityName = document.forms["input-form"][cityString].value;
    } else {
      // throws error if city type is an invalid type
      throw "Error: retrieveCityData received invalid parameter";
    }
  }
}

class FormData {
  constructor() {
    this.currentCity;
    this.destinationCity;
    this.departureDate;
    this.returnDate;
  }

  getFormData() {
    try {
      this.currentCity = new FormCity();
      this.currentCity.getFormCity("current");
      this.destinationCity = new FormCity();
      this.destinationCity.getFormCity("destination");
      this.departureDate = new FormDate();
      this.departureDate.getFormDate("departure");
      this.returnDate = new FormDate();
      this.returnDate.getFormDate("return");
    } catch (err) {
      console.log(err);
    }
  }

  validateFormData() {
    // initalizes city validation message
    let isValid = false;
    let validationMessage = "";
    // checks if cities are not the same
    if (this.currentCity.cityName == this.destinationCity.cityName) {
      validationMessage =
        "Current city and Destination city must be different.";
    } else {
      // checks for departure date earlier than return date
      if (this.departureDate.year > this.returnDate.year) {
        validationMessage = "Return year must be later that departure year.";
      } else if (this.departureDate.month > this.returnDate.month) {
        validationMessage = "Return month must be later that departure month.";
      } else if (this.departureDate.day > this.returnDate.day) {
        validationMessage = "Return day must be later that departure day.";
      } else {
        isValid = true;
      }
    }
    document.getElementById("validation-message").innerHTML = validationMessage;
    return isValid;
  }

  getDataFromUrl() {
    this.currentCity = new FormCity();
    this.destinationCity = new FormCity();
    this.currentCity.cityName = this.getUrlParameter("current-city");
    this.destinationCity.cityName = this.getUrlParameter("destination-city");

    this.departureDate = new FormDate();
    this.departureDate.day = this.getUrlParameter("departure-day");
    this.departureDate.month = this.getUrlParameter("departure-month");
    this.departureDate.year = this.getUrlParameter("departure-year");

    this.returnDate = new FormDate();
    this.returnDate.day = this.getUrlParameter("return-day");
    this.returnDate.month = this.getUrlParameter("return-month");
    this.returnDate.year = this.getUrlParameter("return-year");
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
