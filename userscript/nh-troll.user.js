// ==UserScript==
// @name         nh-troll
// @namespace    https://github.com/kou003/
// @version      1.0.0
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

  const main = async () => {
    document.querySelectorAll('img').forEach(img => {
      img.dataset.tlist = '2 3 5 7';
      img.addEventListener('error', e => {
        const m = img.src.match(/^https:\/\/t(\d+).nhentai.net/);
        if (m) {
          const tlist = img.dataset.tlist.split(' ').filter(t => t != m[1]);
          if (tlist.length == 0) return;
          img.src = img.src.replace(`t${m[1]}.nhentai.net`, `t${tlist.pop()}.nhentai.net`);
          img.dataset.tlist = tlist.join(' ');
        }
      });
    });
  }

  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}
