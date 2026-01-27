const analytics = (): void => {
  const selector = document.querySelector<HTMLElement>('.benran-logo');
  if (!selector) return;

  selector.addEventListener('click', () => {
    const { ym } = window;
    if (typeof ym === 'function') {
      ym(55357015, 'reachGoal', 'benran-logo-click');
    }
  });
};

export default analytics;
