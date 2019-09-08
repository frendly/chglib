import $ from "jquery";
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

import { getCurrentYear } from "./utils";

const getFullDate = (date) => moment(date, 'DD-MM');

function showHolidaysInfo() {
  const url = '/assets/data/holidays.json';
  const today = moment().endOf('day');

  $.getJSON(url).done(function(data) {
    var event = data[0];
    const { start_date: startDate, end_date: endDate } = event;
    
    const start = getFullDate(startDate);
    const end = getFullDate(endDate);
    const range = moment.range(start, end);
    const isShowing = range.contains(today);
    
    // console.log(start, end, today);
    // console.log(dateRange);
    console.log(isShowing);

    var text = replaceText(event.text);
    $('<section>').html(text).prependTo('.last-news');
  });
}

function replaceText(data) {
  return data.replace('#current_year#', getCurrentYear());
}

export default showHolidaysInfo;