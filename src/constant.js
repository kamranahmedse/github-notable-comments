export const COMMENT_IMAGE_HEIGHT = 44;
export const DISTANCE_FROM_IMAGE = 10;
export const EXTENSION_CONTAINER_WIDTH = 64;

// DOM stuff for the issue page
export const CLASS_TIMELINE_COMMENT = 'timeline-comment';
export const CLASS_COMMENT_BODY = 'comment-body';
export const CLASS_REACTION_SUMMARY = 'reaction-summary-item';
export const QSELECTOR_SELECTED_REACTIONS = `.timeline-comment .reaction-summary-item.tooltipped`;
export const QSELECTOR_COMMENT_REACTIONS_CONTAINER = '.timeline-comment .comment-reactions-options';

// DOM Stuff for the extension
export const CLASS_EXTENSION_WRAP = 'ghnc-container';
export const CLASS_NAV_ACTION = 'ghnc-action';
export const CLASS_REACTION = 'ghnc-reaction';
export const CLASS_SELECTED_REACTION = 'ghnc-selected-reaction';
export const CLASS_HIGHLIGHT_COMMENT = 'ghnc-highlight-comment';
export const CLASS_FOOTER = 'ghnc-footer';

// Data attributes
export const ATTRIBUTE_NAV_DIRECTION = 'data-direction';
export const ATTRIBUTE_REACTION_KEY = 'data-reaction';

export const DIRECTION_NEXT = 'next';
export const DIRECTION_PREVIOUS = 'previous';

// General extension constants
export const REACTION_ANY = 'any';
export const REACTION_THUMBS_UP = 'thumbs_up';
export const REACTION_THUMBS_DOWN = 'thumbs_down';
export const REACTION_HOORAY = 'hooray';
export const REACTION_HEART = 'heart';
export const REACTION_LAUGH = 'laugh';
export const REACTION_CONFUSED = 'confused';
export const REACTIONS_LIST = [
  REACTION_ANY,
  REACTION_THUMBS_UP,
  REACTION_THUMBS_DOWN,
  REACTION_HOORAY,
  REACTION_HEART,
  REACTION_LAUGH,
  REACTION_CONFUSED,
];

export const EXTENSION_TEMPLATE = `
  <div class="${CLASS_EXTENSION_WRAP}">
    <div class="ghnc-reaction-btns">
      <button class="btn ${CLASS_REACTION} ${CLASS_SELECTED_REACTION}" ${ATTRIBUTE_REACTION_KEY}="${REACTION_ANY}">
        <g-emoji alias="+1" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f525.png" class="emoji mr-1">🔥</g-emoji>
      </button>
      <button class="btn ${CLASS_REACTION}" ${ATTRIBUTE_REACTION_KEY}="${REACTION_THUMBS_UP}">
        <g-emoji alias="+1" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f44d.png" class="emoji mr-1">👍</g-emoji>
      </button>
      <button class="btn ${CLASS_REACTION}" ${ATTRIBUTE_REACTION_KEY}="${REACTION_HEART}">
        <g-emoji alias="heart" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/2764.png" class="emoji mr-1">❤️</g-emoji>
      </button>
      <button class="btn ${CLASS_REACTION}" ${ATTRIBUTE_REACTION_KEY}="${REACTION_HOORAY}">
        <g-emoji alias="tada" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f389.png" class="emoji mr-1">🎉</g-emoji>
      </button>
      <button class="btn ${CLASS_REACTION}" ${ATTRIBUTE_REACTION_KEY}="${REACTION_LAUGH}">
        <g-emoji alias="smile" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f604.png" class="emoji">😄</g-emoji>
      </button>
      <button class="btn ${CLASS_REACTION}" ${ATTRIBUTE_REACTION_KEY}="${REACTION_THUMBS_DOWN}">
        <g-emoji alias="-1" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f44e.png" class="emoji mr-1">👎</g-emoji>
      </button>
      <button class="btn ${CLASS_REACTION}" ${ATTRIBUTE_REACTION_KEY}="${REACTION_CONFUSED}">
        <g-emoji alias="thinking_face" fallback-src="https://assets-cdn.github.com/images/icons/emoji/unicode/1f615.png" class="emoji mr-1">😕</g-emoji>
      </button>
    </div>
    <button class="btn ${CLASS_NAV_ACTION} ghnc-action-prev" ${ATTRIBUTE_NAV_DIRECTION}="${DIRECTION_PREVIOUS}">
      <svg height="16" width="8" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 3l1.5 1.5-3.75 3.5 3.75 3.5-1.5 1.5L0.5 8l5-5z" />
      </svg>
    </button>
    <button class="btn ${CLASS_NAV_ACTION} ghnc-action-next" ${ATTRIBUTE_NAV_DIRECTION}="${DIRECTION_NEXT}">
      <span class="right">
        <svg height="16" width="8" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.5 8L2.5 13l-1.5-1.5 3.75-3.5L1 4.5l1.5-1.5 5 5z" />
        </svg>
      </span>
    </button>
    <div class="${CLASS_FOOTER}">
      0 / 0
    </div>
  </div>
`;