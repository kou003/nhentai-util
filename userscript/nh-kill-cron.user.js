// ==UserScript==
// @name         nh-kill-cron
// @namespace    https://github.com/kou003/
// @version      0.1.0
// @description  nh-kill-cron
// @author       kou003
// @match        *://nhentai.net/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-kill-cron.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-kill-cron.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

[...Array(10000).keys()].forEach(clearInterval);
