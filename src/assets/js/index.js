import $ from "jquery";

import { getCurrentYear } from "./utils";
import holidays from './holidays';
import analytics from './analytics';
import modal from './modal';
import { menuMobile, activeMenuItem } from './menu';
import elcatToggleList from './pages/elcat';
import getLastNews from './pages/home';

// current year
function currentYear() {
  $('.current-year').text(getCurrentYear());
}

// Add target="_blank" to external links
function targetBlank() {
  var a = document.getElementsByTagName('a'); // grab every link on the page
  var internal = location.host.replace("www.", ""); // remove subdomain of current site's url and setup regex

  internal = new RegExp(internal, "i");

  for (var i = 0; i < a.length; i++) {
    var href = a[i].host; // set the host of each link

    if (!internal.test(href)) { // make sure the href doesn't contain current site's host
      a[i].setAttribute('target', '_blank'); // if it doesn't, set attributes
    }
  }
};


document.addEventListener("DOMContentLoaded", function () {
  currentYear();
  targetBlank();
  activeMenuItem();
  menuMobile();

  holidays();
  analytics();
  elcatToggleList();
  getLastNews();
  modal();
});
