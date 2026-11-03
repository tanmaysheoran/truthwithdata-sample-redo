const vm=require('vm'),fs=require('fs'),assert=require('assert/strict');
const roots=[],handlers={};
function el(type){return {type,className:'',style:{},dataset:{},setAttribute(){},classList:{add(){},remove(){}},append(){},remove(){this.removed=true},dispatchEvent(){},getContext(){return null}}}
const ctx={window:{scrollY:0,innerHeight:900,addEventListener(type,fn){handlers[type]=fn}},document:{body:{prepend(node){roots.push(node)}},createElement:el,querySelector:()=>({offsetTop:100,offsetHeight:500})},Float32Array,Math,Event:class{}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('grainient.js','utf8'),ctx);
ctx.window.TWDBackgrounds.mount('home');assert.equal(roots.length,1);assert.equal(roots[0].style.opacity,'1');
ctx.window.scrollY=260;handlers.scroll();assert(Number(roots[0].style.opacity)>0&&Number(roots[0].style.opacity)<1);
ctx.window.scrollY=600;handlers.scroll();assert.equal(roots[0].style.opacity,'0');assert.equal(roots[0].dataset.suspended,'true');
ctx.window.scrollY=0;handlers.scroll();assert.equal(roots[0].style.opacity,'1');assert.equal(roots[0].dataset.suspended,'false');
ctx.window.TWDBackgrounds.mount('tools');assert(roots[0].removed);assert.equal(roots.length,2);
console.log('PASS: full-page fallback, scroll fade, suspended state, return-to-top, and route cleanup.');
