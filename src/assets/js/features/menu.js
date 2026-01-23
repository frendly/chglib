export const menuMobile = () => {
  const menuButton = document.querySelector('.menu-mobile');
  const menuClasses = document.querySelector('.menu-list').classList;

  menuButton.addEventListener('click', () => {
    menuClasses.toggle('menu-list--open');
  });
};
