// ==UserScript==
// @name         nh-d2q
// @namespace    https://github.com/kou003/
// @version      2.0.0
// @description  Translate directory search (i.e. /artist/foobar/) to query search (i.e. /search/?q=artist:"foobar"), to exclude hidden items
// @author       kou003
// @match        *://nhentai.net/tag/*
// @match        *://nhentai.net/artist/*
// @match        *://nhentai.net/character/*
// @match        *://nhentai.net/parody/*
// @match        *://nhentai.net/group/*
// @match        *://nhentai.net/language/*
// @match        *://nhentai.net/category/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-d2q.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-d2q.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';
  const update = () => {
    if (!/^\/(tag|artist|character|parody|group|language|category)\//.test(location.pathname)) return;
    if (document.querySelector('#toQuery')) return;
    const [_, t, v] = location.pathname.match(/\/(.*)\/(.*)\//);
    const toQuery = Object.assign(document.querySelector('#toQuery') || document.createElement('a'), {
      id: 'toQuery',
      className: 'current',
      textContent: 'ToQuery',
      href: `/search/?q=${t}%3A"${v.replaceAll('-', '+')}"`
    });
    document.querySelector('#content>.sort>.sort-type:first-child').appendChild(toQuery);
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
