// ==UserScript==
// @name         nh-rep2
// @namespace    https://github.com/kou003/
// @version      1.21
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
        let repImg=window._gallery.images.pages.map((v,i)=>Object.assign(new Image(), {width: v.w, height: v.h, src: url+(1+i)+x[v.t], className: 'rep-image'}));
        c.append(repImg[0]);
        let f=e=>{
          let num=location.pathname.match(/(\d+)\D*$/)[1];
          let oldImg=c.querySelector('.rep-image');
          let newImg=repImg[num-1];
          c.replaceChild(newImg, oldImg);
          let oriImg = t.querySelector('img');
          newImg.style='';
          t.style='';
          newImg.onload=null;
          oriImg.onload=null;
          if (!newImg.complete & oriImg.complete) {
            t.style.zIndex=5;
          } else if (!newImg.complete & !oriImg.complete) {
            newImg.onload=e=>{
              newImg.style.zIndex=10**13-new Date;
            }
            oriImg.onload=e=>{
              t.style.zIndex=10**13-new Date;
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