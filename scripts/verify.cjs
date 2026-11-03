const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const noop=()=>{};const el={classList:{toggle:noop,remove:noop},addEventListener:noop};
const ctx={window:{addEventListener:noop},document:{querySelector:()=>el,addEventListener:noop},location:{hash:'#/'},URL,Intl,Date,Number,String,console};
vm.createContext(ctx);for(const f of ['site-config.js','article-content.js'])vm.runInContext(fs.readFileSync(f,'utf8'),ctx);
vm.runInContext(fs.readFileSync('app.js','utf8').replace(/render\(\);\s*$/,''),ctx);
assert.equal(Object.keys(ctx.window.ARTICLE_CONTENT).length,8);
for(const [key,body] of Object.entries(ctx.window.ARTICLE_CONTENT)){assert(body.words>500,key);assert(body.toc.length>=4,key);assert(!/<script\b/i.test(body.html.replace(/<!--[\s\S]*?-->/g,'')),key);const [kind,id]=key.split('/');const rendered=vm.runInContext(`${kind==='article'?'article':'projectPage'}(${id})`,ctx);assert(rendered.includes(body.html));assert(!rendered.includes('Read the full analysis'));assert(!rendered.includes('Abridged'));for(const item of body.toc)assert(body.html.includes(`id="${item.id}"`),item.id);}
for(const id of [1,2,5,6,7,8,9,10,11]){ctx.location.hash='#/tools/'+id;const html=vm.runInContext('tools()',ctx);assert(html.includes(`href="#/tools/${id}" aria-current="page"`));assert(html.includes('tool-workspace'));const frame=html.match(/src="(assets\/tools\/[^\"]+)"/);if(frame)assert(fs.existsSync(frame[1]));}
assert.equal(ctx.window.sampleSize(1.959963984540054,5,50,null),385);
assert.equal(ctx.window.sampleSize(1.959963984540054,5,50,1000),278);
assert.equal(ctx.window.sampleSize(1.96,0,50,null),null);
assert.equal(ctx.window.sampleSize(1.96,5,50,1.5),null);
assert.equal(ctx.window.calculateROI(10000,12500).roi,25);
assert.equal(ctx.window.calculateROI(100,0).roi,-100);
assert.equal(ctx.window.calculateROI(0,10),null);
for(const name of ['home','insights','work','resources','services','consultancy','calculator'])assert(vm.runInContext(`${name}()`,ctx).length>500);
assert(!vm.runInContext('work()',ctx).includes('not commissioned'));
console.log('PASS: 8 full imports, contents anchors, 9 tool selections, iframe assets, 6 main pages, sample-size and ROI cases.');

for(const file of fs.readdirSync('assets/tools').filter(f=>f.endsWith('.html'))){const html=fs.readFileSync('assets/tools/'+file,'utf8');const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];const resize=scripts.map(m=>m[1]).find(code=>code.includes('lastSentHeight'));assert(resize,file);let height=600;const messages=[];const resizeContext={document:{body:{getBoundingClientRect:()=>({height})}},parent:{postMessage:msg=>messages.push(msg)},window:{addEventListener:noop},Math};vm.createContext(resizeContext);vm.runInContext(resize,resizeContext);for(let i=0;i<20;i++)vm.runInContext('notifyHeight()',resizeContext);assert.equal(messages.length,1,file);assert.equal(messages[0].height,600);height=820;vm.runInContext('notifyHeight()',resizeContext);assert.equal(messages.length,2);assert.equal(messages[1].height,820);}
console.log('PASS: all 7 frame reporters ignore unchanged content heights and report real content changes.');

const serviceHTML=vm.runInContext('services()',ctx),homeHTML=vm.runInContext('home()',ctx),resourceHTML=vm.runInContext('resources()',ctx);
for(const service of ctx.window.SITE_CONFIG.services){const escapedTitle=service.title.replace(/&/g,'&amp;');assert(homeHTML.includes(escapedTitle));assert(serviceHTML.includes(escapedTitle));for(const feature of service.features)assert(serviceHTML.includes(feature));if(service.transparency)assert(serviceHTML.includes(vm.runInContext('esc('+JSON.stringify(service.transparency.message)+')',ctx)));}
assert(fs.readFileSync('index.html','utf8').includes('href="#/services">Services'));
assert(resourceHTML.includes('data-price-amount="5.99"'));assert(resourceHTML.includes('data-price-note hidden'));assert(resourceHTML.includes('mailto:truthwithdata@gmail.com?subject=Buying%3A%20Prompt'));assert(resourceHTML.includes('https://truthwithdata.com/tools/rent-vs-buy-calculator.html#report'));
assert(!resourceHTML.includes('Data Analysis Fundamentals'));
assert(vm.runInContext("priceHTML('Free')",ctx)==='Free');assert(vm.runInContext("checkoutHref({title:'Book',checkoutUrl:'https://example.com/pay'})",ctx)==='https://example.com/pay');
console.log('PASS: services navigation, homepage brief, full service data, currency markup and purchase/preview routing.');
