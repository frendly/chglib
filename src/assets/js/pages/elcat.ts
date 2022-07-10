const elcatToggleList = () => {
  const baseCls = 'journal-item';
  const expandedCls = `${baseCls}--expanded`;

  const selectors = document.querySelectorAll(`.${baseCls}`);

  selectors.forEach(item => item.addEventListener("click", (event) => {
    const element = event.currentTarget;
    element.classList.toggle(expandedCls);
  }));
}

export default elcatToggleList;
