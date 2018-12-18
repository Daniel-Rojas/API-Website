$(document).ready(function() {
  $("select").formSelect();
});

// the submitForm function is called when the user selects the submit button
// it creates a InputData object and fills it with the data from the form
// then sends data to be validated
function submitForm() {
  let inputData = new FormData();
  inputData.getFormData();
  let isValid = inputData.validateFormData();
  return isValid;
}