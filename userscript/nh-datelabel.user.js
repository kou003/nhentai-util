// ==UserScript==
// @name         nh-datelabel
// @namespace    https://github.com/kou003/
// @version      1.1.1
// @description  nh-datelabel
// @author       kou003
// @match        *://nhentai.net/*
// @exclude      *://nhentai.net/favorites/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-datelabel.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-datelabel.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';
  const main = async () => {
    document.head.insertAdjacentHTML('beforeend', `<style>
      a.cover:before {
          content: attr(data-label);
          display: inline-block;
          position: absolute;
          z-index: 10000;
          left: 0;
          top: 0;
          background-color: rgba(0,0,0,0.4);
      }
    </style>`);
    const gals = [...document.querySelectorAll('.gallery a[href^="/g/"]')];
    Promise.all(gals.map(async a => {
      const gid = a.href.match(/\/g\/(\d+)\//)[1];
      const {upload_date,num_pages} = await fetch(`https://nhentai.net/api/gallery/${gid}`).then(r => r.json());
      const date = new Date(upload_date*1000).toLocaleDateString();
      a.dataset.label = `${date ?? ''} [${num_pages}]`;
    }));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}
