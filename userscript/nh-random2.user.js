// ==UserScript==
// @name         nh-random2
// @namespace    https://github.com/kou003/
// @version      0.3.0
// @description  nh-random2
// @author       kou003
// @match        *://nhentai.net/favorites/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-random2.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-random2.user.js
// @homepageURL  https://github.com/kou003/nhentai-util/
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';

  class Random {
    constructor(seed = 88675123) {
      this.x = 123456789;
      this.y = 362436069;
      this.z = 521288629;
      this.w = seed;
    }

    next() {
      let t = this.x ^ (this.x << 11);
      this.x = this.y; this.y = this.z; this.z = this.w;
      return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8));
    }
  }
  const main = () => {
    const accessToken = document.cookie.split(';').find(c=>c.startsWith('access_token=')).replace('access_token=', '')
    const params = new URLSearchParams(location.search);
    const page = Math.max(+params.get('page') || 1, 1);
    const seed = +params.get('seed') || 0;
    const q = params.get('q') || '';
    const rand = new Random(seed);
    const randomButton = document.querySelector('#favorites-random-button');
    const nextSeed = seed ? Math.abs(rand.next()) % 990 + 10 : parseInt(Math.random() * 990) + 10;
    randomButton.href = `/favorites/?seed=${nextSeed}${q ? '&q=' + q : ''}`;
    if (!seed) return;

    for (const a of document.querySelectorAll('a[href^="/user/favorites/?page="]')) {
      a.href = a.href + `&seed=${seed}`;
      a.onclick = () => location.href = a.href;
    }

    const observer = new IntersectionObserver((entries, observer) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) {
          target.dispatchEvent(new Event('view'));
          observer.unobserve(target);
        }
      }
    }, { rootMargin: "25% 0px 25% 0px" });

    document.body.insertAdjacentHTML('beforeEnd', `<template id="galleryFavoriteTemplate"><div class="gallery-favorite"><div class="gallery" ><a class="cover" style="padding:0 0 144.4% 0"><img loading="lazy"/><div class="caption"></div></a></div></div></template>`);
    /** @type {HTMLTemplateElement} */
    const template = document.querySelector('#galleryFavoriteTemplate');
    const favcontainer = document.querySelector('#favcontainer');

    const h1 = document.querySelector('h1');
    const countEl = h1.querySelector('.count');
    const favCount = +(countEl ?? h1).textContent.match(/[\d,]+/)[0].replace(',', '') || 0;
    h1.insertAdjacentText('beforeend', ` s${seed}`);

    let allidx = [...Array(favCount).keys()];
    if (seed == 1) {
      allidx = allidx.reverse();
    } else {
      const weight = allidx.reverse().map(i => rand.next());
      allidx = allidx.sort((a, b) => weight[a] - weight[b]);
    }

    const imgOrigin = new URL(document.querySelector('.gallery-favorite a.cover img').src).origin + '/';

    /** @param {Event} event  */
    const loadContent = async event => {
      const self = event.currentTarget;
      const idx = +self.dataset.idx;
      const page = 1 + (idx / 25 | 0);
      const n = idx % 25;
      const url = `https://nhentai.net/api/v2/favorites?page=${page}&q=${q}`;
      const data = await fetch(url, {
        headers: {
          'authorization': `User ${accessToken}`
        },
        credentials: 'include'
      }).then(r => r.json());
      const cur = data.result[n];
      const img = self.querySelector('img');
      img.src = imgOrigin + cur.thumbnail;
      const caption = self.querySelector('.caption');
      caption.textContent = cur.japanese_title || cur.english_title;
    }

    const pageIdxs = allidx.slice(25 * (page - 1), 25 * page);
    console.log(pageIdxs);
    favcontainer.replaceChildren(...pageIdxs.map(idx => {
      const clone = template.content.cloneNode(true);
      const content = clone.querySelector('.gallery-favorite');
      content.dataset.idx = idx;
      content.addEventListener('view', loadContent);
      observer.observe(content);
      return clone;
    }));
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}
