// ==UserScript==
// @name         nh-random2
// @namespace    https://github.com/kou003/
// @version      0.1.1
// @description  nh-random2
// @author       kou003
// @match        *://nhentai.net/favorites/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-random2.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-random2.user.js
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

  const retry = url => new Promise(resolve => setTimeout(resolve(fetch(url), Math.random() * 100)));
  const fetch = url => window.fetch(url).then(r => r.ok ? r : retry(url));
  const main = () => {
    const params = new URLSearchParams(location.search);
    const page = Math.max(+params.get('page') || 1, 1);
    const seed = +params.get('seed') || 0;
    const q = params.get('q');
    const rand = new Random(seed);
    const randomButton = document.querySelector('#favorites-random-button');
    const nextSeed = seed ? Math.abs(rand.next()) % 990 + 10 : parseInt(Math.random() * 990) + 10;
    randomButton.href = `/favorites/?seed=${nextSeed}${q ? '&q=' + q : ''}`;
    if (!seed) return;

    const observer = new IntersectionObserver((entries, observer) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) {
          target.dispatchEvent(new Event('view'));
          observer.unobserve(target);
        }
      }
    }, { rootMargin: "25% 0px 25% 0px" });

    document.body.insertAdjacentHTML('beforeEnd', `<template id="galleryFavoriteTemplate"><div class="gallery-favorite"><button class="btn btn-primary btn-thin remove-button" type="button"><i class="fa fa-minus"></i>&nbsp;<span class="text">Remove</span></button><div class="gallery" ><a class="cover" style="padding:0 0 144.4% 0"><img loading="lazy"/><div class="caption"></div></a></div></div></template>`);
    /** @type {HTMLTemplateElement} */
    const template = document.querySelector('#galleryFavoriteTemplate');
    const favcontainer = document.querySelector('#favcontainer');

    const h1 = document.querySelector('h1');
    const countEl = h1.querySelector('.count');
    const favCount = +(countEl ?? h1).textContent.match(/\d+/)[0] || 0;
    countEl.textContent += ` s${seed}`;

    const allidx = [...Array(favCount).keys()];
    if (seed == 1) allidx.reverse();
    else for (let i = favCount - 1; i > 0; --i) {
      const j = Math.abs(rand.next()) % (i + 1);
      [allidx[i], allidx[j]] = [allidx[j], allidx[i]];
    }

    /** @param {Event} event  */
    const loadContent = async event => {
      const self = event.currentTarget;
      const idx = +self.dataset.idx;
      const page = 1 + (idx / 25 | 0);
      const n = idx % 25;
      const url = 'https://nhentai.net/favorites/?page=' + page + (q ? '&q=' + q : '');
      const html = sessionStorage[url] || (sessionStorage[url] = await fetch(url).then(res => res.text()));
      const dom = new DOMParser().parseFromString(html, 'text/html');
      const content = dom.querySelectorAll(`.gallery-favorite`)[n];
      content.querySelector('noscript').remove();
      const img = content.querySelector('img');
      img.src = img.dataset.src;
      self.replaceWith(content);
    }

    const pageIdxs = allidx.slice(25 * (page - 1), 25 * page);
    favcontainer.replaceChildren(...pageIdxs.map(idx => {
      const content = template.content.firstElementChild.cloneNode(true);
      content.dataset.idx = idx;
      content.addEventListener('view', loadContent);
      observer.observe(content);
      return content;
    }));
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}