javascript:{
  let url=`https://192.168.0.80:55649/${_gallery.id}/`;
  fetch(url,{method:'HEAD'}).then(r=>{
    if (r.ok) {
      let t=document.querySelector("#image-container");
      let f=e=>t.querySelector('img').src=t.querySelector('img').src.replace(/.*?([^/]*$)/, (_,m)=>url+m);
      f();
      let observer = new MutationObserver(f);
      observer.observe(t,{ childList: true, subtree: true });
    }
  })
}