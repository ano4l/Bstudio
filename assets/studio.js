(function(){
  const STORAGE_KEY='bambiStudioAppointmentRequest';
  const tomorrow=()=>{const d=new Date();d.setDate(d.getDate()+1);const pad=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
  const escapeHtml=value=>String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const isPreview=document.body.hasAttribute('data-preview-site')||!window.Shopify;
  const path=(location.pathname.split('/').pop()||'index.html').replace('.html','');
  const assetBase=document.querySelector('link[href*="studio.css"]')?.getAttribute('href')?.startsWith('../')?'../assets/':'assets/';
  const activeMap={index:'home',services:'services',booking:'services',preparation:'preparation',about:'about',contact:'contact',cart:'cart'};

  document.querySelectorAll('[data-appointment-date]').forEach(input=>{input.min=tomorrow()});
  document.querySelectorAll('.site-header .nav a').forEach(link=>{const key=link.dataset.nav||({index:'home',services:'services',preparation:'preparation',about:'about',contact:'contact'}[link.getAttribute('href')?.replace('.html','')]);if(key===activeMap[path])link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')});

  const menu=document.querySelector('[data-menu-toggle]'),nav=document.querySelector('[data-mobile-nav]');
  const closeMenu=()=>{if(!menu||!nav)return;nav.classList.remove('open');menu.setAttribute('aria-expanded','false')};
  if(menu&&nav){menu.setAttribute('aria-label','Open menu');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu')});document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu()});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu))}

  const overlay=document.querySelector('[data-drawer-overlay]'),drawer=document.querySelector('[data-drawer]');
  function closeDrawer(){if(overlay)overlay.hidden=true;if(drawer)drawer.hidden=true;document.body.classList.remove('drawer-open')}
  function openDrawer(){if(overlay)overlay.hidden=false;if(drawer){drawer.hidden=false;drawer.querySelector('[data-drawer-close]')?.focus()}document.body.classList.add('drawer-open')}
  document.querySelectorAll('[data-drawer-close]').forEach(button=>button.addEventListener('click',closeDrawer));if(overlay)overlay.addEventListener('click',closeDrawer);document.addEventListener('keydown',event=>{if(event.key==='Escape')closeDrawer()});

  function getRequest(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null')}catch{return null}}
  function saveRequest(request){localStorage.setItem(STORAGE_KEY,JSON.stringify(request))}
  function propertyRows(properties){return Object.entries(properties).filter(([,value])=>value).map(([key,value])=>`<div><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('')}
  function renderDrawer(request){const summary=document.querySelector('[data-request-summary]');if(!summary)return;summary.innerHTML=`<p class="summary-kicker">Request prepared — not confirmed</p><h3>${escapeHtml(request.title)}</h3><p>Your preferences are saved on this device. The studio must still review availability.</p><dl>${propertyRows(request.properties)}</dl><div class="summary-actions"><a class="text-link" href="booking.html?edit=request">Edit details</a><button class="text-button" type="button" data-clear-request>Clear request</button></div>`;summary.querySelector('[data-clear-request]')?.addEventListener('click',()=>{localStorage.removeItem(STORAGE_KEY);closeDrawer()})}

  document.querySelectorAll('[data-preview-booking]').forEach(form=>{
    const saved=getRequest();if(saved&&new URLSearchParams(location.search).has('edit')){Object.entries(saved.properties).forEach(([key,value])=>{const field=form.querySelector(`[name="properties[${CSS.escape(key)}]"]`);if(!field)return;if(field.type==='checkbox')field.checked=value==='Yes';else field.value=value})}
    form.addEventListener('submit',event=>{
      if(!form.checkValidity()){event.preventDefault();form.reportValidity();return}
      const date=form.querySelector('[name="properties[Appointment date]"]');if(date&&date.value<tomorrow()){event.preventDefault();date.setCustomValidity('Please choose tomorrow or a later date.');date.reportValidity();return}if(date)date.setCustomValidity('');
      if(form.dataset.preview!=='true')return;event.preventDefault();
      const properties={};new FormData(form).forEach((value,key)=>{const match=key.match(/^properties\[(.+)\]$/);if(match&&value)properties[match[1]]=String(value)});
      const request={title:'Signature Frontal Install',status:'Request prepared — not confirmed',savedAt:new Date().toISOString(),properties};saveRequest(request);renderDrawer(request);openDrawer();
    })
  });

  const cartMount=document.querySelector('[data-preview-cart]');if(cartMount){const request=getRequest();if(request){cartMount.innerHTML=`<article class="cart-line"><img src="${assetBase}studio-bob.png" alt="Signature frontal install hairline detail"><div><p class="summary-kicker">Saved appointment request</p><h2>${escapeHtml(request.title)}</h2><dl class="properties property-list">${propertyRows(request.properties)}</dl></div><strong>Price set in Shopify</strong></article><div class="cart-actions"><p>This request is saved on this device but is not a confirmed appointment. Availability and payment requirements still need review.</p><div><a class="button" href="booking.html?edit=request">Edit request <span>→</span></a><button class="button outline" type="button" data-clear-request>Clear request</button></div></div>`}else{cartMount.innerHTML='<div class="empty-state"><p class="eyebrow">Nothing prepared yet</p><h2>Your request is empty.</h2><p>Choose a studio service, then share a preferred date and time.</p><a class="button" href="services.html">View services <span>→</span></a></div>'}cartMount.querySelector('[data-clear-request]')?.addEventListener('click',()=>{localStorage.removeItem(STORAGE_KEY);location.reload()})}

  if(isPreview){
    const serviceImages=['studio-detail.png','studio-bob.png','studio-wave.png','studio-curls.png'];document.querySelectorAll('.service-card:not(:has(.service-thumb))').forEach((card,index)=>{const thumb=document.createElement('span');thumb.className='service-thumb';thumb.innerHTML=`<img src="${assetBase}${serviceImages[index%serviceImages.length]}" alt="">`;card.querySelector('.num')?.after(thumb)});
    document.querySelectorAll('a[href="#"]').forEach(link=>{const span=document.createElement('span');span.className='sister-label';span.textContent='Bambï Beauty — sister store';link.replaceWith(span)});
    if(!document.querySelector('.footer')){document.body.insertAdjacentHTML('beforeend','<footer class="footer" data-preview-footer></footer>')}
    const footer=document.querySelector('.footer');if(footer)footer.innerHTML='<div class="footer-grid"><div><a class="wordmark" href="index.html"><strong>BAMBÏ</strong><small>STUDIO</small></a><p>Installs / Johannesburg<br>The finish is considered.</p></div><div><h3>Studio</h3><a href="services.html">Services</a><a href="preparation.html">Preparation</a><a href="about.html">Our studio</a></div><div><h3>Contact</h3><a href="mailto:bambi.southafrica@gmail.com">bambi.southafrica@gmail.com</a><span>Bambï Beauty — sister store</span></div></div><div class="footer-bottom"><span>© <span data-year></span> Bambï Studio</span><span>Appointment confirmation is subject to availability</span></div>';
  }
  document.querySelectorAll('[data-year]').forEach(element=>element.textContent=new Date().getFullYear());
})();
