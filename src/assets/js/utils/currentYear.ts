import dayjs from 'dayjs';

export const getCurrentYear = (): number => dayjs().year();

// current year
export const setCurrentYear = (): void => {
  const selector = document.querySelector('.current-year');
  if (!selector) return;

  const currentYear = getCurrentYear();
  selector.textContent = `– ${currentYear}`;
};
