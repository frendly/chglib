const analytics = () => {
  const selector = document.querySelector('.benran-logo');

  selector.addEventListener('click', () => {
    window.ym(55357015, 'reachGoal', 'benran-logo-click');
  });
}

export default analytics;
