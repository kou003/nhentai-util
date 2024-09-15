// ==UserScript==
// @name         nh-swipe-pagination
// @namespace    https://github.com/kou003/
// @version      1.0.0
// @description  nh-swipe-pagination
// @author       kou003
// @match        *://nhentai.net/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-swipe-pagination.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-swipe-pagination.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';

  const H_THR = 0.3;
  const V_THR = 0.5;
  const TIMEOUT = 1000;

  const main = async () => {

    let sx = null;
    let sy = null;
    let st = null;

    const touchstart = (event) => {
      if (st !== null) return;
      sx = event.changedTouches[0].clientX;
      sy = event.changedTouches[0].clientY;
      st = event.timeStamp;
    }

    const touchend = (event) => {
      if (st === null) return;
      const ex = event.changedTouches[0].clientX;
      const ey = event.changedTouches[0].clientY;
      const dx = (ex - sx) / document.body.clientWidth;
      const dy = (ey - sy) / document.body.clientHeight;
      const dt = event.timeStamp - st;
      sx = sy = st = null;
      if (Math.abs(dx) < H_THR || Math.abs(dy) > V_THR || dt > TIMEOUT) return;
      if (dx < 0) {
        document.querySelector('.pagination .next')?.click();
      } else {
        document.querySelector('.pagination .previous')?.click();
      }
    }

    if (document.querySelector('.pagination')) {
      document.body.addEventListener('touchstart', touchstart);
      document.body.addEventListener('touchend', touchend);
    }
  }

  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}
