const reactionSelector = '.timeline-comment .reaction-summary-item.tooltipped';
const reactionIndexes = {
  'thumb_up': -1,
  'thumb_down': -1,
  'hooray': -1,
  'heart': -1,
  'laugh': -1,
  'confused': -1,
};

const reactionComments = {
  'thumb_up': document.querySelectorAll(`${reactionSelector}[value="THUMBS_UP react"]`),
  'thumb_down': document.querySelectorAll(`${reactionSelector}[value="THUMBS_DOWN react"]`),
  'hooray': document.querySelectorAll(`${reactionSelector}[value="HOORAY react"]`),
  'heart': document.querySelectorAll(`${reactionSelector}[value="HEART react"]`),
  'laugh': document.querySelectorAll(`${reactionSelector}[value="LAUGH react"]`),
  'confused': document.querySelectorAll(`${reactionSelector}[value="CONFUSED react"]`),
};

function resetIndexes() {
  Object.keys(reactionIndexes)
    .forEach(reactionIndex => {
      reactionIndexes[reactionIndex] = -1
    });
}

function findAncestor(el, cls) {
  do {
    el = el.parentElement;
  } while (el && !el.classList.contains(cls));

  return el;
}

function getSelectedReactionKey() {
  const selectedReactionElement = document.querySelector('.ghnc-selected-reaction');
  if (!selectedReactionElement) {
    return false;
  }

  return selectedReactionElement.getAttribute('data-reaction');
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

function getFirstComment() {
  return document.querySelector('.timeline-comment:first-child');
}

function positionFilter() {
  const filterElement = document.querySelector('.ghnc-container');
  if (!filterElement) {
    return;
  }

  const firstComment = getFirstComment();
  const rect = getOffset(firstComment);

  filterElement.style.top = `${rect.top + 44 + 10}px`;
  filterElement.style.left = `${rect.left - 64}px`;
}

function updateAvailableCounter() {
  const footer = document.querySelector('.ghnc-footer');
  const reactionKey = getSelectedReactionKey();

  if (!reactionKey) {
    footer.innerHTML = '0 / 0';
    return;
  }

  footer.innerHTML = `${reactionIndexes[reactionKey] + 1} / ${reactionComments[reactionKey].length}`;
}

// Enables disables buttons
function updateButtonStatuses() {
  let allReactionsDisabled = true;

  Object.keys(reactionComments)
    .forEach(reactionKey => {
      const reactionButton = document.querySelector(`.ghnc-reaction[data-reaction="${reactionKey}"]`);
      if (reactionComments[reactionKey].length === 0) {
        reactionButton.setAttribute('disabled', '1');
      } else {
        reactionButton.removeAttribute('disabled');
        allReactionsDisabled = false;
      }
    });

  document.querySelectorAll('.ghnc-action')
    .forEach(actionBtn => {
      if (allReactionsDisabled) {
        actionBtn.setAttribute('disabled', '1');
      } else {
        actionBtn.removeAttribute('disabled');
      }
    });
}

function getReactionToSelect(element) {
  let reactionButton = null;

  if (element.classList.contains('ghnc-reaction')) {
    reactionButton = element;
  } else if (element.parentElement && element.parentElement.classList.contains('ghnc-reaction')) {
    reactionButton = element.parentElement;
  }

  // If reaction button is not there or is already selected
  if (!reactionButton || reactionButton.classList.contains('ghnc-selected-reaction')) {
    return false;
  }

  return reactionButton;
}

function attachFilter() {
  const reactionButtons = createNodeFromString(`
  <div class="ghnc-container">
    <div class="ghnc-reaction-btns">
      <button class="btn ghnc-reaction ghnc-selected-reaction" data-reaction="thumb_up">
        <g-emoji alias="+1" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png" class="emoji mr-1">👍</g-emoji>
      </button>
      <button class="btn ghnc-reaction" data-reaction="heart">
        <g-emoji alias="heart" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/2764.png" class="emoji mr-1">❤️</g-emoji>
      </button>
      <button class="btn ghnc-reaction" data-reaction="hooray">
        <g-emoji alias="tada" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f389.png" class="emoji mr-1">🎉</g-emoji>
      </button>
      <button class="btn ghnc-reaction" data-reaction="laugh">
        <g-emoji alias="smile" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f604.png" class="emoji">😄</g-emoji>
      </button>
      <button class="btn ghnc-reaction" data-reaction="thumb_down">
        <g-emoji alias="-1" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f44e.png" class="emoji mr-1">👎</g-emoji>
      </button>
      <button class="btn ghnc-reaction" data-reaction="confused">
        <g-emoji alias="thinking_face" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f615.png" class="emoji mr-1">😕</g-emoji>
      </button>
    </div>
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
      0 / 0
    </div>
  </div>
  `);

  document.body.appendChild(reactionButtons);

  positionFilter();
  updateAvailableCounter();
  updateButtonStatuses();
}

if (getFirstComment()) {
  attachFilter();
}

window.addEventListener('resize', positionFilter);
window.addEventListener('click', (e) => {
  const reactionButton = getReactionToSelect(e.target);

  if (reactionButton) {
    // Remove selected reaction from before
    document.querySelector('.ghnc-selected-reaction').classList.remove('ghnc-selected-reaction');
    // Make current button selected
    reactionButton.classList.add('ghnc-selected-reaction');
    // Reset the counter to 0
    resetIndexes();
  }

  updateAvailableCounter();
});

// const toFocus = thumbUpReactionElements[3];
// findAncestor(toFocus, 'timeline-comment').scrollIntoView();