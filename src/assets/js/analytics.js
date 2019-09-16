import $ from "jquery";

const analytics = () => {
  $('.benran-logo').on('click', () => {
    ym(55357015, 'reachGoal', 'benran-logo-click');
  });
}

export default analytics;