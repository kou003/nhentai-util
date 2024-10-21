// ==UserScript==
// @name         nh-style
// @namespace    https://github.com/kou003/
// @version      0.1.1
// @description  nh-style
// @author       kou003
// @match        *://nhentai.net/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-style.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-style.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';
  document.head.insertAdjacentHTML('beforeend', `<style>.advertisement{display: none;}</style>`);
}
