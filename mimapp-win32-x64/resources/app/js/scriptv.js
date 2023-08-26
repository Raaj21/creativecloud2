// Mixing jQuery and Node.js code in the same file? Yes please!

$(function(){

        //do stuff with the script
       $("form[name='registration']").validate({
          rules: {
            center_code: {
              required: true
            },
            petrol_username: {
              required: true
            },
            petrol_password: {
              required: true
            },
            diesel_username: {
              required: true
            },
            diesel_password: {
              required: true
            },
            password: {
              required: true,
              minlength: 5
            }
          },
          messages: {
            center_code: {
              required: "Please provide a valid center code"
            },
            petrol_username: {
              required: "Please provide a valid petrol username"
            },
            petrol_password: {
              required: "Please provide a valid petrol password"
            },
            diesel_username: {
              required: "Please provide a valid diesel username"
            },
            diesel_password: {
              required: "Please provide a valid diesel password"
            },
            password: {
              required: "Please provide a activation key",
              minlength: "Your activation key must be at least 10 characters long"
            }
          },
          submitHandler: function(form,e) {
                  e.preventDefault();
                  console.log('Form submitted');
                  $.ajax({
                      type: 'POST',
                      url: 'http://localhost:5555/validatekey',
                      dataType: "json",
                      data: $('form').serialize(),
                      success: function(result) {
                          console.log(result)
                          if(result.status == "success"){
                            window.location.href = "success.html"
                          }else{
                            alert("Invalid activation code");
                          }                          
                      },
                      error : function(error) {
                        console.log(error)
                        alert("Invalid activation code");
                      }
                  });
                  return false;
              }
        });

});