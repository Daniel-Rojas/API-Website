$(document).ready(function () {
	$('select').formSelect();
});

// the submitForm function is called when the user selects the submit button
// it creates a InputData object and fills it with the data from the form
// then sends data to be validated
function submitForm() {
	let inputData = new InputData();
	inputData.getFormData();
	var isValid = validateFormData(inputData);
	return isValid;
}

// The function checks if the information that the user entered is valid
function validateFormData(data) {
	// initalizes city validation message
	let isValid = false;
	let validationMessage = "";
	// checks if cities are not the same
	if (data.currentCity.cityName == data.destinationCity.cityName) {
		validationMessage = "Current city and Destination city must be different.";
	}
	else { // checks for departure date earlier than return date
		if (data.departureDate.year > data.returnDate.year) {
			validationMessage = "Return year must be later that departure year.";
		}
		else if (data.departureDate.month > data.returnDate.month) {
			validationMessage = "Return month must be later that departure month.";
		}
		else if (data.departureDate.day > data.returnDate.day) {
			validationMessage = "Return day must be later that departure day.";
		}
		else {
			isValid = true;
		}
	}

	document.getElementById("validation-message").innerHTML = validationMessage;
	return isValid;
}

/********** Classes **********/

class FormDate {
	constructor() {
		this.day;
		this.month;
		this.year;
	}

	getFormDate(dateType) {
		// initialize strings to be added with the date type
		let dayString = "-day";
		let monthString = "-month";
		let yearString = "-year";

		// determines the value of the date type
		// then add the date type to the intial strings
		if (dateType == "departure") {
			dayString = dateType + dayString;
			monthString = dateType + monthString;
			yearString = dateType + yearString;
		}
		else if (dateType == "return") {
			dayString = dateType + dayString;
			monthString = dateType + monthString;
			yearString = dateType + yearString;
		}
		else { // throws error if date type is an invalid type
			throw "Error: retrieveDateData received invalid parameter";
		}

		// creates Date object and assigns values
		this.day = document.forms["input-form"][dayString].value;
		this.month = document.forms["input-form"][monthString].value;
		this.year = document.forms["input-form"][yearString].value;
	}
}

class City {
	constructor() {
		this.cityName;
	}

	getFormCity(cityType) {
		// intialize string to be added to city
		let cityString = "-city";

		// determines the value of the city type
		// then add the city type to the intial string
		if (cityType == "current") {
			cityString = cityType + cityString;
		}
		else if (cityType == "destination") {
			cityString = cityType + cityString;
		}
		else { // throws error if city type is an invalid type
			throw "Error: retrieveCityData received invalid parameter";
		}

		// assigns value to name
		this.cityName = document.forms["input-form"][cityString].value;
	}
}

class InputData {
	constructor() {
		this.currentCity;
		this.destinationCity;
		this.departureDate;
		this.returnDate;
	}

	getFormData(date) {
		try {
			this.currentCity = new City();
			this.currentCity.getFormCity("current");
			this.destinationCity = new City();
			this.destinationCity.getFormCity("destination");
			this.departureDate = new FormDate();
			this.departureDate.getFormDate("departure");
			this.returnDate = new FormDate();
			this.returnDate.getFormDate("return");
		}
		catch (err) {
			console.log(err);
		}
	}
}
