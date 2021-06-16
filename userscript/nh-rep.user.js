// ==UserScript==
// @name         nh-rep
// @namespace    https://github.com/kou003/
// @version      1.0
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
        let f=e=>t.querySelector('img').src=t.querySelector('img').src.replace(/.*?([^/]*$)/, (_,m)=>url+m);
        f();
        let t=document.querySelector("#image-container");
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