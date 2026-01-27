export const menuMobile = (): void => {
  const menuButton = document.querySelector<HTMLButtonElement>('.menu-mobile');
  const menuList = document.querySelector<HTMLElement>('.menu-list');

  if (!menuButton || !menuList) return;

  menuButton.addEventListener('click', () => {
    menuList.classList.toggle('menu-list--open');
  });
};
