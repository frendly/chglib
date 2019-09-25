import $ from 'jquery';

const menu = () => {
  $('.menu-mobile').on('click', () => $('.menu-list').toggleClass('menu-list--open'));
}

export default menu;