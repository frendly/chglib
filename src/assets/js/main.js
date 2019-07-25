// Add target="_blank" to external links
function targetBlank() {
  var a = document.getElementsByTagName('a'); // grab every link on the page
  var internal = location.host.replace("www.", ""); // remove subdomain of current site's url and setup regex
  
  internal = new RegExp(internal, "i");

  for (var i = 0; i < a.length; i++) {
    var href = a[i].host; // set the host of each link

    if( !internal.test(href) ) { // make sure the href doesn't contain current site's host
      a[i].setAttribute('target', '_blank'); // if it doesn't, set attributes
    }
  }
};

document.addEventListener("DOMContentLoaded", function() {
  // set current year
  document.querySelector(".current-year").innerHTML = new Date().getFullYear();
  
  targetBlank();
});
