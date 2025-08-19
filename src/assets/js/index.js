import { getHolidays } from './components/holidays/holidays';
import { menuMobile } from './components/menu';
import { openLinksInPortal } from './components/openLinksInPortal';
import analytics from './utils/analytics';

import elcatToggleList from './pages/elcat';
import { resbncBbTable } from './pages/resbnc';

import { mutationObserver } from './utils/mutationObserver';
import { targetBlank } from './utils/targetBlank';
import { setCurrentYear } from './utils/currentYear';


document.addEventListener("DOMContentLoaded", function () {
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
