
// Add css class to active menu
function activeMenuItem() {
  var path = window.location.pathname;
  var activeMenuItem = document.querySelector('.menu__link[href*="' + path + '"]');

  if (activeMenuItem) {
    activeMenuItem.classList.add('menu__link--active');
  }
}

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

function openModal() {
  $('.news-page a[href*="more/i"]').each(function() {
    $(this).on('click', function(e) {
      e.preventDefault();
  
      const url = this.href;
      
      $.get(url, function(response) {
        const data = $(response).not('footer');
        $('.modal__content').html(data);
        
        MicroModal.show('modal-1');
        });
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {
  // set current year
  document.querySelector(".current-year").innerHTML = new Date().getFullYear();
  
  targetBlank();
  activeMenuItem();
  MicroModal.init();
  openModal();
});
