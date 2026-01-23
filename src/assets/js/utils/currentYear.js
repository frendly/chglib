import dayjs from 'dayjs';

export const getCurrentYear = () => dayjs().year();

// current year
export const setCurrentYear = () => {
  const selector = document.querySelector('.current-year');
  const currentYear = getCurrentYear();
  selector.innerText = `– ${currentYear}`;
};
