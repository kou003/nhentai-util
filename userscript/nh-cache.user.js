// ==UserScript==
// @name         nh-cache
// @namespace    https://github.com/kou003/
// @version      1.0
// @description  nh-cache
// @author       kou003
// @match        *://nhentai.net/g/*/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-cache.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-cache.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';
  const main = () => {
    let url=`https://i.nhentai.net/galleries/${_gallery.media_id}/`;
    let btn1=document.createElement('button');
    btn1.textContent='Cache';
    let btn2=document.createElement('button');
    btn2.textContent='Reload';
    btn1.className=btn2.className='btn btn-secondary';
    let content=document.querySelector('#content')
    content.append(btn1);
    content.append(btn2);
    btn1.addEventListener('click', e=>{
        document.head.insertAdjacentHTML('beforeend',`<style>
        .alert{
          display:none
        }
        #image-container{
          position: relative;
          overflow: hidden !important;
        }
        #image-container>a{
          position: relative;
          z-index: 1;
        }
        .rep-image{
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          margin: auto;
          z-index: 2;
        }
        </style>`);
        let c=document.querySelector("#image-container");
        let t=c.querySelector("a");
        let x={j: '.jpg', p: '.png', g: '.gif'};
        let p=document.createElement('progress');
        p.max=window._gallery.num_pages;
        content.append(p);
        window.repImg=window._gallery.images.pages.map((v,i)=>{
          let img=new Image();
          img.addEventListener('load', e=>p.value+=1);
          let prop = {width: v.w, height: v.h, src: url+(1+i)+x[v.t], className: 'rep-image', onerror: e=>setTimeout((img)=>img.src+='?', 2*Math.random(),e.currentTarget)}
          return Object.assign(img, prop);
        });
        c.append(repImg[0]);
        let f=e=>{
          let num=location.pathname.match(/(\d+)\D*$/)[1];
          let oldImg=c.querySelector('.rep-image');
          let newImg=repImg[num-1];
          console.log([num, newImg, oldImg]);
          c.replaceChild(newImg, oldImg);
          let oriImg = t.querySelector('img');
          newImg.style='';
          t.style='';
          newImg.onload=null;
          oriImg.onload=null;
          if (!newImg.complete & oriImg.complete) {
            t.style.zIndex=5;
          } else if (!newImg.complete & !oriImg.complete) {
            oriImg.onload=e=>{
              if (!newImg.complete && !!newImg.parentElement) t.style.zIndex=5;
            }
          }
        }
        f();
        let observer = new MutationObserver(f);
        observer.observe(t,{ attributeFilter: ['href'] });
      });
      btn2.addEventListener('click', e=>{
        document.querySelectorAll('#image-container img').forEach(img=>img.src+='?');
      });
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}