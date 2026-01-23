import analytics from './analytics';
import { getHolidays, menuMobile, openLinksInPortal } from './features';

import elcatToggleList from './pages/elcat';
import { resbncBbTable } from './pages/resbnc';

import { mutationObserver, setCurrentYear, targetBlank } from './utils';

document.addEventListener('DOMContentLoaded', () => {
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
