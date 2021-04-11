import $ from "jquery";
import jBox from 'jbox';

export default function modal() {
  // ищем ссылки, которые можно открыть в попапе и добавляем им класс
  $('main').find('a[href*="/bnp"], a[href*="/BENex"], a[href*="/subj"], a[href*="/more/"]').addClass("modal");

  new jBox('Modal', {
    adjustDistance: {
      top: 60,
      left: 15,
      right: 15,
      bottom: 20,
    },
    delayOpen: 100,
    fade: 1,
    animation: false,
    closeButton: 'box',
    preventDefault: true,
    maxWidth: 600,
    attach: ".modal",
    ajax: {
      getURL: 'href',
      getData: 'body',
      reload: true,
      setContent: true,
      success: function (response) {
        // console.log('jBox AJAX response', response);
        // const content = targetBlank(response);
        this.setContent(response);
      },
      error: function () {
        this.setContent('Error loading content');
      }
    }
  });
}
