function findAncestor(el, cls) {
  do {
    el = el.parentElement;
  } while (el && !el.classList.contains(cls));

  return el;
}

function createNodeFromString(htmlString) {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

function getOffset(el) {
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return {top: rect.top + scrollTop, left: rect.left + scrollLeft};
}

function positionFilter() {
  const filterElement = document.querySelector('.ghnc-container');
  if (!filterElement) {
    return;
  }

  const firstComment = document.querySelector('.timeline-comment:first-child');
  const rect = getOffset(firstComment);

  filterElement.style.top = `${rect.top + 44 + 10}px`;
  filterElement.style.left = `${rect.left - 64}px`;
}


const reactionSelector = '.timeline-comment .reaction-summary-item.tooltipped';
const anyReactionElements = document.querySelectorAll(`${reactionSelector}:first-child`);
const thumbUpReactionElements = document.querySelectorAll(`${reactionSelector}[value="THUMBS_UP react"]`);
const thumbDownReactionElements = document.querySelectorAll(`${reactionSelector}[value="THUMBS_DOWN react"]`);
const hoorayReactionElements = document.querySelectorAll(`${reactionSelector}[value="HOORAY react"]`);
const heartReactionElements = document.querySelectorAll(`${reactionSelector}[value="HEART react"]`);

// const toFocus = thumbUpReactionElements[3];
// findAncestor(toFocus, 'timeline-comment').scrollIntoView();


const reactionButtons = createNodeFromString(`
<div class="ghnc-container">
  <button class="btn ghnc-reaction ghnc-selected-reaction">
    <g-emoji alias="+1" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png" class="emoji mr-1">👍</g-emoji>
  </button>
  <button class="btn ghnc-reaction">
    <g-emoji alias="heart" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/2764.png" class="emoji mr-1">❤️</g-emoji>
  </button>
  <button class="btn ghnc-reaction">
    <g-emoji alias="tada" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f389.png" class="emoji mr-1">🎉</g-emoji>
  </button>
  <button class="btn ghnc-reaction">
    <g-emoji alias="smile" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f604.png" class="emoji">😄</g-emoji>
  </button>
  <button class="btn ghnc-reaction">
    <g-emoji alias="-1" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f44e.png" class="emoji mr-1">👎</g-emoji>
  </button>
  <button class="btn ghnc-reaction">
    <g-emoji alias="thinking_face" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f615.png" class="emoji mr-1">😕</g-emoji>
  </button>
  <button class="btn ghnc-action ghnc-action-prev">
    <svg height="16" width="8" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 3l1.5 1.5-3.75 3.5 3.75 3.5-1.5 1.5L0.5 8l5-5z" />
    </svg>
  </button>
  <button class="btn ghnc-action ghnc-action-next">
    <span class="right">
      <svg height="16" width="8" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.5 8L2.5 13l-1.5-1.5 3.75-3.5L1 4.5l1.5-1.5 5 5z" />
      </svg>
    </span>
  </button>
  <div class="ghnc-footer">
    10 / 18
  </div>
</div>
`);

document.body.appendChild(reactionButtons);

positionFilter();
window.addEventListener('resize', positionFilter);