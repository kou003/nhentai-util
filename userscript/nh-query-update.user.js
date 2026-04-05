// ==UserScript==
// @name         nh-query-update
// @namespace    https://github.com/kou003/
// @version      1.0.0
// @description  nh-query-update
// @author       kou003
// @match        *://nhentai.net/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-query-update.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-query-update.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';
  const update = () => {
    if (!/^\/search\//.test(location.pathname)) return;
    const queryInput = document.querySelector('#content>.sort>.sort-type:first-child input');
    if (!queryInput) return;
  }
  const main = () => {
    const title = document.head.querySelector('title');
    new MutationObserver(update).observe(title, { childList: true });
    update();
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main, { once: true });
  } else {
    main();
  }
}
