import holidays from './holidays';
import analytics from './analytics';
import { menuMobile } from './menu';
import { openLinksInPortal } from './openLinksInPortal';

import elcatToggleList from './pages/elcat';
import getLastNews from './pages/home';
import { resbncBbTable } from './pages/resbnc';

import { mutationObserver, targetBlank, setCurrentYear } from './utils'


document.addEventListener("DOMContentLoaded", function () {
  setCurrentYear();
  targetBlank();
  menuMobile();
  openLinksInPortal();

  holidays();
  analytics();
  elcatToggleList();
  getLastNews();
  resbncBbTable();

  // observer
  mutationObserver(elcatToggleList);
  mutationObserver(targetBlank);
});
