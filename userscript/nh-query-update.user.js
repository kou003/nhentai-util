// ==UserScript==
// @name         nh-query-update
// @namespace    https://github.com/kou003/
// @version      2.0.0
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
    if (location.pathname !== '/search') return;
    const q = new URLSearchParams(location.search).get('q');
    const input = document.querySelector('input[type="search"]');
    if (q && input && input.value !== q) input.value = q;
  }
  const main = () => {
    const title = document.head.querySelector('title');
    new MutationObserver(update).observe(document, { childList: true, subtree: true });
    update();
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main, { once: true });
  } else {
    main();
  }
}
