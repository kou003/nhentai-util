// ==UserScript==
// @name         nh-random2
// @namespace    https://github.com/kou003/
// @version      0.1.0
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
    const rand = new Random(seed);
    const randomButton = document.querySelector('#favorites-random-button');
    if (seed) {
      randomButton.href = '/favorites/?seed=' + Math.abs(rand.next()) % 1000;
    } else {
      randomButton.href = '/favorites/?seed=' + parseInt(Math.random() * 1000);
      return;
    }

    const observer = new IntersectionObserver((entries, observer) => {
      for (const {target, isIntersecting} of entries) {
        if (isIntersecting) {
          target.src = target.dataset.src;
          observer.unobserve(target);
        }
      }
    }, {rootMargin: "25% 0px 25% 0px"});

    document.body.insertAdjacentHTML('beforeEnd', `<template id="galleryFavoriteTemplate"><div class="gallery-favorite"><button class="btn btn-primary btn-thin remove-button" type="button"><i class="fa fa-minus"></i>&nbsp;<span class="text">Remove</span></button><div class="gallery" ><a class="cover" style="padding:0 0 144.4% 0"><img loading="lazy"/><div class="caption"></div></a></div></div></template>`);
    const template = document.querySelector('#galleryFavoriteTemplate');
    const favcontainer = document.querySelector('#favcontainer');
    for (const div of favcontainer.querySelectorAll('.gallery-favorite'))
      div.replaceWith(template.content.cloneNode(true));

    const countEl = document.querySelector('h1 .count');
    const favCount = +countEl.textContent.match(/\d+/)[0];
    countEl.textContent += ` s${seed}`;

    const allidx = [...Array(favCount).keys()];
    for (let i = favCount - 1; i > 0; --i) {
      const j = Math.abs(rand.next()) % (i + 1);
      [allidx[i], allidx[j]] = [allidx[j], allidx[i]];
    }

    Promise.all(allidx.slice(25 * (page - 1), 25 * page).map(async (idx, i) => {
      const spage = (idx / 25 | 0)+1;
      const sidx = idx % 25;
      const url = 'https://nhentai.net/favorites/?page=' + spage;
      const shtml = sessionStorage[url] || (sessionStorage[url] = await fetch(url).then(res => res.text()));
      const sdom = new DOMParser().parseFromString(shtml, 'text/html');
      const content = sdom.querySelectorAll(`.gallery-favorite`)[sidx];
      content.querySelector('noscript').remove();
      const img = content.querySelector('img');
      observer.observe(img);
      favcontainer.children[i].replaceWith(content);
    }));
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}