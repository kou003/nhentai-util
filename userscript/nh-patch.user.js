// ==UserScript==
// @name         nh-patch
// @namespace    https://github.com/kou003/
// @version      0.1.1
// @description  Address mysterious hyperlink bug 
// @author       kou003
// @match        *://nhentai.net/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-patch.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-patch.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';
  const main = () => {
    document.querySelectorAll('#cover>a, a.tag, a.cover, a.gallerythumb').forEach(a => {
      a.addEventListener('click', ({currentTarget: {href}}) => href && (location.href=href))
    });
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}