$(document).ready(function() {
  $('form').submit(function(e) {
    e.preventDefault();

    // Get the form as an JSON object
    var form_data = $(this).toObject();
    console.log(form_data);

    // Call REST-API
    $.ajax({
      url: '/api/register',
      type: 'POST',
      data: form_data
    })
    .done(function() {
      //alert("Created new user");
    })
    .fail(function(response) {
      console.log(response);
      alert("Couldn't create user: " + response.responseText);
    });

   })
});
