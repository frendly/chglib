export const mutationObserver = (callback: MutationCallback, node: Node = document.body): void => {
  if (!callback) {
    return;
  }

  const config: MutationObserverInit = {
    attributes: false,
    childList: true,
    subtree: false,
  };

  const observer = new MutationObserver(callback);
  observer.observe(node, config);
};
