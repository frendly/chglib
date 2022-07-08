export const menuMobile = () => {
  const menuButton = document.querySelector('.menu-mobile');
  const menuClasses = document.querySelector('.menu-list').classList;

  menuButton.addEventListener('click', () => {
      menuClasses.toggle("menu-list--open");
  });
}

// Add css class to active menu
export const activeMenuItem = () => {
  const path = window.location.pathname.split('/')[1];
  const activeMenuItem = document.querySelector(`.menu-list__link[href*='${path}']`);

  if (activeMenuItem) {
    activeMenuItem.addClass('menu-list__link--active');
  }
}
