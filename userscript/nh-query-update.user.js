// ==UserScript==
// @name         nh-query-update
// @namespace    https://github.com/kou003/
// @version      2.1.0
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
  const getQuery = () => {
    if (location.pathname === '/search') return new URLSearchParams(location.search).get('q');
    if (/^\/(tag|artist|character|parody|group|language|category)\//.test(location.pathname)) {
      const [_, key, value] = location.pathname.match(/\/(.*)\/(.*)\//);
      return `${key}:"${value.replaceAll('-', ' ')}"`;
    }
    return null;
  }
  const update = () => {
    const query = getQuery();
    const input = document.querySelector('input[type="search"]');
    if (query && input && input.value !== query) input.value = query;
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
