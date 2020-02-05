$(document).ready(function(){
  "use strict";
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds 
      //it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});

jQuery(function($) {
  $(".about").click(function() {
    $(".aboutdiv").toggleClass("hidden show");
  });
});
jQuery(function($) {
  $(".feature").click(function() {
    $(".featurediv").toggleClass("hidden show");
  });
});
jQuery(function($) {
  $(".recipe").click(function() {
    $(".recipediv").toggleClass("hidden show");
  });
});
jQuery(function($) {
  $(".contact").click(function() {
    $(".contactdiv").toggleClass("hidden show");
  });
});

// Go back to top of page
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
        document.getElementById("top").style.display = "block";
    } else {
        document.getElementById("top").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
