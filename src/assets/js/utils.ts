export function getCurrentYear() {
  console.log('getCurrentYear');
  return new Date().getFullYear();

}

export const isMainPage = window.location.pathname === '/';
