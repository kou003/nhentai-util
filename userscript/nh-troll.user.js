// ==UserScript==
// @name         nh-troll
// @namespace    https://github.com/kou003/
// @version      1.0.1
// @description  nh-troll
// @author       kou003
// @match        *://nhentai.net/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-troll.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-troll.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';

  window.addEventListener('error', e => {
    const img = e.target;
    if (img.tagName != 'IMG') return;
    const m = img.src.match(/^https:\/\/t(\d+).nhentai.net/);
    if (m) {
      img.dataset.tlist ??= '2 3 5 7';
      const tlist = img.dataset.tlist?.split(' ').filter(t => t != m[1]);
      if (tlist.length == 0) return;
      img.src = img.src.replace(`t${m[1]}.nhentai.net`, `t${tlist.pop()}.nhentai.net`);
      img.dataset.tlist = tlist.join(' ');
    }
  }, true);
}
