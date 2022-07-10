export function getCurrentYear() {
  return new Date().getFullYear();
}

export const isMainPage = window.location.pathname === '/';
