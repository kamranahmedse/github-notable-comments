export const findAncestor = (el, cls) => {
  do {
    el = el.parentElement;
  } while (el && !el.classList.contains(cls));

  return el;
};

export const createNodeFromString = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
};

export const getElementOffset = (el) => {
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};