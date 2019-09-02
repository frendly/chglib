import $ from "jquery";
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

// import { range, isRange } from 'moment-range';

import { getCurrentYear } from "./utils";

const getFullDate = (date) => moment(date, 'DD-MM').format();

function showHolidaysInfo() {
  var url = '/assets/data/holidays.json';

  $.getJSON(url).done(function(data) {
    var event = data[0];
    const { start_date: startDate, end_date: endDate } = event;
    
    const start = getFullDate(startDate);
    const end = getFullDate(endDate);
    const dateRange = moment.range(start, end);
    // moment.isRange(range)
    
    // console.log(start, end);
    console.log(dateRange, moment.isRange(range));

    var text = replaceText(event.text);
    $('<section>').html(text).prependTo('.last-news');
  });
}

function replaceText(data) {
  return data.replace('#current_year#', getCurrentYear());
}

export default showHolidaysInfo;