// ==UserScript==
// @name         nh-mirror
// @namespace    https://github.com/kou003/
// @version      1.0.0
// @description  nh-mirror
// @author       kou003
// @match        *://nhentai.net/g/*/*/
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-mirror.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-mirror.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';

  const updateTurningBehavior = () => {
    const reader = JSON.parse(localStorage['reader'] || '{}');
    document.documentElement.classList.toggle('turning-left', reader?.turning_behavior === 'left');
  };

  const main = async () => {
    updateTurningBehavior();

    document.head.insertAdjacentHTML('beforeend', `<style>
      html.reader.turning-left {
        .reader-bar .reader-pagination {
          flex-direction: row-reverse;
        }
        .reader-bar .reader-pagination a,
        .page-slider {
          transform: scale(-1);
        }
      }
    </style>`);

    new MutationObserver(updateTurningBehavior)
      .observe(document.querySelector('#image-container'), {attributeFilter: ['class']});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}