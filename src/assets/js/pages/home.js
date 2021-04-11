import $ from "jquery";

const getLastNews = () => {
  $('.get-last-news__list').load('/news/ article:nth-of-type(-n+2)')
}

export default getLastNews;
