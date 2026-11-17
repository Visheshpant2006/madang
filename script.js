const MENU={
 featured:[{id:'egg',n:'Boiled egg',d:'With green salad and black salt',p:149,e:'🥚',bg:'#2b3a34'},{id:'cake',n:'Red velvet cake',d:'A slice with fresh strawberry',p:179,e:'🍰',bg:'#3a2b30'},{id:'fries',n:'French Fries',d:'With burger and cold drink',p:199,e:'🍟',bg:'#e9a93b'}],
 cats:[
  {k:'Breakfast',e:'🥣',bg:'linear-gradient(135deg,#6fbf73,#f0b429)',items:[{id:'b1',n:'Quinoa fruit bowl',d:'Kiwi, mango and cranberries',p:189,e:'🥣'},{id:'b2',n:'Pecan muffins',d:'Baked fresh every morning',p:129,e:'🧁'},{id:'b3',n:'Avocado toast',d:'Multigrain, chilli flakes',p:169,e:'🥑'}]},
  {k:'Lunch',e:'🥗',bg:'linear-gradient(135deg,#43a047,#c0ca33)',items:[{id:'l1',n:'Garden salad',d:'Greens, cherry tomato, seeds',p:179,e:'🥗'},{id:'l2',n:'Veg wrap',d:'Whole wheat, hummus',p:159,e:'🌯'},{id:'l3',n:'Brown rice bowl',d:'Paneer and sautéed veggies',p:219,e:'🍚'}]},
  {k:'Dinner',e:'🍲',bg:'linear-gradient(135deg,#ef6c00,#8d6e63)',items:[{id:'d1',n:'Lentil soup',d:'Slow cooked, with herbs',p:149,e:'🍲'},{id:'d2',n:'Grilled veggies',d:'With mint dip',p:199,e:'🍆'},{id:'d3',n:'Millet khichdi',d:'Light and comforting',p:169,e:'🥘'}]},
  {k:'Snacks',e:'🍿',bg:'linear-gradient(135deg,#ab47bc,#ff7043)',items:[{id:'s1',n:'Roasted makhana',d:'Peri-peri flavour',p:99,e:'🍿'},{id:'s2',n:'Fruit chaat',d:'Seasonal fruits, chaat masala',p:119,e:'🍉'}]},
  {k:'Desserts',e:'🍰',bg:'linear-gradient(135deg,#d81b60,#f48fb1)',items:[{id:'x1',n:'Red velvet slice',d:'Cream cheese frosting',p:179,e:'🍰'},{id:'x2',n:'Date &amp; nut ladoo',d:'No refined sugar',p:109,e:'🟤'}]}
 ]};
const $=s=>document.querySelector(s);
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let cart=store.get('m_cart',{}),all={};
MENU.featured.forEach(i=>all[i.id]=i);MENU.cats.forEach(c=>c.items.forEach(i=>all[i.id]=i));
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),2200)};
const dish=(i,bg)=>`<div class="dish"><div class="pic" style="background:${bg||'#e8f5ec'}">${i.e}</div><h4>${i.n}</h4><p>${i.d}</p><div class="row"><b>₹${i.p}</b><button class="add" data-add="${i.id}">+ Add</button></div></div>`;
$('#featured').innerHTML=MENU.featured.map(i=>dish(i,i.bg)).join('');
$('#cats').innerHTML=MENU.cats.map(c=>`<button class="cat" data-cat="${c.k}" style="background:${c.bg}">${c.k}<em>${c.e}</em></button>`).join('');
function showCat(k){const c=MENU.cats.find(x=>x.k===k);document.querySelectorAll('.cat').forEach(b=>b.classList.toggle('on',b.dataset.cat===k));
 $('#catItems').innerHTML=`<h3 style="text-align:center;color:var(--green-d);font-weight:500">${k}</h3><div class="grid">${c.items.map(i=>dish(i)).join('')}</div>`}
showCat('Breakfast');
function renderCart(){const ids=Object.keys(cart);let n=0,t=0;
 $('#cartList').innerHTML=ids.length?ids.map(id=>{const i=all[id],q=cart[id];n+=q;t+=q*i.p;return `<div class="ci"><span>${i.e}</span><span>${i.n}<br><small>₹${i.p}</small></span><button class="q" data-dec="${id}">−</button><b>${q}</b><button class="q" data-inc="${id}">+</button></div>`}).join(''):'<p style="color:var(--mute)">Your cart is empty.</p>';
 $('#total').textContent='₹'+t;const b=$('#badge');b.textContent=n;b.hidden=!n;store.set('m_cart',cart)}
renderCart();
document.addEventListener('click',e=>{const t=e.target;
 if(t.dataset.add){cart[t.dataset.add]=(cart[t.dataset.add]||0)+1;renderCart();toast(all[t.dataset.add].n+' added to cart')}
 if(t.dataset.inc){cart[t.dataset.inc]++;renderCart()}
 if(t.dataset.dec){if(--cart[t.dataset.dec]<=0)delete cart[t.dataset.dec];renderCart()}
 const c=t.closest('.cat');if(c)showCat(c.dataset.cat);
 if(t.dataset.t)toast(t.dataset.t);
 if(t.closest('#menu a'))closeMenu();
});
const closeMenu=()=>{$('#menu').classList.remove('open');$('#burger').setAttribute('aria-expanded','false')};
$('#burger').onclick=()=>{const o=$('#menu').classList.toggle('open');$('#burger').setAttribute('aria-expanded',o)};
const openCart=()=>{$('#drawer').classList.add('open');closeMenu()};
$('#openCart').onclick=openCart;$('#closeCart').onclick=()=>$('#drawer').classList.remove('open');
$('#checkout').onclick=()=>{if(!Object.keys(cart).length)return toast('Your cart is empty');
 if(!session())return toast('Please log in to place your order'),$('#drawer').classList.remove('open'),location.hash='login';
 const orders=store.get('m_orders',[]);orders.push({user:session(),items:cart,at:new Date().toISOString()});store.set('m_orders',orders);
 cart={};renderCart();$('#drawer').classList.remove('open');toast('✅ Order placed! Thank you.')};
$('#themeBtn').onclick=()=>{const r=document.documentElement,d=getComputedStyle(r).getPropertyValue('--bg').trim()==='#15191c';r.dataset.theme=d?'light':'dark';closeMenu()};

/* routing */
function route(){const h=(location.hash||'#home').slice(1);const pages=['home','location','login'];
 const page=pages.includes(h)?h:'home';pages.forEach(p=>$('#'+p).hidden=p!==page);
 if(page==='login')refreshSession();
 if(!pages.includes(h)&&$('#'+h))setTimeout(()=>$('#'+h).scrollIntoView(),0);else window.scrollTo(0,0)}
addEventListener('hashchange',route);

/* auth */
let signup=false;const session=()=>store.get('m_session',null);
function refreshSession(){const s=session();$('#lf').hidden=!!s;$('#session').hidden=!s;if(s)$('#hello').textContent='Welcome back, '+s+'!';$('#navLogin').textContent=s?'Account ('+s+')':'Login'}
$('#swap').onclick=()=>{signup=!signup;$('#lBtn').textContent=signup?'Create account':'Login';$('#swap').textContent=signup?'Already have an account? Login':'New here? Create an account';$('#lErr').textContent=''};
$('#lf').onsubmit=e=>{e.preventDefault();const u=$('#u').value.trim(),p=$('#p').value,users=store.get('m_users',{});
 if(!u||!p)return $('#lErr').textContent='Please enter both user name and password.';
 if(signup){if(p.length<6)return $('#lErr').textContent='Password must be at least 6 characters.';
  if(users[u])return $('#lErr').textContent='That user name is taken.';users[u]=btoa(unescape(encodeURIComponent(p)));store.set('m_users',users);}
 else if(!users[u]||users[u]!==btoa(unescape(encodeURIComponent(p))))return $('#lErr').textContent='Invalid user name or password.';
 store.set('m_session',u);$('#lErr').textContent='';$('#u').value=$('#p').value='';refreshSession();toast('Logged in as '+u)};
$('#logout').onclick=()=>{store.set('m_session',null);refreshSession();toast('Logged out')};

/* feedback */
$('#fb').onsubmit=e=>{e.preventDefault();const v=id=>$('#'+id).value.trim(),err=$('#fbErr');$('#fbOk').textContent='';
 if(!v('fn')||!v('ln'))return err.textContent='Please enter your first and last name.';
 if(v('ct')&&!/^[+\d][\d\s-]{8,14}$/.test(v('ct')))return err.textContent='Enter a valid contact number.';
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('em')))return err.textContent='Enter a valid email address.';
 if(v('msg').length<5)return err.textContent='Please write a few words of feedback.';
 const l=store.get('m_feedback',[]);l.push({fn:v('fn'),ln:v('ln'),ct:v('ct'),em:v('em'),msg:v('msg'),at:Date.now()});store.set('m_feedback',l);
 err.textContent='';e.target.reset();$('#fbOk').textContent='Thank you for your feedback!'};
refreshSession();route();
