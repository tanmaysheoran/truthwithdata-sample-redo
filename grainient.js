/* Grainient background adaptation for the static Truth with Data site.
 * Based on the React Bits Grainient source supplied by the user:
 * https://reactbits.dev/c/backgrounds/grainient
 * React lifecycle replaced with explicit mount/dispose; shared brand palette.
 */
(() => {
  'use strict';
  const PALETTE = ['#ffffff', '#eef3ff', '#bdd0ff', '#2055eb', '#e4edff'];
  const PRESETS = {
    home: { angle: 55, flow: .75, speed: .7, variation: 0 },
    insights: { angle: 115, flow: .55, speed: .55, variation: 1 },
    work: { angle: 35, flow: .8, speed: .6, variation: 2 },
    tools: { angle: 145, flow: .45, speed: .45, variation: 3 },
    calculator: { angle: 145, flow: .45, speed: .45, variation: 3 },
    resources: { angle: 75, flow: .6, speed: .55, variation: 4 },
    services: { angle: 125, flow: .7, speed: .5, variation: 5 },
    consultancy: { angle: 125, flow: .7, speed: .5, variation: 5 },
    article: { angle: 65, flow: .4, speed: .4, variation: 6 },
    project: { angle: 105, flow: .5, speed: .45, variation: 7 }
  };
  const VERTEX = `#version 300 es
out vec2 vUv;
void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));vUv=p;gl_Position=vec4(p*2.0-1.0,0.0,1.0);}`;
  const FIELD = `#version 300 es
precision highp float;
uniform float uAspect,uTime,uExtent,uFlow,uScale,uSilk,uReveal;
uniform vec3 uRamp[5];
uniform vec2 uDir,uSeed,uPointer;
uniform float uPointerPower;
in vec2 vUv;out vec4 outColor;
vec2 hash2(vec2 p){vec3 q=fract(vec3(p.xyx)*vec3(.1031,.103,.0973));q+=dot(q,q.yzx+33.33);return fract((q.xx+q.yz)*q.zy)*2.0-1.0;}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*f*(f*(f*6.0-15.0)+10.0);float a=dot(hash2(i),f),b=dot(hash2(i+vec2(1,0)),f-vec2(1,0)),c=dot(hash2(i+vec2(0,1)),f-vec2(0,1)),d=dot(hash2(i+vec2(1,1)),f-vec2(1,1));return .5+.5*mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
vec2 drift(vec2 p,float t){vec2 w1=vec2(noise(p*.85+vec2(t*.11,t*.07)),noise(p*.85+vec2(4.1,1.7)-vec2(t*.08,t*.12)));vec2 w2=vec2(noise(p*1.55+w1*1.8+vec2(1.3,7.1)+t*.05),noise(p*1.55+w1*1.8+vec2(6.4,2.2)-t*.06));return(w1-.5)*1.1+(w2-.5)*.55;}
float coord(vec2 p){vec2 q=p/uScale+vec2(-uDir.y,uDir.x)*uTime*.45;vec2 w=p+drift(q+uSeed,uTime)*uFlow*uScale;return dot(w,uDir)/uExtent+.5;}
vec3 labToRgb(vec3 lab){float l=lab.x+.3963377774*lab.y+.2158037573*lab.z,m=lab.x-.1055613458*lab.y-.0638541728*lab.z,s=lab.x-.0894841775*lab.y-1.291485548*lab.z;l=l*l*l;m=m*m*m;s=s*s*s;return vec3(4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s);}
vec3 encode(vec3 c){c=clamp(c,0.,1.);return mix(c*12.92,1.055*pow(c,vec3(1./2.4))-.055,step(.0031308,c));}
void main(){vec2 p=(vUv-.5)*vec2(uAspect,1.);vec2 d=p-uPointer;p+=d*uPointerPower*exp(-dot(d,d)/.08);float raw=coord(p),scaled=clamp(raw,0.,1.)*4.;int index=int(min(floor(scaled),3.));float f=scaled-float(index),edge=max(.5,fwidth(scaled)*.75);vec3 from=uRamp[0],to=uRamp[1];for(int i=0;i<4;i++){if(i==index){from=uRamp[i];to=uRamp[i+1];}}vec3 lab=mix(from,to,smoothstep(.5-edge,.5+edge,f));vec2 grad=vec2(coord(p+vec2(.004,0))-raw,coord(p+vec2(0,.004))-raw)/.004;vec2 slope=grad*sin(3.14159265*clamp(raw,0.,1.))*uSilk*4.;vec3 normal=normalize(vec3(-slope,1.)),light=normalize(vec3(-uDir.y,uDir.x,1.2));float diffuse=dot(normal,light)-light.z;lab=uRamp[0]+(lab-uRamp[0])*(1.+(diffuse*.35+max(diffuse,0.)*diffuse*.6)*uSilk);lab=mix(uRamp[0],lab,uReveal);outColor=vec4(encode(labToRgb(lab)),1.);}`;
  const COMPOSITE = `#version 300 es
precision highp float;
uniform sampler2D uField;uniform float uFrame;
in vec2 vUv;out vec4 outColor;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
void main(){vec3 color=texture(uField,vUv).rgb;vec2 p=gl_FragCoord.xy+uFrame*vec2(17,59);float grain=hash(p)+hash(p+7.13)-1.;float luma=dot(color,vec3(.2126,.7152,.0722));color+=grain*.045*(.45+2.2*luma*(1.-luma));outColor=vec4(clamp(color,0.,1.),1.);}`;
  const toLab = hex => {
    const rgb = hex.match(/\w\w/g).map(h => parseInt(h,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
    const [r,g,b]=rgb, l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
    return [.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s];
  };
  function program(gl, fragment) {
    const shaders=[];let result;
    try {
      for(const [type,source] of [[gl.VERTEX_SHADER,VERTEX],[gl.FRAGMENT_SHADER,fragment]]){
        const shader=gl.createShader(type);if(!shader)throw Error('No shader');shaders.push(shader);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error('Shader unavailable');
      }
      result=gl.createProgram();if(!result)throw Error('No program');shaders.forEach(s=>gl.attachShader(result,s));gl.linkProgram(result);if(!gl.getProgramParameter(result,gl.LINK_STATUS))throw Error('Link unavailable');
      const uniforms={};for(let i=0;i<gl.getProgramParameter(result,gl.ACTIVE_UNIFORMS);i++){const info=gl.getActiveUniform(result,i);uniforms[info.name.replace(/\[0\]$/,'')]=gl.getUniformLocation(result,info.name);}return {program:result,uniforms};
    } catch {if(result)gl.deleteProgram(result);return null;} finally {shaders.forEach(s=>gl.deleteShader(s));}
  }
  function createSurface(host, settings) {
    host.classList.add('grain-surface');
    const layer=document.createElement('div');layer.className='grainient-container';layer.setAttribute('aria-hidden','true');
    const canvas=document.createElement('canvas');canvas.className='grainient-canvas';layer.append(canvas);host.prepend(layer);
    let gl;try{gl=canvas.getContext('webgl2',{alpha:false,antialias:false,depth:false,stencil:false});}catch{}
    const fallback=()=>{layer.classList.add('grainient-fallback');canvas.remove();};
    if(!gl){fallback();return()=>layer.remove();}
    const field=program(gl,FIELD),composite=program(gl,COMPOSITE);
    if(!field||!composite){if(field)gl.deleteProgram(field.program);if(composite)gl.deleteProgram(composite.program);fallback();return()=>{gl.getExtension('WEBGL_lose_context')?.loseContext();layer.remove();};}
    const texture=gl.createTexture(),buffer=gl.createFramebuffer(),vao=gl.createVertexArray();
    gl.bindTexture(gl.TEXTURE_2D,texture);for(const [key,value] of [[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,key,value);
    const ramp=new Float32Array(PALETTE.flatMap(toLab));const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced=media.matches,visible=false,raf=0,last=0,lastPaint=0,time=0,intro=reduced?1:0,disposed=false,fw=1,fh=1,width=1,height=1;
    const pointer={x:10,y:10,power:0};const radians=settings.angle*Math.PI/180;
    function draw(){if(disposed)return;const f=field.uniforms,c=composite.uniforms;const aspect=width/height;
      gl.bindVertexArray(vao);gl.disable(gl.BLEND);gl.bindFramebuffer(gl.FRAMEBUFFER,buffer);gl.viewport(0,0,fw,fh);gl.useProgram(field.program);
      gl.uniform1f(f.uAspect,aspect);gl.uniform1f(f.uTime,time);gl.uniform3fv(f.uRamp,ramp);gl.uniform2f(f.uDir,Math.sin(radians),Math.cos(radians));gl.uniform1f(f.uExtent,aspect*Math.abs(Math.sin(radians))+Math.abs(Math.cos(radians)));gl.uniform1f(f.uFlow,settings.flow);gl.uniform1f(f.uScale,1);gl.uniform1f(f.uSilk,.25);gl.uniform1f(f.uReveal,intro);gl.uniform2f(f.uSeed,settings.variation*3.17,settings.variation*1.91);gl.uniform2f(f.uPointer,pointer.x,pointer.y);gl.uniform1f(f.uPointerPower,reduced?0:pointer.power);gl.drawArrays(gl.TRIANGLES,0,3);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,canvas.width,canvas.height);gl.useProgram(composite.program);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.uniform1i(c.uField,0);gl.uniform1f(c.uFrame,reduced?0:Math.floor(time*35)%97);gl.drawArrays(gl.TRIANGLES,0,3);
    }
    function frame(now){raf=0;if(disposed||!visible||document.hidden||reduced||host.dataset.suspended==='true')return;if(now-lastPaint<1000/30){raf=requestAnimationFrame(frame);return;}const dt=last?Math.min((now-last)/1000,.05):1/30;last=now;lastPaint=now;time+=dt*settings.speed*.16;intro=Math.min(1,intro+dt/1.6);pointer.power*=.97;draw();raf=requestAnimationFrame(frame);}
    function wake(){if(!disposed&&visible&&!document.hidden&&!reduced&&host.dataset.suspended!=='true'&&!raf){last=0;raf=requestAnimationFrame(frame);}}
    function stop(){cancelAnimationFrame(raf);raf=0;last=0;}
    function resize(){width=Math.max(1,host.clientWidth);height=Math.max(1,host.clientHeight);const ratio=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.round(width*ratio);canvas.height=Math.round(height*ratio);fw=Math.max(1,Math.round(canvas.width/2));fh=Math.max(1,Math.round(canvas.height/2));gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,fw,fh,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.bindFramebuffer(gl.FRAMEBUFFER,buffer);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);gl.bindFramebuffer(gl.FRAMEBUFFER,null);draw();wake();}
    const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
    const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(visible)wake();else stop();});observer.observe(host);
    function onVisibility(){if(document.hidden)stop();else wake();}
    function onMotion(){reduced=media.matches;intro=1;if(reduced){stop();draw();}else wake();}
    function onPointer(event){if(reduced||!visible||event.pointerType==='touch')return;const rect=host.getBoundingClientRect();pointer.x=(event.clientX-rect.left-rect.width/2)/rect.height;pointer.y=.5-(event.clientY-rect.top)/rect.height;pointer.power=.12;}
    function onContextLost(event){event.preventDefault();stop();layer.classList.add('grainient-fallback');canvas.style.opacity='0';}
    host.addEventListener('twd-background-wake',wake);host.addEventListener('pointermove',onPointer,{passive:true});canvas.addEventListener('webglcontextlost',onContextLost);document.addEventListener('visibilitychange',onVisibility);media.addEventListener('change',onMotion);resize();
    return()=>{disposed=true;stop();resizeObserver.disconnect();observer.disconnect();host.removeEventListener('twd-background-wake',wake);host.removeEventListener('pointermove',onPointer);canvas.removeEventListener('webglcontextlost',onContextLost);document.removeEventListener('visibilitychange',onVisibility);media.removeEventListener('change',onMotion);gl.deleteTexture(texture);gl.deleteFramebuffer(buffer);gl.deleteVertexArray(vao);gl.deleteProgram(field.program);gl.deleteProgram(composite.program);gl.getExtension('WEBGL_lose_context')?.loseContext();layer.remove();host.classList.remove('grain-surface');};
  }
  let dispose=[], pageBackground=null;
  function fadeBackground(){
    if(!pageBackground)return;
    const intro=document.querySelector('.hero, .page-intro, .editorial-header, .studies-header, .tools-header');
    const threshold=Math.max(260,intro?intro.offsetTop+intro.offsetHeight-85:window.innerHeight*.7);
    const opacity=Math.max(0,Math.min(1,1-window.scrollY/threshold));
    pageBackground.style.opacity=String(opacity);
    const suspended=opacity<=.005;
    const wasSuspended=pageBackground.dataset.suspended==='true';
    pageBackground.dataset.suspended=String(suspended);
    if(wasSuspended&&!suspended)pageBackground.dispatchEvent(new Event('twd-background-wake'));
  }
  window.addEventListener('scroll',fadeBackground,{passive:true});
  window.addEventListener('resize',fadeBackground);
  window.TWDBackgrounds={mount(page){
    dispose.forEach(fn=>fn());dispose=[];
    if(pageBackground)pageBackground.remove();
    pageBackground=document.createElement('div');pageBackground.className='page-grainient';pageBackground.dataset.suspended='false';pageBackground.setAttribute('aria-hidden','true');
    document.body.prepend(pageBackground);
    const preset=PRESETS[page]||PRESETS.home;
    try{dispose.push(createSurface(pageBackground,preset));}catch{pageBackground.classList.add('grain-static');}
    fadeBackground();
  }};
})();
