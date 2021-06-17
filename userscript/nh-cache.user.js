// ==UserScript==
// @name         nh-cache
// @namespace    https://github.com/kou003/
// @version      2.2
// @description  nh-cache
// @author       kou003
// @match        *://nhentai.net/g/*/*/
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-cache.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-cache.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';
  const main = async () => {
    let get_num = ()=>location.pathname.match(/(\d+)\D*$/)[1];
    let url = `https://i.nhentai.net/galleries/${_gallery.media_id}/`;
    let urlLocal = `https://${localStorage['localhost']}/${_gallery.id}/`
    fetch(urlLocal).then(r=>r.ok&&console.log(url=urlLocal));
    let btn1 = document.createElement('button');
    btn1.textContent = 'Cache';
    btn1.className = 'btn btn-secondary';
    let content = document.querySelector('nav');
    content.appendChild(btn1);
    btn1.onclick = e => {
      btn1.textContent='Reload';
      btn1.onclick=e=>document.querySelectorAll('#image-container img').forEach(img=>img.src+='?');
      document.head.insertAdjacentHTML('beforeend', `<style>
        .alert{
          display:none
        }
        #image-container img:first-of-type{
          display:none;
        }
        </style>`);
      let acr = document.querySelector("#image-container a");
      let x = {
        j: '.jpg',
        p: '.png',
        g: '.gif'
      };
      let p = document.createElement('progress');
      p.max = window._gallery.num_pages;
      content.appendChild(p);
      window.repImg = window._gallery.images.pages.map((v, i) => {
        let img = new Image();
        img.addEventListener('load', e => p.value += 1);
        let prop = {
          width: v.w,
          height: v.h,
          src: url + (1 + i) + x[v.t],
          className: 'rep-image',
          onerror: e => (e.target.src+='?')
        }
        return Object.assign(img, prop);
      });
      acr.appendChild(repImg[get_num()-1]);
      let f = e => {
        let num=get_num();
        let oriImg = acr.querySelector('img:first-of-type');
        let oldImg = acr.querySelector('.rep-image');
        let newImg = repImg[num - 1];
        console.log(newImg, oldImg);
        acr.replaceChild(newImg, oldImg);
        oriImg.removeAttribute('src');
      }
      let observer = new MutationObserver(f);
      observer.observe(acr, {attributeFilter: ['href']});
    };
    let localhost=document.createElement('input');
    localhost.type='text';
    localhost.placeholder='localhost';
    localhost.value=localStorage['localhost']||'';
    localhost.onchange=e=>localStorage['localhost']=localhost.value;
    document.querySelector('#content').appendChild(localhost);
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}