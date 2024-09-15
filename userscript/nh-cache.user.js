// ==UserScript==
// @name         nh-cache
// @namespace    https://github.com/kou003/
// @version      3.4.0
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
    const content = document.querySelector('#content');
    content.appendChild(localhost);
    const autoload=document.createElement('input');
    autoload.type='checkbox';
    autoload.placeholder='autoload';
    autoload.checked=+localStorage['autoload']||false;
    autoload.onchange=e=>localStorage['autoload']=+autoload.checked;
    content.appendChild(autoload);
    const semaphore=document.createElement('input');
    semaphore.type='number';
    semaphore.min=1;
    semaphore.value=Math.max(1, localStorage['semaphore']||30);
    semaphore.onchange=e=>localStorage['semaphore']=semaphore.value;
    content.appendChild(semaphore);

    const SEM = +semaphore.value;
    const get_num = ()=>+document.querySelector('.current').textContent;
    const nav = document.querySelector('nav');
    const btn = nav.appendChild(document.createElement('button'));
    btn.textContent = 'Cache';
    btn.className = 'btn btn-secondary';
    let url = `https://i.nhentai.net/galleries/${_gallery.media_id}/`;
    const local = `https://${localStorage['localhost']}/${_gallery.id}/`;
    
    fetch(local).then(r => {
      console.log('local fetch:', r.ok);
      if (r.ok) {
        btn.textContent='Local';
        url = local;
        if (+localStorage['autoload']) btn.click();
      }
    }).catch(e => 0);
    
    btn.onclick = e => {
      const acr = document.querySelector("#image-container a");
      btn.textContent='Reload';
      btn.onclick=e=>acr.querySelector('.rep-image').reload();
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
      const x = {j: '.jpg', p: '.png', g: '.gif'};
      const p = document.createElement('progress');
      p.max = _gallery.num_pages;
      p.value = 0;
      nav.appendChild(p);
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
        img.onerror=e=>{
          console.error(e);
          setTimeout(img.reload, 500);
        }
      }
      _repImg.slice(0,SEM).forEach(img=>img.load());
      acr.appendChild(repImg[get_num()-1]);

      // page-slider
      const slider = document.createElement('input');
      slider.class = 'page-slider';
      slider.type = 'range';
      slider.min = 1;
      slider.max = _gallery.num_pages;
      slider.value = get_num();
      content.appendChild(slider);
      slider.addEventListener('input', e => {
        const next = document.querySelector('a.next');
        next.href = `/g/${_gallery.id}/${+slider.value}/`;
        next.click();
      });

      new MutationObserver(e => {
        acr.querySelectorAll('img:not(.rep-image)')
          .forEach(img=>img.src='data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7');
        const oldImg = acr.querySelector('.rep-image');
        const newImg = repImg[get_num() - 1];
        acr.replaceChild(newImg, oldImg);
        slider.value = get_num();
      }).observe(acr, {attributeFilter: ['href']});
    };
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}
