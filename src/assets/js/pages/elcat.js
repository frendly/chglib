const elcatToggleList = () => {
  const baseCls = 'journal-item';
  const expandedCls = `${baseCls}--expanded`;

  const selectors = document.querySelectorAll(`.${baseCls}`);

  const handler = (event) => {
    const element = event.currentTarget;
    element.classList.toggle(expandedCls);
  }

  selectors.forEach(item => item.addEventListener("click", handler));
}

export default elcatToggleList;
