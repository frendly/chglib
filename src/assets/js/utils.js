export function getCurrentYear() {
  return new Date().getFullYear(); // use _.once
}

export const isMainPage = window.location.pathname === '/';
