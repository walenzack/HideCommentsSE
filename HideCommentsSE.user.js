// ==UserScript==
// @name         StackExchange Hide Comments
// @namespace    https://github.com/walenzack
// @version      0.3
// @description  Hide comments on all Stack Exchange sites (except StackOverflow).
// @author       walen
// @match        https://*.stackoverflow.com/*
// @match        https://*.stackexchange.com/*
// @match        https://superuser.com/*
// @match        https://askubuntu.com/*
// @match        https://serverfault.com/*
// @match        https://stackapps.com/*
// @match        https://mathoverflow.net/*
// @grant        window.setInterval
// @grant        window.clearInterval
// @grant        window.location
// ==/UserScript==

(function() {
  'use strict';
  var CLEAR_INBOX_INTERVAL_MILLIS = 5 * 1000;
  var INBOX_BUTTON = 'a[class*="js-inbox-button"]';
  var INBOX_ITEM = 'li[class^="inbox-item"]';
  var COMMENT = 'div[id^="comments"]';
  var SO = /stackoverflow\.com/;
  var SE = /(\.stackexchange\.com|superuser\.com|askubuntu\.com|serverfault\.com|stackapps\.com|mathoverflow\.net)/;
  var CHAT = /chat\.stackexchange\.com/;

  var inboxButton = document.querySelectorAll(INBOX_BUTTON)[0];
  var inboxUnreadCounter = inboxButton.children[1];

  function hideComments() {
    [].forEach.call(
      document.querySelectorAll(COMMENT),
      function (el) {
        el.style.display="none";
      }
    );
  }

  function forceLoadInbox() {
    // Show and immediately hide inbox to force loading
    inboxButton.click(); // show
    inboxButton.click(); // hide
  }
  
  function hideInboxComments() {
    forceLoadInbox();
    // TODO Skip forEach if there are no new notifications since last call
    [].forEach.call(
      document.querySelectorAll(INBOX_ITEM),
      function (el) {
        var href = el.children[0].href;
        if (SE.test(href)) {
          if (!CHAT.test(href)) { // Do not hide chat notifications
            var type = el.children[0].children[1].children[0].children[0].innerText; //hacky af
            if ('comment' === type) {
              el.style.display="none";
              var count = Number(inboxUnreadCounter.innerText);
              if (count > 1) {
                inboxUnreadCounter.innerText = --count;
              } else if (count === 1) {
                inboxUnreadCounter.innerText = "";
                inboxUnreadCounter.style.display = 'none';
              }
            }
          }
        }
      }
    );
  };

  /* Main logic */
  // Hide all comments, except on StackOverflow
  if (!SO.test(window.location)) {
    hideComments();
  }
  // Periodically check for and hide new comment notifications, everywhere
  //hideInboxComments(); // TODO First invocation is not working, let the scheduled task do it
  window.setInterval(hideInboxComments, CLEAR_INBOX_INTERVAL_MILLIS);
})();
