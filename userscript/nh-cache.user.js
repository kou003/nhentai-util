// ==UserScript==
// @name         nh-cache
// @namespace    https://github.com/kou003/
// @version      3.3.4
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
    const localhost=document.createElement('input');
    localhost.type='text';
    localhost.placeholder='localhost';
    localhost.value=localStorage['localhost']||'';
    localhost.onchange=e=>localStorage['localhost']=localhost.value;
    document.querySelector('#content').appendChild(localhost);
    const autoload=document.createElement('input');
    autoload.type='checkbox';
    autoload.placeholder='autoload';
    autoload.checked=+localStorage['autoload']||false;
    autoload.onchange=e=>localStorage['autoload']=+autoload.checked;
    document.querySelector('#content').appendChild(autoload);
    const semaphore=document.createElement('input');
    semaphore.type='number';
    semaphore.min=1;
    semaphore.value=Math.max(1, localStorage['semaphore']||30);
    semaphore.onchange=e=>localStorage['semaphore']=semaphore.value;
    document.querySelector('#content').appendChild(semaphore);

    const SEM = +semaphore.value;
    const get_num = ()=>+location.pathname.match(/(\d+)\D*$/)[1];
    const content = document.querySelector('nav');
    const btn = content.appendChild(document.createElement('button'));
    btn.textContent = 'Cache';
    btn.className = 'btn btn-secondary';
    window.url = `https://i.nhentai.net/galleries/${_gallery.media_id}/`;
    const local = `https://${localStorage['localhost']}/${_gallery.id}/`;
    fetch(local).then(r=>r.ok&&(btn.textContent='Local')&&(url=local)&&+localStorage['autoload']&&btn.click());
    btn.onclick = e => {
      const acr = document.querySelector("#image-container a");
      btn.textContent='Reload';
      btn.onclick=e=>acr.querySelector('.rep-image').reload();
      document.head.insertAdjacentHTML('beforeend', `<style>.alert{display:none} #image-container img:first-of-type{display:none;}</style>`);
      const x = {j: '.jpg', p: '.png', g: '.gif'};
      const p = document.createElement('progress');
      p.max = _gallery.num_pages;
      p.value = 0;
      content.appendChild(p);
      class RepImage extends Image {
        constructor(width, height, origin) {
          super(width, height);
          this.dataset.origin=origin;
          this.className='rep-image';
        }
        load() {
          if (this.src != this.dataset.origin) 
            this.src=this.dataset.origin;
          return this;
        }
        reload() {
          this.src+='?';
          return this;
        }
      }
      window.repImg = _gallery.images.pages.map((v, i)=>new RepImage(v.w, v.h, url+(1+i)+x[v.t]));
      window._repImg = repImg.slice(get_num()-1).concat(repImg.slice(0,get_num()-1).reverse());
      window.queue = _repImg.slice(SEM).reverse();
      for (const img of repImg) {
        img.onload=e=>{p.value+=1;queue.length&&queue.pop().load()};
        img.onerror=e=>setTimeout(img.reload, Math.random() * 1000);
      }
      _repImg.slice(0,SEM).forEach(img=>img.load());
      acr.appendChild(repImg[get_num()-1]);
      new MutationObserver(e => {
        const oriImg = acr.querySelector('img:first-of-type');
        const oldImg = acr.querySelector('.rep-image');
        const newImg = repImg[get_num() - 1];
        acr.replaceChild(newImg, oldImg);
        oriImg.removeAttribute('src');
      }).observe(acr, {attributeFilter: ['href']});
    };
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}