const elcatToggleList = (): void => {
  const baseCls = 'journal-item';
  const expandedCls = `${baseCls}--expanded`;

  const selectors = document.querySelectorAll<HTMLElement>(`.${baseCls}`);

  const handler = (event: Event): void => {
    const element = event.currentTarget;
    if (element instanceof HTMLElement) {
      element.classList.toggle(expandedCls);
    }
  };

  selectors.forEach((item) => {
    item.addEventListener('click', handler);
  });
};

export default elcatToggleList;
