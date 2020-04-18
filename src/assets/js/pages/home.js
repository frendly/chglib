import $ from "jquery";

const getLastNews = () => {
  $('.get-last-news__list').load('/news.html main>article:nth-child(-n+2)')
}

export default getLastNews;