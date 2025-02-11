import { menuMobile, openLinksInPortal, getHolidays } from './features';
import analytics from './analytics';

import elcatToggleList from './pages/elcat';
import getLastNews from './pages/home';
import { resbncBbTable } from './pages/resbnc';

import { mutationObserver, targetBlank, setCurrentYear } from './utils';

document.addEventListener('DOMContentLoaded', function () {
  setCurrentYear();
  targetBlank();
  menuMobile();
  openLinksInPortal();

  getHolidays();
  analytics();
  elcatToggleList();
  getLastNews();
  resbncBbTable();

  // observer
  mutationObserver(elcatToggleList);
  mutationObserver(targetBlank);
});
