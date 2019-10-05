import $ from 'jquery';

const menuMobile = () => {
  $('.menu-mobile').on('click', () => $('.menu-list').toggleClass('menu-list--open'));
}

// Add css class to active menu
function activeMenuItem() {
  const path = window.location.pathname.split('/')[1];
  const activeMenuItem = $(`.menu-list__link[href*='${path}']`);

  if (activeMenuItem) {
    activeMenuItem.addClass('menu-list__link--active');
  }
}

export { menuMobile, activeMenuItem };