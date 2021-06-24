// ==UserScript==
// @name         nh-random
// @namespace    https://github.com/kou003/
// @version      1.0
// @description  nh-random
// @author       kou003
// @match        *://nhentai.net/favorites/
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-random.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-random.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';
  const retry = url => new Promise(resolve=>setTimeout(resolve(fetch(url), Math.random()*2)));
  const main = () => {
    document.body.insertAdjacentHTML('beforeEnd', `<template id="galleryFavoriteTemplate"><div class="gallery-favorite"><button class="btn btn-primary btn-thin remove-button" type="button"><i class="fa fa-minus"></i>&nbsp;<span class="text">Remove</span></button><div class="gallery" ><a class="cover" style="padding:0 0 144.4% 0"><img loading="lazy"/><div class="caption"></div></a></div></div></template>`);
    const template = document.querySelector('#galleryFavoriteTemplate').content.firstElementChild;
    const galleryFavorite = async html => {
      const data = eval(html.match(/_gallery.*(JSON[\s\S]*);/)[1]);
      const content = template.cloneNode(deep = true);
      const [gallery, a, img, caption] = content.querySelectorAll('.gallery, a, img, .caption');
      content.dataset.id = data.id;
      gallery.dataset.tags = data.tags.map(t => t.id).join(' ');
      a.href = '/g/' + data.id + '/';
      img.width = data.images.thumbnail.w;
      img.height = data.images.thumbnail.h;
      img.src = 'https://t.nhentai.net/galleries/' + data.media_id + '/thumb' + {j:'.jpg',p:'.png',g:'.gif'}[data.images.thumbnail.t];
      caption.textContent = data.title.japanese || data.title.english;
      return content;
    };
    document.querySelector('#favorites-random-button').onclick = e => {
      document.title = 'Random Favorites » nhentai: hentai doujinshi and manga';
      const favcontainer = document.querySelector('#favcontainer');
      document.body.classList.add('random');
      favcontainer.innerHTML='';
      Promise.all([...Array(10).keys()]
        .map(e=>fetch('https://nhentai.net/favorites/random')
          .then(r=>r.ok ? r : retry(r.url))
          .then(r=>r.text())
          .then(galleryFavorite)
          .then(g=>favcontainer.appendChild(g))
        )
      ).then(e=>history.pushState({content: favcontainer.innerHTML}, document.title, '_random'))
      return e.preventDefault();
    };
    document.head.insertAdjacentHTML('beforeEnd', '<style>.random h1::after{content:"random"}.random .pagination,.random .count{display:none}</style>');
    window.onpopstate = e => {
      const favcontainer = document.querySelector('#favcontainer');
      if (e.state == null) location.reload();
      else favcontainer.innerHTML = e.state.content;
    }
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}