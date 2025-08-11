import { menuMobile, openLinksInPortal, getHolidays } from './features';
import analytics from './analytics';

import elcatToggleList from './pages/elcat';
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
  resbncBbTable();

  // observer
  mutationObserver(elcatToggleList);
  mutationObserver(targetBlank);
});
