const baseCls = 'menu-list';

const menuMobile = () => {
  const expandedCls = `${baseCls}--open`;

  const selector = document.querySelector('.menu-mobile');

  selector.addEventListener('click', () => {
    const menu = document.querySelector(`.${baseCls}`);
    menu.classList.toggle(expandedCls);
  });
}

// Add css class to active menu
function activeMenuItem() {
  const menuItemCls = `${baseCls}__link`;
  const activeMenuItemCls = `${menuItemCls}--active`;

  const path = window.location.pathname.split('/')[1];
  const activeMenuItem = document.querySelector(`.${menuItemCls}[href*='${path}']`);

  if (activeMenuItem) {
    activeMenuItem.classList.add(activeMenuItemCls);
  }
}

export { menuMobile, activeMenuItem };
