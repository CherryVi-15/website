
const assets=JSON.parse(document.querySelector('#asset-data').textContent)
const icons={search:'<circle cx="10" cy="10" r="5.5"/><path d="m14 14 5 5m0-16v5m-2.5-2.5h5"/>',user:'<path d="m5 12 1-8 5 4h2l5-4 1 8c1 5-2 7-7 7s-8-2-7-7Z"/><path d="M9 13h.1m5.8 0h.1m-4 2 1 1 1-1"/>',bag:'<path d="M4 8h16l1 13H3zM8 9V7a4 4 0 1 1 8 0v2"/><path d="M12 17c-6-4-1-6 0-3 1-3 6-1 0 3Z"/>',prev:'<path d="m15 5-7 7 7 7"/>',next:'<path d="m9 5 7 7-7 7"/>'}
const icon=name=>'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">'+icons[name]+'</svg>'
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon))
document.querySelector('.ticker').innerHTML='<span>✦ &nbsp; IF YOU ARE AN INDORI THIS BRAND IS FOR YOU! &nbsp; ✦ &nbsp; GOOD VIBES. GOOD CHAI. &nbsp; ✦ &nbsp; TEA, COFFEE, CATS AND YOU. &nbsp; </span>'.repeat(8)
const products=[
 {id:'karak',name:'Karak',type:'Tea',flavor:'Masala chai',description:'A bold cup of spiced chai with a warm, fragrant finish.'},
 {id:'sufi',name:'Sufi',type:'Tea',flavor:'Rose chai',description:'A gently floral chai with soft rose notes.'},
 {id:'zinty',name:'Zinty',type:'Tea',flavor:'Adrak chai',description:'Ginger-forward chai with a bright, warming kick.'},
 {id:'koka',name:'Koka',type:'Tea',flavor:'Chocolate chai',description:'Mellow chocolate notes folded into a cozy cup of chai.'},
 {id:'hazelnut',name:'Natkhat',type:'Coffee',flavor:'Hazelnut coffee',description:'Mellow coffee with a rounded, nutty hazelnut finish.'},
 {id:'vanilla',name:'Vanni',type:'Coffee',flavor:'Vanilla coffee',description:'Smooth coffee with a soft vanilla aroma.'},
 {id:'caff',name:'Caff',type:'Coffee',flavor:'Classic coffee',description:'A regular instant coffee for your everyday cup.'},
 {id:'esra',name:'Esra',type:'Coffee',flavor:'Black coffee',description:'A bold, espresso-style instant black coffee.'}
]
const cupSize='250 ml'
const packPrices={2:70,5:150,10:249}
const deliveryFee=20
const packs=Object.keys(packPrices).map(Number)
const main=document.querySelector('main')
const money=new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:0,maximumFractionDigits:2})
const find=id=>products.find(p=>p.id===id)
const allowed=(item)=>item&&find(item.id)&&item.size===cupSize&&packs.includes(item.pack)&&Number.isInteger(item.qty)&&item.qty>0&&item.qty<=99
let cart=[]
try{const saved=JSON.parse(localStorage.getItem('izih-cart-v1'));if(Array.isArray(saved))cart=saved.filter(allowed)}catch{}
let shipping=null
const unit=pack=>packPrices[pack]
const subtotal=()=>cart.reduce((sum,x)=>sum+unit(x.pack)*x.qty,0)
const save=()=>{try{localStorage.setItem('izih-cart-v1',JSON.stringify(cart))}catch{}document.querySelector('#count').textContent=cart.reduce((sum,x)=>sum+x.qty,0)}
save()
const img=(key,alt,cl='',eager=false)=>'<img class="'+cl+'" src="'+assets[key]+'" alt="'+alt+'" '+(eager?'fetchpriority="high"':'loading="lazy"')+'>'
const button=(label,link,style='')=>'<a class="btn '+style+'" href="#'+link+'">'+label+'</a>'
const heading=(title,description='')=>'<section class="subhead"><div class="wrap"><h1>'+title+'</h1>'+(description?'<p>'+description+'</p>':'')+'</div></section>'
const cat=(pose='sleep',cl='')=>`<svg class="${cl}" viewBox="0 0 240 154" aria-hidden="true"><ellipse cx="120" cy="130" rx="92" ry="9" fill="#8b4146" opacity=".17"/><path d="M35 111Q3 98 24 71" fill="none" stroke="#281719" stroke-width="12" stroke-linecap="round"/><ellipse cx="105" cy="103" rx="72" ry="30" fill="#281719"/><path d="M79 72Q74 45 86 23q4-5 36 28 19-5 36 0 29-33 35-27 11 20 6 47 15 47-60 49-73-1-60-48Z" fill="#281719"/><path d="M87 36l8 22 16-6m75-16-9 22-15-6" fill="#e18688"/>${pose==='peek'?'<ellipse cx="113" cy="80" rx="8" ry="10" fill="#eec071"/><ellipse cx="162" cy="80" rx="8" ry="10" fill="#eec071"/><path d="M113 74v12m49-12v12" stroke="#281719" stroke-width="3"/>':'<path d="M101 81q10 10 21 0m28 0q11 10 21 0" fill="none" stroke="#f5c5a7" stroke-width="2" stroke-linecap="round"/>'}<path d="m133 90 8 0-4 4Z" fill="#ed8891"/><path d="M93 92l-20-4m19 10-22 2m108-9 23-4m-22 11 23 3" stroke="#8e6864" stroke-width="1.5"/><ellipse cx="99" cy="118" rx="21" ry="9" fill="#281719"/><ellipse cx="175" cy="118" rx="20" ry="9" fill="#281719"/>${pose==='tea'?'<path d="M180 103h36l-4 22q-14 10-28 0Z" fill="#a74350"/><path d="M214 108q17-4 8 10l-9 1m-16-25q-7-7 0-13" fill="none" stroke="#a74350" stroke-width="3" stroke-linecap="round"/>':''}</svg>`
const fan=(filter)=>`<svg class="fan" viewBox="0 0 310 150" role="img" aria-label="Three illustrated IZIH cups in a fan">${[-25,0,25].map((a,i)=>`<g transform="translate(${79+i*76} 76) rotate(${a})"><path d="M-35-45h70l-9 88h-52Z" fill="${['#f3a4a0','#f7c1a0','#e98e92'][i]}" stroke="#6d2025" stroke-width="2"/><rect x="-39" y="-49" width="78" height="11" rx="4" fill="#381b1b"/><text x="0" y="-8" text-anchor="middle" fill="#381b1b" font-family="Georgia" font-size="22">IZIH</text><text x="0" y="1" text-anchor="middle" fill="#381b1b" font-family="Arial" font-size="4">${filter==='coffee'?'INSTANT COFFEE':'INSTANT TEA'}</text><path d="M-12 16v-13l8 7h8l8-7v13q0 11-12 11t-12-11" fill="#381b1b"/></g>`).join('')}</svg>`
const packOptions=()=>packs.map(pack=>'<option value="'+pack+'">Pack of '+pack+' · '+money.format(unit(pack))+' ('+money.format(unit(pack)/pack)+'/cup)</option>').join('')
const card=p=>`<article class="card"><a href="#product/${p.id}" aria-label="View ${p.name}">${img(p.id,'IZIH '+p.flavor+' product mockup')}</a><div class="card-body"><h3>${p.name}</h3><p class="small">${p.flavor}</p><p class="small">${cupSize} per cup</p><form class="card-pack" data-pack-form data-id="${p.id}"><label>Choose a pack<select name="pack">${packOptions()}</select></label><button class="btn">Add to cart</button><div class="status small" role="status"></div></form></div></article>`
const story=()=>`<div class="split story-typography">${img('story','IZIH gift box and chai sachets','story-img')}<div><p class="eyebrow">The IZIH story</p><h2>A little chai,<br>a lot of love.</h2><p>IZIH is made for lazy people. Our cat taught us to do less and live more. She takes her naps seriously, and we think she’s onto something. Make a cup and take life easy.</p>${button('About IZIH','about')}</div></div>`
const home=()=>`<section class="hero"><div class="hero-copy"><p class="eyebrow">IZIH instant tea &amp; coffee</p><h1>Good vibes.<br><em>Good chai.</em></h1><p>Cozy chai and mellow coffee for your favorite little pause.</p>${button('Shop the cups','shop')}</div>${img('hero','IZIH takeaway cup, chai sachets and gift box','hero-photo',true)}${cat('peek','peek')}</section>
<section class="wrap section"><h2 class="section-title">Find your cup</h2><div class="categories"><a class="category" href="#shop/cup/tea">${img('tea','IZIH instant tea cup, gift box and four chai sachets')}<div><h3>Tea</h3><p>Explore chai flavors</p></div></a><a class="category" href="#shop/cup/coffee">${img('caff','IZIH Caff instant coffee cup')}<div><h3>Coffee</h3><p>Explore coffee flavors</p></div></a></div></section>
<section class="wrap section" style="padding-top:0"><div class="section-head"><h2>Bestsellers</h2><div class="carousel-controls"><button class="pill" aria-label="Previous products" data-slide="-1">${icon('prev')}</button><button class="pill" aria-label="Next products" data-slide="1">${icon('next')}</button></div></div><div class="carousel" tabindex="0" aria-label="Bestselling flavors">${products.map(card).join('')}</div></section>
<section class="section quote"><div class="wrap"><blockquote>“A little chai, a lot of love.”</blockquote><p>IZIH</p></div></section>
<section class="wrap section"><h2 class="section-title">Meet the IZIH cat</h2><div class="gallery">${[['peek','On the lookout'],['sleep','Dozing off'],['tea','Taking a chai break']].map(([p,t])=>'<figure>'+cat(p)+'<figcaption>'+t+'</figcaption></figure>').join('')}</div></section>
<section class="wrap section" style="padding-top:0">${story()}</section><section class="final-cta section"><div class="wrap"><h2>Time for a cup?</h2>${button('Shop IZIH','shop','light')}</div></section>`
const selection=(title,href,active)=>`<a class="pill" href="#${href}" ${active?'aria-current="true" style="background:var(--red);color:var(--cream)"':''}>${title}</a>`
const formatPhotos={"premix":{"tea":["teaPremix","Four IZIH tea premix jars"],"coffee":["coffeePremix","IZIH hazelnut and vanilla coffee premix jars"]},"concentrates":{"tea":["teaConcentrates","Four IZIH tea concentrate bottles"],"coffee":["coffeeConcentrates","Four IZIH coffee concentrate bottles"]}}
function shop(format,filter){
 format=['cup','premix','concentrates'].includes(format)?format:'cup'
 filter=filter==='coffee'?'coffee':'tea'
 return '<section class="shop-banner '+filter+'"><div class="wrap"><div><p class="eyebrow">The IZIH shop</p><h1>'+(filter==='coffee'?'Coffee, please.':'Chai, anyone?')+'</h1><p>'+(filter==='coffee'?'Classic, black, or a little something sweeter.':'Masala, ginger, rose, and chocolate chai.')+'</p></div>'+fan(filter)+'</div></section>'+`<section class="wrap section"><div class="shop-intro"><div><div class="filters" aria-label="Format">${[['cup','Cup'],['premix','Premix'],['concentrates','Concentrates']].map(([id,title])=>selection(title,'shop/'+id+'/'+filter,format===id)).join('')}</div><div class="filters" aria-label="Category">${[['tea','Tea'],['coffee','Coffee']].map(([id,title])=>selection(title,'shop/'+format+'/'+id,filter===id)).join('')}</div></div></div>${format==='cup'?'<div class="grid">'+products.filter(p=>p.type.toLowerCase()===filter).map(card).join('')+'</div>':'<div class="coming format-preview">'+img(...formatPhotos[format][filter],'format-photo')+cat()+'<h2>'+(format==='premix'?'Premix':'Concentrates')+' coming soon</h2>'+button('Shop cups','shop/cup/'+filter)+'</div>'}</section>`
}
function product(p){
 if(!p)return missing()
 return `<section class="wrap section split"><div>${img(p.id,'IZIH '+p.flavor+' mockup','detail-img')}</div><div><p><a href="#shop/cup/${p.type.toLowerCase()}">Shop ${p.type.toLowerCase()}</a></p><p class="eyebrow">${p.flavor}</p><h1>${p.name}</h1><p style="margin-top:1rem">${p.description}</p><p class="small">250 ml per cup</p><form class="form panel" id="product-form" data-pack-form data-id="${p.id}"><label>Pack<select name="pack">${packOptions()}</select></label><strong id="price">${money.format(unit(packs[0]))}</strong><button class="btn">Add to cart</button><p class="status" id="added" role="status"></p></form></div></section>`
}
const search=()=>heading('Search')+`<section class="wrap section"><input id="query" class="searchbar" type="search" aria-label="Search flavors, categories and descriptions" placeholder="Try rose, coffee, or ginger"><p id="result-count" class="status" role="status"></p><div id="results" class="grid"></div></section>`
function searchResults(value){
 const words=value.toLowerCase().trim().split(/\s+/).filter(Boolean)
 const matches=products.filter(p=>words.every(w=>[p.name,p.type,p.flavor,p.description].join(' ').toLowerCase().includes(w)))
 document.querySelector('#result-count').textContent=matches.length?matches.length+' '+(matches.length===1?'flavor':'flavors'):'No flavors found. Try a different search.'
 document.querySelector('#results').innerHTML=matches.map(card).join('')
}
const totals=()=>`<div class="summary-line"><strong>Subtotal</strong><strong>${money.format(subtotal())}</strong></div><div class="summary-line"><span>GST (18%)</span><span>Included in product prices</span></div><div class="summary-line"><span>Indore delivery</span><span>${money.format(cart.length?deliveryFee:0)}</span></div><div class="summary-line"><strong>Order total</strong><strong>${money.format(subtotal()+(cart.length?deliveryFee:0))}</strong></div>`
let lastPin=''
let pendingPack=null
const eligiblePin=pin=>/^452\d{3}$/.test(pin)
const pinDialog='<dialog class="panel pin-dialog" aria-labelledby="pin-title"><form class="form" id="add-pin"><h3 id="pin-title">Check your Indore PIN</h3><label>Delivery PIN<input name="pin" inputmode="numeric" autocomplete="postal-code" pattern="[0-9]{6}" maxlength="6" required autofocus></label><p class="small" role="status"></p><div class="checkout-actions"><button class="pill" type="button" data-close-pin>Cancel</button><button class="btn">Check PIN</button></div></form></dialog>'
const emptyCart=()=>`<div class="empty-cart"><div class="empty-cart-art" aria-hidden="true"><span class="cart-sparkle">✦</span><span class="cart-heart">♡</span>${cat('peek','empty-cart-cat')}<svg class="empty-cart-basket" viewBox="0 0 230 75" fill="none"><path d="M17 12h196l-18 53H35Z" fill="#ad5157" stroke="#6d2025" stroke-width="2"/><path d="M36 25h158M41 39h148M46 53h138M62 13l9 51m24-51 4 51m36-51-4 51m37-51-9 51" stroke="#f5b7a5" stroke-width="2" opacity=".8"/><rect x="10" y="6" width="210" height="13" rx="6.5" fill="#6d2025"/></svg></div><h2>Your cart is empty</h2><p>Our cat’s keeping it warm. Pick a chai or coffee to share the spot.</p>${button('Find your cup','shop')}</div>`
function cartView(){
 return heading('Your cart')+`<section class="wrap section cart-layout"><div class="panel">${cart.length?cat('peek','cart-cat')+'<h2>Your cups</h2>'+cart.map((x,i)=>{const p=find(x.id);return `<article class="cart-item">${img(p.id,p.name)}<div><h3>${p.name}</h3><p class="small">${x.size} · Pack of ${x.pack}</p><div class="row"><button class="pill" aria-label="Decrease ${p.name} quantity" data-cart="${i}" data-change="-1" ${x.qty===1?'disabled':''}>−</button><span>${x.qty}</span><button class="pill" aria-label="Increase ${p.name} quantity" data-cart="${i}" data-change="1" ${x.qty===99?'disabled':''}>+</button><button class="text-button" data-cart="${i}" data-change="remove">Remove</button></div></div><strong>${money.format(unit(x.pack)*x.qty)}</strong></article>`}).join(''):emptyCart()}</div><div class="panel"><h3>Order summary</h3>${totals()}${lastPin?'<p class="small">Indore PIN checked: '+lastPin+'</p>':''}${cart.length?button('Proceed to checkout','checkout'):''}</div></section>`
}
function checkout(){
 if(!cart.length)return cartView()
 const fields=[['name','Full name','name','text'],['email','Email','email','email'],['phone','Phone','tel','tel'],['address','Street address','street-address','text'],['city','City','off','text','Indore'],['state','State','off','text','Madhya Pradesh'],['pin','PIN code','postal-code','text']]
 return `<section class="checkout-banner"><div class="wrap"><div><h1>Checkout</h1><p>Where should we bring your cups?</p></div>${cat('tea','checkout-cat')}</div></section><section class="wrap section cart-layout checkout-layout"><form class="panel form" id="shipping"><h2>Shipping details</h2><p class="small guest-checkout-note">Guest checkout. We’ll send your order confirmation to this email after payment.</p>${fields.map(([id,label,auto,type,fixed])=>`<label>${label}<input name="${id}" type="${type}" autocomplete="${auto}" ${fixed?'readonly value="'+fixed+'"':''} ${id==='pin'?'inputmode="numeric" pattern="[0-9]{6}" maxlength="6"':''} required></label>`).join('')}<p class="small" id="shipping-pin-status" role="status"></p><div class="checkout-actions">${button('Back to cart','cart')}<button class="btn" type="submit">Pay now</button></div></form><div class="panel"><h3>Order summary</h3>${totals()}</div></section>`
}
const payment=()=>heading('Payment')+`<section class="wrap section narrow"><div class="panel"><h3>${paymentConfirmed?'Payment confirmed':'Payment status pending'}</h3><p role="status">${paymentMessage}</p>${button(paymentConfirmed?'Back to shop':'Back to checkout',paymentConfirmed?'shop':'checkout')}</div></section>`
const about=()=>heading('About IZIH')+`<section class="wrap section split story-typography">${img('story','IZIH instant tea collection','story-img')}<div><p class="eyebrow">The story behind IZIH</p><h2>Do less. Live more.</h2><p>Izih is my cat. I love her, and her name has always meant something special to me. She’s taught me to do less, live more, and let a little stress go.</p><p>I love a cup of tea, but making it and washing the utensils several times a day felt like a chore. Some days I’d skip the cup altogether. I wanted something easy that would save me time and still let me enjoy my tea. That’s how IZIH came to life.</p><p>This brand will always have a place in my heart. It’s dedicated to Izih, my lovely, lazy black cat.</p>${cat('tea','cart-cat')}${button('Explore the flavors','shop')}</div></section>`
const contact=()=>'<section class="subhead contact-banner"><div class="wrap"><h1>Contact</h1><span aria-hidden="true">✦</span></div></section>'+`<section class="wrap section split contact-section"><div class="contact-note">${cat('tea','contact-cat')}<h2>Come say <em>meow.</em></h2><p>A cup question, a flavor wish, or a little hello? Pull up a chair and leave us a note.</p><a class="btn instagram-button" href="https://www.instagram.com/izih.in/" target="_blank" rel="noopener noreferrer"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.6h.01" stroke-width="2.6"/></svg>Instagram · @izih.in</a></div><form class="form panel" id="contact-form"><h3>A little note for IZIH</h3><label>Your name<input name="name" autocomplete="name" required></label><label>Email<input name="email" type="email" autocomplete="email" required></label><label>Message<textarea name="message" rows="5" required></textarea></label><button class="btn">Preview message</button><p id="contact-result" class="status" role="status"></p></form></section>`
const faqs=()=>heading('FAQs')+`<section class="wrap section narrow faq">${[
 ['What flavors can I browse?','The Cup shop features Karak masala chai, Sufi rose chai, Zinty adrak chai, Koka chocolate chai, plus Caff classic coffee, Esra black coffee, Natkhat hazelnut coffee, and Vanni vanilla coffee.'],
 ['When can I order Premix or Concentrates?','Both formats are coming soon.'],
 ['How do I check my delivery PIN?','Select Add to cart and enter your six-digit PIN. The storefront checks for the Indore city prefix.'],
 ['Can I place an order here?','You can try the cart and shipping form. Payments and order processing are pending setup.'],
 ['Where can I find the refund policy?','See the Refund & Policies page for its current status.']
 ].map(([q,a])=>'<details><summary>'+q+'</summary><p>'+a+'</p></details>').join('')}</section>`
const policy=()=>heading('Refund &amp; Policies')+`<section class="wrap section narrow"><div class="panel"><h3>Policy details pending</h3><p style="margin-top:1rem">Published refund, cancellation, delivery and privacy terms are pending. This preview does not place orders or charge customers.</p>${button('Contact IZIH','contact')}</div></section>`
const missing=()=>heading('Page unavailable')+`<section class="wrap section">${button('Back to home','home')}</section>`
function render(reset=true){
 const [route='home',a,b]=(location.hash.slice(1)||'home').split('/')
 const views={home,shop:()=>shop(a,b),product:()=>product(find(a)),search,cart:cartView,checkout,payment,about,contact,faqs,policies:policy}
 main.innerHTML=(Object.hasOwn(views,route)?views[route]:missing)()+pinDialog
 document.querySelectorAll('nav a').forEach(link=>{if(link.hash==='#'+(route==='product'?'shop':route))link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')})
 if(route==='search')searchResults('')
 if(route==='checkout'){const form=document.querySelector('#shipping');if(form){form.elements.namedItem('pin').value=lastPin;if(shipping)for(const [name,value] of Object.entries(shipping))form.elements.namedItem(name).value=value}}
 if(reset){main.focus({preventScroll:true});window.scrollTo(0,0)}
}
document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();main.focus();main.scrollIntoView()})
window.addEventListener('hashchange',()=>render())
main.addEventListener('click',event=>{
 if(event.target.closest('[data-close-pin]')){pendingPack=null;document.querySelector('.pin-dialog').close();return}
 const slide=event.target.closest('[data-slide]')
 if(slide){const strip=document.querySelector('.carousel');const first=strip.firstElementChild;const distance=first.getBoundingClientRect().width+parseFloat(getComputedStyle(strip).columnGap);strip.scrollBy({left:Number(slide.dataset.slide)*distance,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
 const control=event.target.closest('[data-cart]')
 if(control){const i=Number(control.dataset.cart);const item=cart[i];const change=control.dataset.change;if(change==='remove')cart.splice(i,1);else item.qty=Math.max(1,Math.min(99,item.qty+Number(change)));save();render(false);const next=main.querySelector('[data-cart="'+i+'"][data-change="'+change+'"]:enabled');(next||main).focus({preventScroll:true})}
})
main.addEventListener('input',event=>{if(event.target.id==='query')searchResults(event.target.value)})
main.addEventListener('change',event=>{
 const form=event.target.closest('#product-form')
 if(form){const data=new FormData(form);document.querySelector('#price').textContent=money.format(unit(Number(data.get('pack'))))}
})
main.addEventListener('submit',event=>{
 event.preventDefault()
 const form=event.target
 const data=new FormData(form)
 if(form.dataset.id&&find(form.dataset.id)&&packs.includes(Number(data.get('pack')))){
  pendingPack={id:form.dataset.id,size:cupSize,pack:Number(data.get('pack')),qty:1}
  const dialog=document.querySelector('.pin-dialog')
  dialog.querySelector('input').value=lastPin
  dialog.querySelector('[role=status]').textContent=''
  form.querySelector('[role=status]').textContent=''
  dialog.showModal()
  return
 }
 if(form.id==='add-pin'&&pendingPack){
  const pin=data.get('pin')
  const output=form.querySelector('[role=status]')
  if(!eligiblePin(pin)){output.textContent='This PIN does not match the Indore city prefix (452).';return}
  const item=pendingPack
  const existing=cart.find(x=>x.id===item.id&&x.size===item.size&&x.pack===item.pack)
  if(existing&&existing.qty>=99){output.textContent='This selection has reached 99 packs.';return}
  if(existing)existing.qty++;else cart.push(item)
  lastPin=pin;pendingPack=null;save()
  form.innerHTML='<h3 id="pin-title">Added to cart successfully</h3><p>Your PIN qualifies under the Indore city prefix check.</p><div class="checkout-actions"><button type="button" class="pill" data-close-pin>Keep shopping</button><a class="btn" href="#cart">Go to cart</a></div>'
  form.querySelector('a').focus()
  document.querySelector('.pin-dialog').addEventListener('close',event=>{event.currentTarget.outerHTML=pinDialog},{once:true})
 }
 if(form.id==='shipping'){startCheckout(form,data);return}
  if(form.id==='contact-form'){
  const output=document.querySelector('#contact-result')
  output.textContent='From '+data.get('name')+' ('+data.get('email')+')'+String.fromCharCode(10)+data.get('message')+String.fromCharCode(10,10)+'Contact form delivery awaits setup.'
  output.style.whiteSpace='pre-wrap'
 }
})

let checkoutAttempt
let paymentConfirmed=false
let paymentMessage='Return to checkout to start a payment.'
async function postCheckout(path,payload){
 const response=await fetch('/api/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
 const data=await response.json().catch(()=>null)
 if(response.status===404||response.status===405||!data)throw new Error('The checkout API is unavailable. Check that Vercel deployed the api/ folder.')
 if(!response.ok)throw new Error(data.error||'Checkout is temporarily unavailable.')
 return data
}
function paymentResult(id,paid){
 paymentConfirmed=paid
 paymentMessage=paid?'Your order reference is '+id+'.':'Payment verification is pending. Keep your order reference '+id+' for support.'
 if(paid){cart=[];shipping=null;checkoutAttempt=null;save()}
 if(location.hash==='#payment')render()
 else location.hash='payment'
}
let razorpayLoad
function loadRazorpay(){
 if(typeof window.Razorpay==='function')return Promise.resolve(window.Razorpay)
 return razorpayLoad ??= new Promise((resolve,reject)=>{
  const script=document.createElement('script')
  script.src='https://checkout.razorpay.com/v1/checkout.js'
  const fail=()=>{clearTimeout(timer);script.remove();razorpayLoad=null;reject(new Error('Razorpay could not load. Try again or check whether your browser blocks checkout scripts.'))}
  const timer=setTimeout(fail,10000)
  script.onerror=fail
  script.onload=()=>{
   if(typeof window.Razorpay!=='function'){fail();return}
   clearTimeout(timer)
   resolve(window.Razorpay)
  }
  document.head.append(script)
 })
}
main.addEventListener('invalid',event=>{
 if(event.target.form?.id==='shipping'){
  document.querySelector('#shipping-pin-status').textContent='Please fill in the highlighted shipping field.'
 }
},true)
async function startCheckout(form,data){
 const output=form.querySelector('#shipping-pin-status')
 const pin=data.get('pin')
 if(!eligiblePin(pin)){output.textContent='Enter a PIN that matches the Indore city prefix (452).';return}
 if(location.protocol==='file:'||!globalThis.crypto?.randomUUID){output.textContent='Open the deployed HTTPS storefront to use online checkout.';return}
 lastPin=pin
 shipping={...Object.fromEntries(data),city:'Indore',state:'Madhya Pradesh'}
 const items=cart.map(({id,pack,qty})=>({id,pack,qty}))
 const fingerprint=JSON.stringify({shipping,items})
 if(checkoutAttempt?.fingerprint!==fingerprint)checkoutAttempt={id:crypto.randomUUID(),fingerprint}
 const id=checkoutAttempt.id
 const pay=form.querySelector('button[type=submit],button:not([type])')
 if(pay.disabled)return
 pay.disabled=true
 output.textContent='Preparing your order…'
 const unlock=()=>{pay.disabled=false}
 try{
  const order=await postCheckout('orders',{id,shipping,items})
  if(order.paid){paymentResult(id,true);unlock();return}
  if(location.hash!=='#checkout'||!form.isConnected){unlock();return}
  const Razorpay=await loadRazorpay()
  if(!form.isConnected){unlock();return}
  const widget=new Razorpay({
   key:order.key,order_id:order.gatewayOrder,amount:order.amount,currency:'INR',name:'IZIH',
   prefill:{name:shipping.name,email:shipping.email,contact:shipping.phone},
   theme:{color:'#6d2025'},
   modal:{ondismiss:()=>{unlock();output.textContent='Payment window closed. You can try again.'}},
   handler:async result=>{
    try{const confirmation=await postCheckout('payment-confirm',result);paymentResult(id,confirmation.paid===true)}
    catch{paymentResult(id,false)}
    finally{unlock()}
   }
  })
  widget.on('payment.failed',()=>{output.textContent='Payment was unsuccessful. Retry in the payment window.'})
  output.textContent=''
  widget.open()
 }catch(error){unlock();output.textContent=error.message}
}

try{sessionStorage.removeItem('izih-account-v1')}catch{}
render(false)
