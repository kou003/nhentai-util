// ==UserScript==
// @name         rm-noscript
// @namespace    https://github.com/kou003/
// @version      0.1.0
// @description  rm-noscript
// @author       kou003
// @match        *://nhentai.net/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/rm-noscript.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/rm-noscript.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

document.querySelectorAll('noscript').forEach(n=>n.remove());