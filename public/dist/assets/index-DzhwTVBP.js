var Te=Object.defineProperty;var Ne=(n,e,t)=>e in n?Te(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var h=(n,e,t)=>Ne(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const q=globalThis,ne=q.ShadowRoot&&(q.ShadyCSS===void 0||q.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,re=Symbol(),ae=new WeakMap;let ye=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==re)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(ne&&e===void 0){const s=t!==void 0&&t.length===1;s&&(e=ae.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),s&&ae.set(t,e))}return e}toString(){return this.cssText}};const Re=n=>new ye(typeof n=="string"?n:n+"",void 0,re),f=(n,...e)=>{const t=n.length===1?n[0]:e.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new ye(t,n,re)},qe=(n,e)=>{if(ne)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const s=document.createElement("style"),i=q.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=t.cssText,n.appendChild(s)}},le=ne?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(const s of e.cssRules)t+=s.cssText;return Re(t)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ue,defineProperty:He,getOwnPropertyDescriptor:Me,getOwnPropertyNames:Le,getOwnPropertySymbols:De,getPrototypeOf:ze}=Object,v=globalThis,he=v.trustedTypes,Be=he?he.emptyScript:"",M=v.reactiveElementPolyfillSupport,I=(n,e)=>n,B={toAttribute(n,e){switch(e){case Boolean:n=n?Be:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},_e=(n,e)=>!Ue(n,e),ce={attribute:!0,type:String,converter:B,reflect:!1,useDefault:!1,hasChanged:_e};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),v.litPropertyMetadata??(v.litPropertyMetadata=new WeakMap);let w=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=ce){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(e,s,t);i!==void 0&&He(this.prototype,e,i)}}static getPropertyDescriptor(e,t,s){const{get:i,set:r}=Me(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){const d=i==null?void 0:i.call(this);r==null||r.call(this,o),this.requestUpdate(e,d,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??ce}static _$Ei(){if(this.hasOwnProperty(I("elementProperties")))return;const e=ze(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(I("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(I("properties"))){const t=this.properties,s=[...Le(t),...De(t)];for(const i of s)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[s,i]of t)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const s=new Set(e.flat(1/0).reverse());for(const i of s)t.unshift(le(i))}else e!==void 0&&t.push(le(e));return t}static _$Eu(e,t){const s=t.attribute;return s===!1?void 0:typeof s=="string"?s:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const s of t.keys())this.hasOwnProperty(s)&&(e.set(s,this[s]),delete this[s]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return qe(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostConnected)==null?void 0:s.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var s;return(s=t.hostDisconnected)==null?void 0:s.call(t)})}attributeChangedCallback(e,t,s){this._$AK(e,s)}_$ET(e,t){var r;const s=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,s);if(i!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:B).toAttribute(t,s.type);this._$Em=e,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(e,t){var r,o;const s=this.constructor,i=s._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const d=s.getPropertyOptions(i),l=typeof d.converter=="function"?{fromAttribute:d.converter}:((r=d.converter)==null?void 0:r.fromAttribute)!==void 0?d.converter:B;this._$Em=i,this[i]=l.fromAttribute(t,d.type)??((o=this._$Ej)==null?void 0:o.get(i))??null,this._$Em=null}}requestUpdate(e,t,s){var i;if(e!==void 0){const r=this.constructor,o=this[e];if(s??(s=r.getPropertyOptions(e)),!((s.hasChanged??_e)(o,t)||s.useDefault&&s.reflect&&o===((i=this._$Ej)==null?void 0:i.get(e))&&!this.hasAttribute(r._$Eu(e,s))))return;this.C(e,t,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||s||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,o]of i){const{wrapped:d}=o,l=this[r];d!==!0||this._$AL.has(r)||l===void 0||this.C(r,void 0,o,l)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(s=this._$EO)==null||s.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[I("elementProperties")]=new Map,w[I("finalized")]=new Map,M==null||M({ReactiveElement:w}),(v.reactiveElementVersions??(v.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const P=globalThis,U=P.trustedTypes,de=U?U.createPolicy("lit-html",{createHTML:n=>n}):void 0,ve="$lit$",_=`lit$${Math.random().toFixed(9).slice(2)}$`,be="?"+_,Je=`<${be}>`,S=document,j=()=>S.createComment(""),O=n=>n===null||typeof n!="object"&&typeof n!="function",oe=Array.isArray,Ke=n=>oe(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",L=`[ 	
\f\r]`,x=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ue=/-->/g,pe=/>/g,b=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ge=/'/g,me=/"/g,Ae=/^(?:script|style|textarea|title)$/i,We=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),a=We(1),k=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),fe=new WeakMap,A=S.createTreeWalker(S,129);function Ee(n,e){if(!oe(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return de!==void 0?de.createHTML(e):e}const Ve=(n,e)=>{const t=n.length-1,s=[];let i,r=e===2?"<svg>":e===3?"<math>":"",o=x;for(let d=0;d<t;d++){const l=n[d];let p,m,u=-1,$=0;for(;$<l.length&&(o.lastIndex=$,m=o.exec(l),m!==null);)$=o.lastIndex,o===x?m[1]==="!--"?o=ue:m[1]!==void 0?o=pe:m[2]!==void 0?(Ae.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=b):m[3]!==void 0&&(o=b):o===b?m[0]===">"?(o=i??x,u=-1):m[1]===void 0?u=-2:(u=o.lastIndex-m[2].length,p=m[1],o=m[3]===void 0?b:m[3]==='"'?me:ge):o===me||o===ge?o=b:o===ue||o===pe?o=x:(o=b,i=void 0);const y=o===b&&n[d+1].startsWith("/>")?" ":"";r+=o===x?l+Je:u>=0?(s.push(p),l.slice(0,u)+ve+l.slice(u)+_+y):l+_+(u===-2?d:y)}return[Ee(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),s]};class T{constructor({strings:e,_$litType$:t},s){let i;this.parts=[];let r=0,o=0;const d=e.length-1,l=this.parts,[p,m]=Ve(e,t);if(this.el=T.createElement(p,s),A.currentNode=this.el.content,t===2||t===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=A.nextNode())!==null&&l.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(ve)){const $=m[o++],y=i.getAttribute(u).split(_),R=/([.?@])?(.*)/.exec($);l.push({type:1,index:r,name:R[2],strings:y,ctor:R[1]==="."?Fe:R[1]==="?"?Qe:R[1]==="@"?Xe:H}),i.removeAttribute(u)}else u.startsWith(_)&&(l.push({type:6,index:r}),i.removeAttribute(u));if(Ae.test(i.tagName)){const u=i.textContent.split(_),$=u.length-1;if($>0){i.textContent=U?U.emptyScript:"";for(let y=0;y<$;y++)i.append(u[y],j()),A.nextNode(),l.push({type:2,index:++r});i.append(u[$],j())}}}else if(i.nodeType===8)if(i.data===be)l.push({type:2,index:r});else{let u=-1;for(;(u=i.data.indexOf(_,u+1))!==-1;)l.push({type:7,index:r}),u+=_.length-1}r++}}static createElement(e,t){const s=S.createElement("template");return s.innerHTML=e,s}}function C(n,e,t=n,s){var o,d;if(e===k)return e;let i=s!==void 0?(o=t._$Co)==null?void 0:o[s]:t._$Cl;const r=O(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==r&&((d=i==null?void 0:i._$AO)==null||d.call(i,!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,t,s)),s!==void 0?(t._$Co??(t._$Co=[]))[s]=i:t._$Cl=i),i!==void 0&&(e=C(n,i._$AS(n,e.values),i,s)),e}class Ye{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:s}=this._$AD,i=((e==null?void 0:e.creationScope)??S).importNode(t,!0);A.currentNode=i;let r=A.nextNode(),o=0,d=0,l=s[0];for(;l!==void 0;){if(o===l.index){let p;l.type===2?p=new N(r,r.nextSibling,this,e):l.type===1?p=new l.ctor(r,l.name,l.strings,this,e):l.type===6&&(p=new Ze(r,this,e)),this._$AV.push(p),l=s[++d]}o!==(l==null?void 0:l.index)&&(r=A.nextNode(),o++)}return A.currentNode=S,i}p(e){let t=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(e,s,t),t+=s.strings.length-2):s._$AI(e[t])),t++}}class N{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,s,i){this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=C(this,e,t),O(e)?e===g||e==null||e===""?(this._$AH!==g&&this._$AR(),this._$AH=g):e!==this._$AH&&e!==k&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ke(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==g&&O(this._$AH)?this._$AA.nextSibling.data=e:this.T(S.createTextNode(e)),this._$AH=e}$(e){var r;const{values:t,_$litType$:s}=e,i=typeof s=="number"?this._$AC(e):(s.el===void 0&&(s.el=T.createElement(Ee(s.h,s.h[0]),this.options)),s);if(((r=this._$AH)==null?void 0:r._$AD)===i)this._$AH.p(t);else{const o=new Ye(i,this),d=o.u(this.options);o.p(t),this.T(d),this._$AH=o}}_$AC(e){let t=fe.get(e.strings);return t===void 0&&fe.set(e.strings,t=new T(e)),t}k(e){oe(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let s,i=0;for(const r of e)i===t.length?t.push(s=new N(this.O(j()),this.O(j()),this,this.options)):s=t[i],s._$AI(r),i++;i<t.length&&(this._$AR(s&&s._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,t);e&&e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,s,i,r){this.type=1,this._$AH=g,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=g}_$AI(e,t=this,s,i){const r=this.strings;let o=!1;if(r===void 0)e=C(this,e,t,0),o=!O(e)||e!==this._$AH&&e!==k,o&&(this._$AH=e);else{const d=e;let l,p;for(e=r[0],l=0;l<r.length-1;l++)p=C(this,d[s+l],t,l),p===k&&(p=this._$AH[l]),o||(o=!O(p)||p!==this._$AH[l]),p===g?e=g:e!==g&&(e+=(p??"")+r[l+1]),this._$AH[l]=p}o&&!i&&this.j(e)}j(e){e===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Fe extends H{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===g?void 0:e}}class Qe extends H{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==g)}}class Xe extends H{constructor(e,t,s,i,r){super(e,t,s,i,r),this.type=5}_$AI(e,t=this){if((e=C(this,e,t,0)??g)===k)return;const s=this._$AH,i=e===g&&s!==g||e.capture!==s.capture||e.once!==s.once||e.passive!==s.passive,r=e!==g&&(s===g||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Ze{constructor(e,t,s){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(e){C(this,e)}}const D=P.litHtmlPolyfillSupport;D==null||D(T,N),(P.litHtmlVersions??(P.litHtmlVersions=[])).push("3.3.0");const Ge=(n,e,t)=>{const s=(t==null?void 0:t.renderBefore)??e;let i=s._$litPart$;if(i===void 0){const r=(t==null?void 0:t.renderBefore)??null;s._$litPart$=i=new N(e.insertBefore(j(),r),r,void 0,t??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const E=globalThis;class c extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ge(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return k}}var $e;c._$litElement$=!0,c.finalized=!0,($e=E.litElementHydrateSupport)==null||$e.call(E,{LitElement:c});const z=E.litElementPolyfillSupport;z==null||z({LitElement:c});(E.litElementVersions??(E.litElementVersions=[])).push("4.2.0");class Se extends c{render(){return a`<p>Hello from Lit!</p>`}}h(Se,"styles",f`
    :host {
      display: block;
      padding: 1rem;
      background: #222;
      color: #fff;
    }
  `);customElements.define("hello-lit",Se);class we extends c{constructor(){super(),this.loggedIn=!1}async _register(){try{const e=await fetch("/auth/register/options").then(i=>i.json()),t=await navigator.credentials.create({publicKey:e});(await fetch("/auth/register/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then(i=>i.json())).verified&&(this.loggedIn=!0,this.dispatchEvent(new CustomEvent("login",{bubbles:!0,composed:!0})))}catch(e){alert(e.message)}}async _login(){try{const e=await fetch("/auth/login/options").then(i=>i.json()),t=await navigator.credentials.get({publicKey:e});(await fetch("/auth/login/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}).then(i=>i.json())).verified?(this.loggedIn=!0,this.dispatchEvent(new CustomEvent("login",{bubbles:!0,composed:!0}))):alert("Authentication failed")}catch(e){alert(e.message)}}render(){return a`
      ${this.loggedIn?a`<p>Logged in as KJ</p>`:a`
            <button @click=${this._register}>Register Passkey</button>
            <button @click=${this._login}>Login with Passkey</button>
          `}
    `}}h(we,"properties",{loggedIn:{state:!0}});customElements.define("kj-login",we);class ke extends c{constructor(){super(),this.session=null}async _create(){const e=await fetch("/sessions",{method:"POST"}).then(t=>t.json());this.session=e,this.dispatchEvent(new CustomEvent("session-created",{detail:e,bubbles:!0,composed:!0}))}render(){return a`
      <div>
        ${this.session?a`
              <p aria-live="polite">Room Code: ${this.session.code}</p>
              <img src="${this.session.qrCode}" alt="QR Code" />
            `:a`<button @click=${this._create} aria-label="Start a new karaoke session">Start Session</button>`}
      </div>
    `}}h(ke,"properties",{session:{state:!0}});customElements.define("kj-session-creator",ke);class Ce extends c{constructor(){super(),this.queue=[]}connectedCallback(){super.connectedCallback(),this._loadQueue()}async _loadQueue(){const e=await fetch("/queue").then(t=>t.json());this.queue=e.queue||[]}render(){return a`
      <h3>Queue</h3>
      <ul>
        ${this.queue.map(e=>a`<li>${e.singer}: ${e.videoId}</li>`)}
      </ul>
    `}}h(Ce,"properties",{queue:{state:!0}});customElements.define("kj-control-panel",Ce);class J extends c{constructor(){super(),this.videos=[]}connectedCallback(){super.connectedCallback(),this._load()}_key(){return"kj-picks"}_load(){const e=localStorage.getItem(this._key());this.videos=e?JSON.parse(e):[]}_save(){localStorage.setItem(this._key(),JSON.stringify(this.videos))}_addVideo(){var s;const e=(s=this.renderRoot)==null?void 0:s.getElementById("vid"),t=e.value.trim();t&&(this.videos=[...this.videos,{videoId:t}],e.value="",this._save())}_remove(e){const t=Number(e.target.dataset.index);this.videos=this.videos.filter((s,i)=>i!==t),this._save()}render(){return a`
      <h3>KJ's Picks</h3>
      <input id="vid" placeholder="YouTube Video ID" />
      <button @click=${this._addVideo}>Add</button>
      <ul>
        ${this.videos.map((e,t)=>a`<li>
              <span>${e.videoId}</span>
              <button data-index=${t} @click=${this._remove}>Remove</button>
            </li>`)}
      </ul>
    `}}h(J,"properties",{videos:{state:!0}}),h(J,"styles",f`
    :host {
      display: block;
      margin-top: 1rem;
    }
    input {
      margin: 0.25rem;
      padding: 0.25rem;
    }
    button {
      margin: 0.25rem;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
    }
  `);customElements.define("kj-catalog-manager",J);class et extends c{render(){return a`
      <kj-session-creator></kj-session-creator>
      <kj-control-panel></kj-control-panel>
      <kj-catalog-manager></kj-catalog-manager>
    `}}customElements.define("kj-dashboard",et);class K extends c{constructor(){super(),this.message="",this.open=!1,this.duration=3e3,this._timer=null}show(e,t=this.duration){this.message=e,this.open=!0,clearTimeout(this._timer),this._timer=setTimeout(()=>{this.open=!1},t)}render(){return a`<div role="status" aria-live="polite">${this.message}</div>`}}h(K,"properties",{message:{type:String},open:{type:Boolean,reflect:!0},duration:{type:Number}}),h(K,"styles",f`
    :host {
      position: fixed;
      left: 50%;
      bottom: 1rem;
      transform: translateX(-50%);
      background: #323232;
      color: #fff;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: 1000;
    }
    :host([open]) {
      opacity: 1;
      pointer-events: auto;
    }
  `);customElements.define("toast-notification",K);class W extends c{constructor(){super(),this.code="",this.name="",this.message=""}_onCodeInput(e){this.code=e.target.value.toUpperCase()}_onNameInput(e){this.name=e.target.value}_showToast(e){var s;const t=(s=this.renderRoot)==null?void 0:s.getElementById("toast");t&&t.show(e)}async _join(){if(!(!this.code||!this.name))try{const e="karaoke-mn-id-"+this.code,t=localStorage.getItem(e),s=await fetch("/sessions/"+encodeURIComponent(this.code)+"/join",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:this.name.trim(),deviceId:t||void 0})}),i=await s.json();s.ok?(localStorage.setItem(e,i.deviceId),this.message=`Joined session as ${this.name}`,this._showToast(this.message),this.dispatchEvent(new CustomEvent("session-joined",{detail:{...i,code:this.code,name:this.name.trim()},bubbles:!0,composed:!0}))):(this.message=i.error||"Join failed",this._showToast(this.message))}catch(e){this.message=e.message,this._showToast(this.message)}}render(){return a`
      <form @submit=${e=>{e.preventDefault(),this._join()}}>
        <div>
          <label for="room-code">Room Code</label>
          <input
            id="room-code"
            placeholder="Room Code"
            .value=${this.code}
            @input=${this._onCodeInput}
            autocomplete="off"
            required
          />
        </div>
        <div>
          <label for="singer-name">Your Name</label>
          <input
            id="singer-name"
            placeholder="Your Name"
            .value=${this.name}
            @input=${this._onNameInput}
            autocomplete="off"
            required
          />
        </div>
        <button type="submit" aria-label="Join session">Join</button>
        ${this.message?a`<p aria-live="polite">${this.message}</p>`:""}
      </form>
      <toast-notification id="toast"></toast-notification>
    `}}h(W,"properties",{code:{state:!0},name:{state:!0},message:{state:!0}}),h(W,"styles",f`
    :host {
      display: block;
    }
    input {
      margin: 0.25rem;
      padding: 0.25rem;
    }
    button {
      margin: 0.25rem;
      padding: 0.5rem 1rem;
    }
    p {
      color: #f44336;
    }
  `);customElements.define("guest-join-session",W);class V extends c{constructor(){super(),this.value=""}_onInput(e){this.value=e.target.value,this.dispatchEvent(new CustomEvent("search-input",{detail:{value:this.value},bubbles:!0,composed:!0}))}_onKeyDown(e){e.key==="Enter"&&this.dispatchEvent(new CustomEvent("search",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return a`
      <label for="song-search-input" style="position:absolute;left:-9999px;">Search songs</label>
      <input
        id="song-search-input"
        type="text"
        placeholder="Search songs"
        aria-label="Search songs"
        .value=${this.value}
        @input=${this._onInput}
        @keydown=${this._onKeyDown}
      />
    `}}h(V,"properties",{value:{type:String}}),h(V,"styles",f`
    input {
      padding: 0.5rem;
      font-size: 1rem;
      width: 100%;
      box-sizing: border-box;
    }
  `);customElements.define("search-bar",V);class Y extends c{constructor(){super(),this.result={videoId:"",title:""}}_add(){this.dispatchEvent(new CustomEvent("add-song",{detail:this.result,bubbles:!0,composed:!0}))}_save(){this.dispatchEvent(new CustomEvent("save-song",{detail:this.result,bubbles:!0,composed:!0}))}render(){return a`
      <li>
        <span>${this.result.title}</span>
        <span>
          <button @click=${this._add} aria-label="Add song: ${this.result.title}">Add</button>
          <button @click=${this._save} aria-label="Save song: ${this.result.title}">Save</button>
        </span>
      </li>
    `}}h(Y,"properties",{result:{type:Object}}),h(Y,"styles",f`
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
    }
    button {
      margin-left: 0.5rem;
    }
  `);customElements.define("search-result-item",Y);class F extends c{constructor(){super(),this.results=[]}render(){return a`
      <ul>
        ${this.results.map(e=>a`<search-result-item
              .result=${e}
              @add-song=${t=>this.dispatchEvent(t)}
              @save-song=${t=>this.dispatchEvent(t)}
            ></search-result-item>`)}
      </ul>
    `}}h(F,"properties",{results:{type:Array}}),h(F,"styles",f`
    ul {
      list-style: none;
      padding: 0;
    }
  `);customElements.define("search-results-list",F);class xe extends c{render(){return a`<div class="spinner"></div>`}}h(xe,"styles",f`
    :host {
      display: inline-block;
    }
    .spinner {
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `);customElements.define("loading-spinner",xe);class Q extends c{constructor(){super(),this.results=[],this.loading=!1,this.singer=""}async _onSearch(e){const t=e.detail.value.trim();if(t){this.loading=!0;try{const i=await(await fetch("/search?q="+encodeURIComponent(t))).json();this.results=Array.isArray(i)?i:[]}catch(s){console.error(s),this.results=[]}finally{this.loading=!1}}}async _addSong(e){const{videoId:t}=e.detail;!t||!this.singer||await fetch("/songs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({videoId:t,singer:this.singer})})}_saveSong(e){this.dispatchEvent(new CustomEvent("save-song",{detail:e.detail,bubbles:!0,composed:!0}))}render(){return a`
      <search-bar @search=${this._onSearch}></search-bar>
      ${this.loading?a`<loading-spinner></loading-spinner>`:a`<search-results-list
            .results=${this.results}
            @add-song=${this._addSong}
            @save-song=${this._saveSong}
          ></search-results-list>`}
    `}}h(Q,"properties",{results:{state:!0},loading:{state:!0},singer:{type:String}}),h(Q,"styles",f`
    :host {
      display: block;
    }
  `);customElements.define("guest-song-search",Q);class X extends c{constructor(){super(),this.singer="",this.queue=[]}connectedCallback(){super.connectedCallback(),this._load(),this._interval=setInterval(()=>this._load(),5e3)}disconnectedCallback(){clearInterval(this._interval),super.disconnectedCallback()}async _load(){const t=await(await fetch("/queue")).json();this.queue=Array.isArray(t.queue)?t.queue.filter(s=>s.singer===this.singer):[]}render(){return a`
      <h3>Your Songs</h3>
      <ul aria-label="Your queued songs">
        ${this.queue.map(e=>a`<li>Song ID: ${e.videoId}</li>`)}
      </ul>
    `}}h(X,"properties",{singer:{type:String},queue:{state:!0}}),h(X,"styles",f`
    ul {
      list-style: none;
      padding: 0;
    }
  `);customElements.define("guest-queue-view",X);class Z extends c{constructor(){super(),this.singer="",this.songs=[]}connectedCallback(){super.connectedCallback(),this._load()}_storageKey(){return`karaoke-mn-book-${this.singer}`}_load(){const e=localStorage.getItem(this._storageKey());this.songs=e?JSON.parse(e):[]}_save(){localStorage.setItem(this._storageKey(),JSON.stringify(this.songs))}addSong(e){!e||!e.videoId||this.songs.find(t=>t.videoId===e.videoId)||(this.songs=[...this.songs,e],this._save())}_remove(e){const t=e.target.dataset.id;this.songs=this.songs.filter(s=>s.videoId!==t),this._save()}render(){return a`
      <h3>Your Songbook</h3>
      <ul>
        ${this.songs.map(e=>a`<li>
              <span>${e.title}</span>
              <button data-id=${e.videoId} @click=${this._remove}>
                Remove
              </button>
            </li>`)}
      </ul>
    `}}h(Z,"properties",{singer:{type:String},songs:{state:!0}}),h(Z,"styles",f`
    :host {
      display: block;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
    }
    button {
      margin-left: 0.5rem;
    }
  `);customElements.define("guest-songbook",Z);class Ie extends c{constructor(){super(),this.videoId=""}firstUpdated(){const e=document.createElement("script");e.src="https://www.youtube.com/iframe_api",document.body.appendChild(e),window.onYouTubeIframeAPIReady=()=>{this.player=new YT.Player(this.shadowRoot.getElementById("player"),{height:"390",width:"640",videoId:this.videoId})}}updated(e){e.has("videoId")&&this.player&&this.player.loadVideoById(this.videoId)}render(){return a` <div id="player"></div> `}}h(Ie,"properties",{videoId:{type:String}});customElements.define("youtube-player",Ie);class G extends c{constructor(){super(),this.queue=[]}render(){return a`
      <ul aria-label="Upcoming singers queue">
        ${this.queue.map(e=>a`<li>Singer: ${e.singer}, Song ID: ${e.videoId}</li>`)}
      </ul>
    `}}h(G,"properties",{queue:{type:Array}}),h(G,"styles",f`
    ul {
      list-style: none;
      padding: 0;
    }
  `);customElements.define("main-queue-display",G);class Pe extends c{constructor(){super(),this.videoId="",this.playing=!1}play(e){this.videoId=e,this.playing=!0}stop(){this.playing=!1}render(){return this.playing?a`<youtube-player .videoId=${this.videoId}></youtube-player>`:a``}}h(Pe,"properties",{videoId:{type:String},playing:{type:Boolean}});customElements.define("interstitial-player",Pe);class ee extends c{constructor(){super(),this.message="",this.open=!1}show(e){this.message=e,this.open=!0}hide(){this.open=!1}render(){return a`${this.message}`}}h(ee,"properties",{message:{type:String},open:{type:Boolean,reflect:!0}}),h(ee,"styles",f`
    :host {
      position: fixed;
      left: 50%;
      top: 20%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 1rem 2rem;
      border-radius: 8px;
      font-size: 1.5rem;
      display: none;
      z-index: 1000;
    }
    :host([open]) {
      display: block;
    }
  `);customElements.define("on-screen-announcement",ee);class te extends c{constructor(){super(),this.queue=[]}connectedCallback(){super.connectedCallback(),this._load(),this._interval=setInterval(()=>this._load(),5e3)}disconnectedCallback(){clearInterval(this._interval),super.disconnectedCallback()}async _load(){const t=await(await fetch("/queue")).json();this.queue=t.queue||[]}render(){const e=this.queue[0];return a`
      <youtube-player
        .videoId=${e?e.videoId:""}
      ></youtube-player>
      <main-queue-display .queue=${this.queue.slice(1,6)}></main-queue-display>
      <interstitial-player id="interstitial"></interstitial-player>
      <on-screen-announcement id="announcement"></on-screen-announcement>
    `}}h(te,"properties",{queue:{state:!0}}),h(te,"styles",f`
    :host {
      display: block;
      text-align: center;
    }
  `);customElements.define("main-screen-view",te);class se extends c{constructor(){super(),this.theme=localStorage.getItem("theme")||"light"}toggleTheme(){this.theme=this.theme==="light"?"dark":"light",localStorage.setItem("theme",this.theme),document.body.setAttribute("data-theme",this.theme)}render(){return a`
      <h2>Settings / Profile</h2>
      <div>
        <label>Theme: ${this.theme}</label>
        <button @click=${this.toggleTheme}>Toggle Theme</button>
      </div>
      <!-- Add more preferences here -->
    `}}h(se,"properties",{theme:{type:String}}),h(se,"styles",f`
    :host {
      display: block;
      padding: 1rem;
    }
    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
    }
  `);customElements.define("settings-profile",se);class je extends c{constructor(){super(),this.loggedIn=!1}_onLogin(){this.loggedIn=!0}render(){return this.loggedIn?a`<kj-dashboard></kj-dashboard>`:a`<kj-login @login=${this._onLogin}></kj-login>`}}h(je,"properties",{loggedIn:{state:!0}});customElements.define("kj-view",je);class Oe extends c{constructor(){super(),this.joined=!1,this.singer="",this.code=""}_onSaveSong(e){var s;const t=(s=this.renderRoot)==null?void 0:s.querySelector("guest-songbook");t==null||t.addSong(e.detail)}_onJoined(e){const{name:t,code:s}=e.detail;this.joined=!0,this.singer=t,this.code=s}render(){return this.joined?a`
          <guest-song-search
            .singer=${this.singer}
            @save-song=${this._onSaveSong}
          ></guest-song-search>
          <guest-songbook .singer=${this.singer}></guest-songbook>
          <guest-queue-view .singer=${this.singer}></guest-queue-view>
        `:a`<guest-join-session
          @session-joined=${this._onJoined}
        ></guest-join-session>`}}h(Oe,"properties",{joined:{state:!0},singer:{state:!0},code:{state:!0}});customElements.define("guest-view",Oe);class ie extends c{constructor(){super(),this.route=this._getRoute(),this._onPopState=()=>{this.route=this._getRoute()}}connectedCallback(){super.connectedCallback(),window.addEventListener("popstate",this._onPopState)}disconnectedCallback(){window.removeEventListener("popstate",this._onPopState),super.disconnectedCallback()}_getRoute(){const e=window.location.pathname;return e.startsWith("/kj")?"kj":e.startsWith("/guest")?"guest":e.startsWith("/main")?"main":e.startsWith("/settings")?"settings":"guest"}_navigate(e){window.history.pushState({},"",e),this.route=this._getRoute()}render(){return a`
      <nav>
        <a @click=${()=>this._navigate("/kj")}>KJ</a>
        <a @click=${()=>this._navigate("/guest")}>Guest</a>
        <a @click=${()=>this._navigate("/main")}>Main</a>
        <a @click=${()=>this._navigate("/settings")}>Settings</a>
      </nav>
      ${this.route==="kj"?a`<kj-view></kj-view>`:this.route==="guest"?a`<guest-view></guest-view>`:this.route==="main"?a`<main-screen-view></main-screen-view>`:a`<settings-profile></settings-profile>`}
    `}}h(ie,"properties",{route:{state:!0}}),h(ie,"styles",f`
    nav {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    nav a {
      cursor: pointer;
      color: #00bcd4;
    }
  `);customElements.define("karaoke-app",ie);
