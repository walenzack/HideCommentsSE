// ==UserScript==
// @name         StackExchange No Comments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Stack Overflow and Stack Exchange sites are Q&A sites, not Q&A&C sites. Make it so by hiding all comments.
// @author       walen
// @match        https://*.stackoverflow.com/
// @match        https://*.stackexchange.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    [].forEach.call(
        document.querySelectorAll('div[id^="comments"]'),
        function(e) {
            e.style.display="none";
        }
    );
    // TODO Hide comment notifications too
})();
