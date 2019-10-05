import $ from "jquery";

const elcatToggleList = () => {
  $('.journal-list').on('click', function() {
    $(this).toggleClass('journal-list--open');
    $(this).nextAll('.journal-list__items').first().toggle();
  })
}


export default elcatToggleList;