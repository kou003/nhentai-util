// ==UserScript==
// @name         nh-rep2
// @namespace    https://github.com/kou003/
// @version      1.3
// @description  nh-rep2
// @author       kou003
// @match        *://nhentai.net/g/*/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-rep2.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-rep2.user.js
// @grant        none
// @run-at       document-start
// ==/UserScript==

{
  'use strict';
  const main = () => {
    let url=`https://192.168.0.80:55649/${_gallery.id}/`;
    fetch(url,{method:'HEAD'}).then(r=>{
      if (r.ok) {
        document.head.insertAdjacentHTML('beforeend',`<style>
        .alert{
          display:none
        }
        #image-container{
          position: relative;
          overflow-y: hidden !important;
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
        document.querySelector('nav').append(p);
        let repImg=window._gallery.images.pages.map((v,i)=>{
          let img=new Image();
          img.addEventListener('load', e=>p.value+=1);
          let prop = {width: v.w, height: v.h, src: url+(1+i)+x[v.t], className: 'rep-image'}
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
      }
    })
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}