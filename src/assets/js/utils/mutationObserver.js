export const mutationObserver = (callback, node = document.body) => {
  if (!callback) {
    return;
  }

  const config = { attributes: false, childList: true, subtree: false };

  const observer = new MutationObserver(callback);
  observer.observe(node, config);
};
