javascript:document.querySelector('nav').append(p=document.createElement('progress'));p.max=(g=_gallery).num_pages;imgs={};img=(url)=>{let m=new Image();m.src=url;m.onload=e=>{p.value+=1;imgs[url]=m};m.onerror=e=>setTimeout(img, 500, m.src)};g.images.pages.map((v,i)=>img(`https://i.nhentai.net/galleries/${g.media_id}/${i+1}.${({'j':'jpg','p':'png','g':'gif','w':'.webp'})[v.t]}`))
