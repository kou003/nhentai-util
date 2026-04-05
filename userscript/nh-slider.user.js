// ==UserScript==
// @name         nh-slider
// @namespace    https://github.com/kou003/
// @version      1.0.0
// @description  nh-slider
// @author       kou003
// @match        *://nhentai.net/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-slider.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-slider.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';
  const getCurrentPage = ()=>+document.querySelector('.current').textContent;
  const getPageNum = ()=>+document.querySelector('.num-pages').textContent;
  const injectSlider = () => {
    if (document.querySelector('.page-slider')) return;
    const slider = document.createElement('input');
    slider.className = 'page-slider';
    slider.type = 'range';
    slider.min = 1;
    slider.max = getPageNum();
    slider.value = getCurrentPage();
    content.appendChild(slider);
    slider.addEventListener('input', e => {
      const next = document.querySelector('a.next');
      const prev = document.querySelector('a.previous');
      const current = getCurrentPage();
      const value = +slider.value;
      const diff = value - current;
      if (diff > 0) for (let i = 0; i < diff; i++) next?.click();
      if (diff < 0) for (let i = 0; i < -diff; i++) prev?.click();
    });
  };

  const main = async () => {
    document.head.insertAdjacentHTML('beforeend', `<style>
        .alert {
          display: none
        }
        #image-container:has(.rep-image) img:not(.rep-image) {
          display: none;
        }
        .page-slider {
          display: block;
          width: 80%;
          height: 50px;
          margin: 0 auto;
        }
        </style>`);
    const callback = () => {
      const isViewer = location.pathname.match(/\/g\/\d+\/\d+\//);
      const hasSlider = !!document.querySelector('.page-slider');
      if (isViewer && !hasSlider) injectSlider();
    }
    new MutationObserver(callback).observe(document, { childList: true, subtree: true });
    callback();
  }

  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}
