export const getCurrentYear = () => new Date().getFullYear();

// current year
export const setCurrentYear = () => {
  const selector = document.querySelector('.current-year');
  const currentYear = getCurrentYear();
  selector.innerText = `– ${currentYear}`;
};
