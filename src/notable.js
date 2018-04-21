import {
  ATTRIBUTE_NAV_DIRECTION,
  ATTRIBUTE_REACTION_KEY,
  CLASS_COMMENT_BODY,
  CLASS_EXTENSION_WRAP, CLASS_FOOTER,
  CLASS_HIGHLIGHT_COMMENT,
  CLASS_NAV_ACTION,
  CLASS_REACTION, CLASS_REACTION_SUMMARY,
  CLASS_SELECTED_REACTION, CLASS_TIMELINE_COMMENT, COMMENT_IMAGE_HEIGHT,
  DIRECTION_NEXT, DISTANCE_FROM_IMAGE, EXTENSION_CONTAINER_WIDTH,
  EXTENSION_TEMPLATE, QSELECTOR_COMMENT_REACTIONS_CONTAINER, QSELECTOR_SELECTED_REACTIONS, REACTION_ANY,
  REACTIONS_LIST
} from "./constant";

import {
  createNodeFromString,
  findAncestor,
  getElementOffset
} from "./utils";

/**
 * Wraps the main extension functionality.
 * TODO: Refactor! split into multiple classes, use dependency injection, use Mobx for state management
 */
export class Notable {
  constructor() {
    this.reactionComments = {};
    this.activeReactionIndex = {};

    this.refresh = this.refresh.bind(this);
  }

  init() {
    this.resetActiveIndexes();

    this.refresh();
    this.bind();
  }

  bind() {
    window.addEventListener('resize', () => {
      this.refresh();
    });

    window.addEventListener('DOMNodeInserted', (e) => {
      if (this.shouldRefresh(e.target)) {
        this.refresh();
      }
    });

    window.addEventListener('click', (e) => {
      const reactionButton = this.getReactionToSelect(e.target);
      if (reactionButton) {
        this.selectReactionButton(reactionButton);
      }

      const directionButton = this.getDirectionToMove(e.target);
      if (directionButton) {
        this.changeCommentSelection(directionButton);
      }
    });
  }

  /**
   * Selects the next available comment in the given direction
   * @param directionButton { Element }
   */
  changeCommentSelection(directionButton) {
    const directionKey = directionButton.getAttribute(ATTRIBUTE_NAV_DIRECTION);
    const reactionKey = this.getSelectedReactionKey();

    const indexToSelect = directionKey === DIRECTION_NEXT
      ? this.activeReactionIndex[reactionKey] + 1
      : this.activeReactionIndex[reactionKey] - 1;

    this.focusReactionComment(reactionKey, indexToSelect);
    this.updateAvailableCounter();
  }

  /**
   * Finds the direction to move from the clicked element
   * @param clickedElement {Element}
   * @returns {Element | null}
   */
  getDirectionToMove(clickedElement) {
    if (clickedElement.classList.contains(CLASS_NAV_ACTION)) {
      return clickedElement;
    }

    return findAncestor(clickedElement, CLASS_NAV_ACTION);
  }

  /**
   * Gets the reaction to select from the clicked element
   * @param clickedElement {Element}
   * @returns {Element | null}
   */
  getReactionToSelect(clickedElement) {
    if (clickedElement.classList.contains(CLASS_REACTION)) {
      return clickedElement
    }

    return findAncestor(clickedElement, CLASS_REACTION);
  }

  shouldRefresh(mutatedElement) {
    // Todo: determine the kind of mutation and decide if refresh is required or not
    return true;
  }

  /**
   * Selects the given reaction button and focuses the comment
   * available against the given reaction
   * @param reactionButton {Element}
   */
  selectReactionButton(reactionButton) {
    const reactionKey = reactionButton.getAttribute(ATTRIBUTE_REACTION_KEY);

    // Remove selected reaction from before
    document.querySelector(`.${CLASS_SELECTED_REACTION}`)
      .classList
      .remove(CLASS_SELECTED_REACTION);

    // Make current button selected
    reactionButton
      .classList
      .add(CLASS_SELECTED_REACTION);

    // Reset the counter to 0
    this.resetActiveIndexes();
    // Select the provided comment for the reaction
    this.focusReactionComment(reactionKey, this.activeReactionIndex[reactionKey] + 1);

    this.updateAvailableCounter();
  }

  /**
   * Sets the active indexes for each reaction to be -1
   */
  resetActiveIndexes() {
    REACTIONS_LIST.forEach(reactionKey => {
      this.activeReactionIndex[reactionKey] = -1
    });
  }

  /**
   * Focuses the comment at given index for the given reaction
   *
   * @param reactionKey {string}
   * @param indexToSelect {number}
   */
  focusReactionComment(reactionKey, indexToSelect) {
    if (!this.reactionComments[reactionKey]) {
      return;
    }

    // If given index goes out of the upper bound, select the first one
    // If it goes below the lower bound, select the last one
    if (indexToSelect > this.reactionComments[reactionKey].length - 1) {
      indexToSelect = 0;
    } else if (indexToSelect < 0) {
      indexToSelect = this.reactionComments[reactionKey].length - 1;
    }

    const commentToSelect = this.reactionComments[reactionKey][indexToSelect].element;

    this.activeReactionIndex[reactionKey] = indexToSelect;
    commentToSelect.scrollIntoView();

    const commentBody = commentToSelect.querySelector(`.${CLASS_COMMENT_BODY}`);
    if (!commentBody) {
      return;
    }

    commentBody.classList.remove(CLASS_HIGHLIGHT_COMMENT);
    window.setTimeout(() => commentBody.classList.add(CLASS_HIGHLIGHT_COMMENT));
  }

  /**
   * Re-initializes the extension
   *
   * Counts the reaction comments, loads the extension and
   * updates the button states.
   */
  refresh() {
    // Remove if extension is not required
    if (!this.shouldInitialize()) {
      this.removeExtensionContainer();

      return;
    }

    const notableContainer = this.getExtensionContainer();
    if (!notableContainer) {
      const reactionButtons = createNodeFromString(EXTENSION_TEMPLATE);
      document.body.appendChild(reactionButtons);
    }

    this.loadReactedComments();
    this.positionExtension();
    this.updateAvailableCounter();
    this.updateButtonStates();
  }

  /**
   * Checks whether to initialize extension on current page or not
   * @returns {boolean}
   */
  shouldInitialize() {
    const hasCommentsOnPage = this.getCommentsCount() >= 3;
    const hasReactions = this.findAllReactedComments().length !== 0;

    // There are at-least 3 comments on page
    return hasCommentsOnPage && hasReactions;
  }

  /**
   * Removes the extension container from DOM
   */
  removeExtensionContainer() {
    const notableContainer = this.getExtensionContainer();

    if (!notableContainer || !notableContainer.parentElement) {
      return;
    }

    notableContainer.parentElement.removeChild(notableContainer);
  }

  /**
   * Gets the extension if available in DOM
   * @returns {Element | null}
   */
  getExtensionContainer() {
    return document.querySelector(`.${CLASS_EXTENSION_WRAP}`);
  }

  /**
   * Positions the extension below the user's
   * image of the first comment
   */
  positionExtension() {
    const extensionContainer = this.getExtensionContainer();
    if (!extensionContainer) {
      return;
    }

    const firstComment = this.getFirstComment();
    const rect = getElementOffset(firstComment);

    extensionContainer.style.top = `${rect.top + COMMENT_IMAGE_HEIGHT + DISTANCE_FROM_IMAGE}px`;
    extensionContainer.style.left = `${rect.left - EXTENSION_CONTAINER_WIDTH}px`;
  }

  /**
   * Updates the currently active counter and
   * the total comments count for the given reaction
   */
  updateAvailableCounter() {
    const footer = document.querySelector(`.${CLASS_FOOTER}`);
    const reactionKey = this.getSelectedReactionKey();
    const existingFooterText = footer.innerHTML;

    let newFooterText = !reactionKey ? '0 / 0' : `${this.activeReactionIndex[reactionKey] + 1} / ${this.reactionComments[reactionKey].length}`;

    if (existingFooterText !== newFooterText) {
      footer.innerHTML = `${this.activeReactionIndex[reactionKey] + 1} / ${this.reactionComments[reactionKey].length}`;
    }
  }

  /**
   * Enable disables buttons based upon
   * the available comments
   */
  updateButtonStates() {
    let allReactionsDisabled = true;

    REACTIONS_LIST.forEach(reactionKey => {
      const reactionButton = document.querySelector(`.${CLASS_REACTION}[${ATTRIBUTE_REACTION_KEY}="${reactionKey}"]`);
      const hasReactionComments = this.reactionComments[reactionKey].length !== 0;

      if (!hasReactionComments) {
        reactionButton.setAttribute('disabled', '1');
      } else {
        reactionButton.removeAttribute('disabled');
        allReactionsDisabled = false;
      }
    });

    // For each fot the direction nav buttons
    document.querySelectorAll(`.${CLASS_NAV_ACTION}`)
      .forEach(actionBtn => {
        if (allReactionsDisabled) {
          actionBtn.setAttribute('disabled', '1');
        } else {
          actionBtn.removeAttribute('disabled');
        }
      });
  }

  /**
   * Gets the currently selected reaction filter
   * @returns {string}
   */
  getSelectedReactionKey() {
    const selectedReactionElement = document.querySelector(`.${CLASS_SELECTED_REACTION}`);
    if (!selectedReactionElement) {
      return REACTION_ANY;
    }

    return selectedReactionElement.getAttribute(ATTRIBUTE_REACTION_KEY);
  }

  /**
   * Populates the reacted comments against
   * the reaction keys
   */
  loadReactedComments() {
    REACTIONS_LIST.forEach((reactionKey) => {
      if (reactionKey !== REACTION_ANY) {
        this.reactionComments[reactionKey] = this.findCommentsWithReaction(reactionKey);
      } else {
        this.reactionComments[reactionKey] = this.findAllReactedComments();
      }
    });
  }

  /**
   * Gets the array of comments DOM Elements sorted
   * in descending order for the given reaction key
   *
   * @param reactionKey {string}
   * @returns {Array}
   */
  findCommentsWithReaction(reactionKey) {
    const querySelector = `${QSELECTOR_SELECTED_REACTIONS}[value^="${reactionKey.toUpperCase()}"]`;
    let commentElements = [];

    document.querySelectorAll(querySelector)
      .forEach(element => {
        let reactionText = element.innerText;
        reactionText = reactionText.replace(/\D+/, '');

        if (!reactionText) {
          return;
        }

        commentElements.push({
          element: findAncestor(element, CLASS_TIMELINE_COMMENT),
          count: parseInt(reactionText, 10)
        });
      });

    return commentElements.sort((a, b) => b.count - a.count);
  }

  /**
   * Gets the array of comments DOM elements with any reaction
   * @returns {Array}
   */
  findAllReactedComments() {
    const reactedComments = document.querySelectorAll(QSELECTOR_COMMENT_REACTIONS_CONTAINER);
    let commentElements = [];

    // For each of the comments, count number of reactions to each comment
    reactedComments.forEach(reactedComment => {
      const commentReaction = reactedComment.querySelectorAll(`.${CLASS_REACTION_SUMMARY}`);
      let groupReactionCount = 0;

      // Count the number of reactions against this comment
      commentReaction.forEach(commentReaction => {
        let reactionText = commentReaction.innerText;
        reactionText = reactionText.replace(/\D+/, '');

        if (!reactionText) {
          return;
        }

        groupReactionCount += parseInt(reactionText, 10);
      });

      if (!groupReactionCount) {
        return;
      }

      commentElements.push({
        element: findAncestor(reactedComment, CLASS_TIMELINE_COMMENT),
        count: groupReactionCount
      });
    });

    return commentElements.sort((a, b) => b.count - a.count);
  }

  /**
   * Gets first comment on issues page
   * @returns {Element | null}
   */
  getFirstComment() {
    return document.querySelector(`.${CLASS_TIMELINE_COMMENT}:first-child`);
  }

  /**
   * Gets the number of comments available on page
   * @returns {number}
   */
  getCommentsCount() {
    return document.querySelectorAll(`.${CLASS_TIMELINE_COMMENT}`).length;
  }
}
