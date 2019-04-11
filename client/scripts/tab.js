/**
 * The code below is taken from bootstrap.native
 * License: https://github.com/thednp/bootstrap.native/blob/master/LICENSE
 * Repo: https://github.com/thednp/bootstrap.native
 * Only the tab functionality is needed for this project, so only that was taken.
 */

// Native Javascript for Bootstrap 4 v2.0.26 | © dnp_theme | MIT-License
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD support:
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like:
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    var bsn = factory();
    root.Tab = bsn.Tab;
  }
})(this, function() {
  /* Native Javascript for Bootstrap 4 | Internal Utility Functions
    ----------------------------------------------------------------*/
  'use strict';

  // globals
  var globalObject = typeof global !== 'undefined' ? global : this || window,
    DOC = document,
    HTML = DOC.documentElement,
    body = 'body', // allow the library to be used in <head>
    // Native Javascript for Bootstrap Global Object
    BSN = (globalObject.BSN = {}),
    supports = (BSN.supports = []),
    // function toggle attributes
    dataToggle = 'data-toggle',
    stringTab = 'Tab',
    dataHeight = 'data-height',
    currentTarget = 'currentTarget',
    offsetWidth = 'offsetWidth',
    offsetHeight = 'offsetHeight',
    scrollHeight = 'scrollHeight',
    ariaSelected = 'aria-selected',
    // event names
    clickEvent = 'click',
    // originalEvents
    showEvent = 'show',
    shownEvent = 'shown',
    hideEvent = 'hide',
    hiddenEvent = 'hidden',
    // other
    getAttribute = 'getAttribute',
    setAttribute = 'setAttribute',
    preventDefault = 'preventDefault',
    querySelectorAll = 'querySelectorAll',
    getElementsByCLASSNAME = 'getElementsByClassName',
    getComputedStyle = 'getComputedStyle',
    parentNode = 'parentNode',
    length = 'length',
    toLowerCase = 'toLowerCase',
    Transition = 'Transition',
    Duration = 'Duration',
    Webkit = 'Webkit',
    style = 'style',
    push = 'push',
    contains = 'contains',
    active = 'active',
    showClass = 'show',
    collapsing = 'collapsing',
    left = 'left',
    // transitionEnd since 2.0.4
    supportTransitions =
      Webkit + Transition in HTML[style] ||
      Transition[toLowerCase]() in HTML[style],
    transitionEndEvent =
      Webkit + Transition in HTML[style]
        ? Webkit[toLowerCase]() + Transition + 'End'
        : Transition[toLowerCase]() + 'end',
    transitionDuration =
      Webkit + Duration in HTML[style]
        ? Webkit[toLowerCase]() + Transition + Duration
        : Transition[toLowerCase]() + Duration,
    // class manipulation, since 2.0.0 requires polyfill.js
    addClass = function(element, classNAME) {
      element.classList.add(classNAME);
    },
    removeClass = function(element, classNAME) {
      element.classList.remove(classNAME);
    },
    hasClass = function(element, classNAME) {
      // since 2.0.0
      return element.classList[contains](classNAME);
    },
    // selection methods
    getElementsByClassName = function(element, classNAME) {
      // returns Array
      return [].slice.call(element[getElementsByCLASSNAME](classNAME));
    },
    queryElement = function(selector, parent) {
      var lookUp = parent ? parent : DOC;
      return typeof selector === 'object'
        ? selector
        : lookUp.querySelector(selector);
    },
    getClosest = function(element, selector) {
      //element is the element and selector is for the closest parent element to find
      // source http://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
      var firstChar = selector.charAt(0),
        selectorSubstring = selector.substr(1);
      if (firstChar === '.') {
        // If selector is a class
        for (; element && element !== DOC; element = element[parentNode]) {
          // Get closest match
          if (
            queryElement(selector, element[parentNode]) !== null &&
            hasClass(element, selectorSubstring)
          ) {
            return element;
          }
        }
      } else if (firstChar === '#') {
        // If selector is an ID
        for (; element && element !== DOC; element = element[parentNode]) {
          // Get closest match
          if (element.id === selectorSubstring) {
            return element;
          }
        }
      }
      return false;
    },
    // event attach jQuery style / trigger  since 1.2.0
    on = function(element, event, handler) {
      element.addEventListener(event, handler, false);
    },
    off = function(element, event, handler) {
      element.removeEventListener(event, handler, false);
    },
    one = function(element, event, handler) {
      // one since 2.0.4
      on(element, event, function handlerWrapper(e) {
        handler(e);
        off(element, event, handlerWrapper);
      });
    },
    getTransitionDurationFromElement = function(element) {
      var duration = supportTransitions
        ? globalObject[getComputedStyle](element)[transitionDuration]
        : 0;
      duration = parseFloat(duration);
      duration =
        typeof duration === 'number' && !isNaN(duration) ? duration * 1000 : 0;
      return duration; // we take a short offset to make sure we fire on the next frame after animation
    },
    emulateTransitionEnd = function(element, handler) {
      // emulateTransitionEnd since 2.0.4
      var called = 0,
        duration = getTransitionDurationFromElement(element);
      duration
        ? one(element, transitionEndEvent, function(e) {
            !called && handler(e), (called = 1);
          })
        : setTimeout(function() {
            !called && handler(), (called = 1);
          }, 17);
    },
    bootstrapCustomEvent = function(eventName, componentName, related) {
      var OriginalCustomEvent = new CustomEvent(
        eventName + '.bs.' + componentName
      );
      OriginalCustomEvent.relatedTarget = related;
      this.dispatchEvent(OriginalCustomEvent);
    };

  BSN.version = '2.0.26';

    /* Native Javascript for Bootstrap 4 | Tab
        -----------------------------------------*/
    // TAB DEFINITION
    // ==============
    class Tab {
        constructor(element, options) {
            // initialization element
            element = queryElement(element);
            // DATA API
            var heightData = element[getAttribute](dataHeight),
                // strings
                component = 'tab', height = 'height', float = 'float', isAnimating = 'isAnimating';
            // set options
            options = options || {};
            this[height] = supportTransitions
                ? options[height] || heightData === 'true'
                : false;
            // bind, event targets
            var self = this, next, tabs = getClosest(element, '.nav'), tabsContentContainer = false, dropdown = tabs && queryElement('.dropdown-toggle', tabs), activeTab, activeContent, nextContent, containerHeight, equalContents, nextHeight,
                // trigger
                triggerEnd = function () {
                    tabsContentContainer[style][height] = '';
                    removeClass(tabsContentContainer, collapsing);
                    tabs[isAnimating] = false;
                }, triggerShow = function () {
                    if (tabsContentContainer) {
                        // height animation
                        if (equalContents) {
                            triggerEnd();
                        }
                        else {
                            setTimeout(function () {
                                // enables height animation
                                tabsContentContainer[style][height] = nextHeight + 'px'; // height animation
                                tabsContentContainer[offsetWidth];
                                emulateTransitionEnd(tabsContentContainer, triggerEnd);
                            }, 50);
                        }
                    }
                    else {
                        tabs[isAnimating] = false;
                    }
                    bootstrapCustomEvent.call(next, shownEvent, component, activeTab);
                }, triggerHide = function () {
                    if (tabsContentContainer) {
                        activeContent[style][float] = left;
                        nextContent[style][float] = left;
                        containerHeight = activeContent[scrollHeight];
                    }
                    addClass(nextContent, active);
                    bootstrapCustomEvent.call(next, showEvent, component, activeTab);
                    removeClass(activeContent, active);
                    bootstrapCustomEvent.call(activeTab, hiddenEvent, component, next);
                    if (tabsContentContainer) {
                        nextHeight = nextContent[scrollHeight];
                        equalContents = nextHeight === containerHeight;
                        addClass(tabsContentContainer, collapsing);
                        tabsContentContainer[style][height] = containerHeight + 'px'; // height animation
                        tabsContentContainer[offsetHeight];
                        activeContent[style][float] = '';
                        nextContent[style][float] = '';
                    }
                    if (hasClass(nextContent, 'fade')) {
                        setTimeout(function () {
                            addClass(nextContent, showClass);
                            emulateTransitionEnd(nextContent, triggerShow);
                        }, 20);
                    }
                    else {
                        triggerShow();
                    }
                };
            if (!tabs)
                return; // invalidate
            // set default animation state
            tabs[isAnimating] = false;
            // private methods
            var getActiveTab = function () {
                var activeTabs = getElementsByClassName(tabs, active), activeTab;
                if (activeTabs[length] === 1 &&
                    !hasClass(activeTabs[0][parentNode], 'dropdown')) {
                    activeTab = activeTabs[0];
                }
                else if (activeTabs[length] > 1) {
                    activeTab = activeTabs[activeTabs[length] - 1];
                }
                return activeTab;
            }, getActiveContent = function () {
                return queryElement(getActiveTab()[getAttribute]('href'));
            },
                // handler
                clickHandler = function (e) {
                    e[preventDefault]();
                    next = e[currentTarget];
                    !tabs[isAnimating] && !hasClass(next, active) && self.show();
                };
            // public method
            this.show = function () {
                // the tab we clicked is now the next tab
                next = next || element;
                nextContent = queryElement(next[getAttribute]('href')); //this is the actual object, the next tab content to activate
                activeTab = getActiveTab();
                activeContent = getActiveContent();
                tabs[isAnimating] = true;
                removeClass(activeTab, active);
                activeTab[setAttribute](ariaSelected, 'false');
                addClass(next, active);
                next[setAttribute](ariaSelected, 'true');
                if (dropdown) {
                    if (!hasClass(element[parentNode], 'dropdown-menu')) {
                        if (hasClass(dropdown, active))
                            removeClass(dropdown, active);
                    }
                    else {
                        if (!hasClass(dropdown, active))
                            addClass(dropdown, active);
                    }
                }
                bootstrapCustomEvent.call(activeTab, hideEvent, component, next);
                if (hasClass(activeContent, 'fade')) {
                    removeClass(activeContent, showClass);
                    emulateTransitionEnd(activeContent, triggerHide);
                }
                else {
                    triggerHide();
                }
            };
            // init
            if (!(stringTab in element)) {
                // prevent adding event handlers twice
                on(element, clickEvent, clickHandler);
            }
            if (self[height]) {
                tabsContentContainer = getActiveContent()[parentNode];
            }
            element[stringTab] = self;
        }
    }

  // TAB DATA API
  // ============
  supports[push]([stringTab, Tab, '[' + dataToggle + '="tab"]']);

  /* Native Javascript for Bootstrap 4 | Initialize Data API
    --------------------------------------------------------*/
  var initializeDataAPI = function(constructor, collection) {
      for (var i = 0, l = collection[length]; i < l; i++) {
        new constructor(collection[i]);
      }
    },
    initCallback = (BSN.initCallback = function(lookUp) {
      lookUp = lookUp || DOC;
      for (var i = 0, l = supports[length]; i < l; i++) {
        initializeDataAPI(
          supports[i][1],
          lookUp[querySelectorAll](supports[i][2])
        );
      }
    });

  // bulk initialize all components
  DOC[body]
    ? initCallback()
    : on(DOC, 'DOMContentLoaded', function() {
        initCallback();
      });

  return {
    Tab: Tab
  };
});
