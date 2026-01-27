import analytics from './analytics';
import { getHolidays, menuMobile, openLinksInPortal } from './features';
import initJournalOrder from './pages/benex';
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
  initJournalOrder();

  // observer
  mutationObserver(elcatToggleList);
  mutationObserver(targetBlank);
});
