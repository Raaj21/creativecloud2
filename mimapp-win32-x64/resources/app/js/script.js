// Mixing jQuery and Node.js code in the same file? Yes please!

$(function(){

    // Display some statistics about this computer, using node's os module.
    var os = require('os');
    var prettyBytes = require('pretty-bytes');
    
    $('.stats').append('Number of cpu cores: <span>' + os.cpus().length + '</span>');
    $('.stats').append('Free memory: <span>' + prettyBytes(os.freemem())+ '</span>');

    // Electron's UI library. We will need it for later.
    var shell = require('shell'); 

    // Open URL with default browser.
    shell.openExternal("https://electronjs.org/docs");

        alert("lol");
        $("form[name='registration']").validate({
          rules: {
            password: {
              required: true,
              minlength: 5
            }
          },
          messages: {
            password: {
              required: "Please provide a password",
              minlength: "Your password must be at least 5 characters long"
            }
          },
          submitHandler: function(form) {
            form.submit();
          }
        });
      
});