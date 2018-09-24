  $(document).ready(function() {
    $('select').formSelect();
  });

  function validateForm() {
  	var currentCity = document.forms["input-form"]["current-city"].value;
  	var destinationCity = document.forms["input-form"]["destination-city"].value;
  	if (currentCity == destinationCity) {
	  alert("Current city and Destination city must be different.");
  	  return false;
  	}
  	else {
  	  var departureDay = parseInt(document.forms["input-form"]["departure-day"].value);
	  var departureMonth = parseInt(document.forms["input-form"]["departure-month"].value);
	  var departureYear = parseInt(document.forms["input-form"]["departure-year"].value);
	  var returnDay = parseInt(document.forms["input-form"]["return-day"].value);
	  var returnMonth = parseInt(document.forms["input-form"]["return-month"].value);
	  var returnYear = parseInt(document.forms["input-form"]["return-year"].value);
	  if (departureYear > returnYear) {
	  	alert("Return year must be later that departure year.");
	  	  return false;
	  }
	  else if (departureMonth > returnMonth) {
	  	alert("Return month must be later that departure month.");
	  	  return false;
	  }
	  else if (departureDay > returnDay) {
		alert("Return day must be later that departure day.");
		  return false;
	  }
	  else {
	  	return true;
	  }
	}
  }