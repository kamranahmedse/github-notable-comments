const reactionSelector = '.timeline-comment .reaction-summary-item.tooltipped';
const reactionsList = [
  'any',
  'thumbs_up',
  'thumbs_down',
  'hooray',
  'heart',
  'laugh',
  'confused',
];

// Holds the currently focused reaction comment index
const reactionActiveIndexes = {};
// Holds the reaction comments in descending form
const reactionComments = {};

function prepareReactionsList() {
  reactionsList.forEach((reactionKey) => {
    const querySelector = reactionKey === 'any' ? `${reactionSelector}:first-child` : `${reactionSelector}[value^="${reactionKey.toUpperCase()}"]`;
    reactionComments[reactionKey] = getReactionComments(querySelector);

    reactionActiveIndexes[reactionKey] = -1;
  });
}

// Gets the comments with this reaction in descending order
function getReactionComments(querySelector) {
  let commentElements = [];

  document.querySelectorAll(querySelector)
    .forEach(element => {
      let reactionText = element.innerText;
      reactionText = reactionText.replace(/\D+/, '');

      if (!reactionText) {
        return;
      }

      commentElements.push({
        element: findAncestor(element, 'timeline-comment'),
        count: parseInt(reactionText, 10)
      });
    });

  commentElements = commentElements.sort((a, b) => b.count - a.count);

  return commentElements;
}

function resetIndexes() {
  reactionsList.forEach(reactionKey => {
    reactionActiveIndexes[reactionKey] = -1
  });
}

function focusReactionComment(reactionKey, indexToSelect) {
  if (!reactionComments[reactionKey]) {
    return;
  }

  // If given index goes out of the upper bound, select the first one
  // If it goes below the lower bound, select the last one
  if (indexToSelect > reactionComments[reactionKey].length - 1) {
    indexToSelect = 0;
  } else if (indexToSelect < 0) {
    indexToSelect = reactionComments[reactionKey].length - 1;
  }

  const commentElement = reactionComments[reactionKey][indexToSelect].element;

  reactionActiveIndexes[reactionKey] = indexToSelect;
  commentElement.scrollIntoView();

  const commentBody = commentElement.querySelector('.comment-body');
  if (!commentBody) {
    return;
  }

  commentBody.classList.remove('highlight-comment');
  window.setTimeout(() => commentBody.classList.add('highlight-comment'));
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

  footer.innerHTML = `${reactionActiveIndexes[reactionKey] + 1} / ${reactionComments[reactionKey].length}`;
}

// Enables disables buttons
function updateButtonStatuses() {
  let allReactionsDisabled = true;

  Object.keys(reactionComments)
    .forEach(reactionKey => {
      const reactionButton = document.querySelector(`.ghnc-reaction[data-reaction="${reactionKey}"]`);
      const hasReactionComments = reactionComments[reactionKey].length !== 0;
      if (!hasReactionComments) {
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
  if (element.classList.contains('ghnc-reaction')) {
    return element
  }

  return findAncestor(element, 'ghnc-reaction');
}

function getDirectionToMove(element) {
  if (element.classList.contains('ghnc-action')) {
    return element;
  }

  return findAncestor(element, 'ghnc-action');
}

function changeReactionSelection(reactionButton) {
  const isAlreadySelected = reactionButton.classList.contains('ghnc-selected-reaction');
  const reactionKey = reactionButton.getAttribute('data-reaction');

  // Just reselect the already selected comment
  if (isAlreadySelected) {
    const indexToSelect = reactionActiveIndexes[reactionKey] < 0 ? 0 : reactionActiveIndexes[reactionKey];
    focusReactionComment(reactionKey, indexToSelect);
    return;
  }

  // Remove selected reaction from before
  document.querySelector('.ghnc-selected-reaction').classList.remove('ghnc-selected-reaction');
  // Make current button selected
  reactionButton.classList.add('ghnc-selected-reaction');
  // Reset the counter to 0
  resetIndexes();
  // Select the provided comment for the reaction
  focusReactionComment(reactionKey, reactionActiveIndexes[reactionKey] + 1);
}

function changeCommentSelection(directionButton) {
  const directionKey = directionButton.getAttribute('data-direction');
  const reactionKey = getSelectedReactionKey();

  const indexToSelect = directionKey === 'next' ? reactionActiveIndexes[reactionKey] + 1 : reactionActiveIndexes[reactionKey] - 1;

  focusReactionComment(reactionKey, indexToSelect);
}

function attachFilter() {
  const reactionButtons = createNodeFromString(`
  <div class="ghnc-container">
    <div class="ghnc-reaction-btns">
      <button class="btn ghnc-reaction ghnc-selected-reaction" data-reaction="any">
        🔥
      </button>
      <button class="btn ghnc-reaction" data-reaction="thumbs_up">
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
      <button class="btn ghnc-reaction" data-reaction="thumbs_down">
        <g-emoji alias="-1" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f44e.png" class="emoji mr-1">👎</g-emoji>
      </button>
      <button class="btn ghnc-reaction" data-reaction="confused">
        <g-emoji alias="thinking_face" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f615.png" class="emoji mr-1">😕</g-emoji>
      </button>
    </div>
    <button class="btn ghnc-action ghnc-action-prev" data-direction="previous">
      <svg height="16" width="8" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 3l1.5 1.5-3.75 3.5 3.75 3.5-1.5 1.5L0.5 8l5-5z" />
      </svg>
    </button>
    <button class="btn ghnc-action ghnc-action-next" data-direction="next">
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
  prepareReactionsList();
  attachFilter();
}

window.addEventListener('resize', positionFilter);
window.addEventListener('click', (e) => {
  const reactionButton = getReactionToSelect(e.target);
  if (reactionButton) {
    changeReactionSelection(reactionButton);
  }

  const directionButton = getDirectionToMove(e.target);
  if (directionButton) {
    changeCommentSelection(directionButton);
  }

  updateAvailableCounter();
});