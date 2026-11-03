const vm=require('vm'),fs=require('fs'),assert=require('assert/strict');
const source=fs.readFileSync('currency.js','utf8');
function price(amount=5.99,currency='GBP'){return {textContent:'£5.99',attributes:{'data-price-amount':String(amount),'data-price-currency':currency},classList:{toggle(name,value){this[name]=value}},getAttribute(name){return this.attributes[name]},removeAttribute(name){delete this[name]}}}
async function scenario({search='',timezone='Europe/London',languages=['en-GB'],protocol='https:',geo=null,rates=null,cached={},blocked=false}={}){
 const storage=new Map(Object.entries(cached).map(([k,v])=>[k,JSON.stringify(v)]));let requests=[];
 const context={window:{},document:{readyState:'loading',addEventListener(){}},location:{search,protocol},navigator:{languages,language:languages[0]},Intl:{NumberFormat:Intl.NumberFormat,DateTimeFormat:()=>({resolvedOptions:()=>({timeZone:timezone})})},Date,Promise,Math,Object,JSON,Number,String,parseFloat,isNaN,setTimeout:()=>1,clearTimeout(){},localStorage:{getItem(k){if(blocked)throw Error('denied');return storage.get(k)||null},setItem(k,v){if(blocked)throw Error('denied');storage.set(k,v)}},fetch:async url=>{requests.push(url);if(url==='/api/geo'&&geo)return {ok:true,json:async()=>geo};if(url!=='/api/geo'&&rates)return {ok:true,json:async()=>rates};throw Error('offline')}};
 vm.createContext(context);vm.runInContext(source,context);const state=await context.window.TWDCurrency.ready;
 const el=price(),note={hidden:true},root={querySelectorAll:s=>s==='[data-price-amount]'?[el]:[note]};await context.window.TWDCurrency.apply(root);
 return {context,state,el,note,root,requests};
}
(async()=>{
 let s=await scenario({search:'?country=IN',languages:['en-IN']});assert.equal(s.state.currency,'INR');assert(s.el.textContent.startsWith('≈'));assert(s.el.textContent.includes('761'));assert(!s.note.hidden);assert(s.el.title.includes('2026-10-31'));
 // A second apply must always convert the original amount, never the already converted text.
 const once=s.el.textContent;await s.context.window.TWDCurrency.apply(s.root);assert.equal(s.el.textContent,once);
 const newPrice=price();await s.context.window.TWDCurrency.apply({querySelectorAll:q=>q==='[data-price-amount]'?[newPrice]:[]});assert.equal(newPrice.textContent,once);
 s=await scenario();assert.equal(s.el.textContent,'£5.99');assert(s.note.hidden);assert.equal(s.el.title,undefined);
 s=await scenario({geo:{country:'US'},rates:{date:'2026-11-03',usd:{usd:1,gbp:.75,inr:95}},languages:['en-US']});assert.equal(s.state.currency,'USD');assert.equal(s.el.textContent,'≈ $7.99');assert(s.el.title.includes('2026-11-03'));
 s=await scenario({timezone:'Asia/Kolkata',protocol:'file:',blocked:true,languages:['en-IN']});assert.equal(s.state.currency,'INR');assert(s.el.textContent.includes('761'));assert(!s.requests.includes('/api/geo'));
 s=await scenario({search:'?country=ZZ',timezone:'Unknown/Zone'});assert.equal(s.state.currency,null);assert.equal(s.el.textContent,'£5.99');assert(s.note.hidden);
 s=await scenario({timezone:'Unknown/Zone',languages:['en-CA'],cached:{twd_fx:{t:Date.now(),date:'fixture',rates:{GBP:.75,CAD:1.5}}}});assert.equal(s.state.currency,'CAD');assert.equal(s.requests.length,1);assert(s.el.textContent.includes('11.98'));
 console.log('PASS: local currency, base-price retention, live/offline/cached rates, blocked storage, unknown countries and SPA re-entry.');
})().catch(e=>{console.error(e);process.exitCode=1});
