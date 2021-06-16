// ==UserScript==
// @name         nh-rep
// @namespace    https://github.com/kou003/
// @version      1.3
// @description  nh-rep
// @author       kou003
// @match        *://nhentai.net/g/*/*
// @updateURL    https://github.com/kou003/nhentai-util/raw/master/userscript/nh-rep.user.js
// @downloadURL  https://github.com/kou003/nhentai-util/raw/master/userscript/nh-rep.user.js
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
          z-index: 10;
        }
        #rep-image{
          position: relative;
          top: -100%;
          z-index: 0;
        }
        </style>`);
        let t=document.querySelector("#image-container");
        let repImg = new Image();
        repImg.id='rep-image';
        t.append(repImg);
        let f=e=>{
          let img = t.querySelector('a img')
          Object.assign(repImg, img);
          repImg.src=img.src.replace(/.*?([^/]*$)/, (_,m)=>url+m);
        }
        f();
        let observer = new MutationObserver(f);
        observer.observe(t,{ childList: true, subtree: true });
      }
    })
  }
  if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}