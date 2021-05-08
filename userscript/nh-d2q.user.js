// ==UserScript==
// @name         nh-d2q
// @namespace    https://github.com/kou003/
// @version      1.0
// @description  Translate directory search (i.e. /artist/foobar/) to query search (i.e. /search/?q=artist:"foobar"), to exclude hidden items
// @author       kou003
// @match        *://nhentai.net/rag/*
// @match        *://nhentai.net/artist/*
// @match        *://nhentai.net/charactor/*
// @match        *://nhentai.net/parody/*
// @match        *://nhentai.net/group/*
// @updateURL    https://github.com/kou003/userscript/nh-d2q.user.js
// @downloadURL  https://github.com/kou003/userscript/nh-d2q.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

(() => {
  'use strict';
  const main = () => {
    const [_, t, v] = location.pathname.match(/\/(.*)\/(.*)\//);
    const toQuery = Object.assign(document.createElement('a'), {
      className: 'current',
      textContent: 'ToQuery',
      href: `/search/?q=${t}%3A"${v.replaceAll('-', '+')}"`
    });
    document.querySelector('#content>.sort>.sort-type:first-child').append(toQuery);
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
})()