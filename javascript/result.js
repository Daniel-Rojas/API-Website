$(document).ready(function() {
  $("select").formSelect();
  $(".parallax").parallax();

  let userData = new FormData();
  userData.getDataFromUrl();

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
  console.log("HERE");
  let destinationPin = new GooglePin(destinationCity);
  destinationPin.getGeocodingInfo();
  destinationMap.addPin(destinationPin);
  destinationMap.map.setCenter(destinationPin.position);
}