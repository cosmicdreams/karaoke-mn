var Pn=Object.defineProperty;var Tn=(i,e,t)=>e in i?Pn(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var $=(i,e,t)=>Tn(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const he=globalThis,dt=he.ShadowRoot&&(he.ShadyCSS===void 0||he.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ht=Symbol(),bt=new WeakMap;let rn=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==ht)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(dt&&e===void 0){const n=t!==void 0&&t.length===1;n&&(e=bt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),n&&bt.set(t,e))}return e}toString(){return this.cssText}};const Rn=i=>new rn(typeof i=="string"?i:i+"",void 0,ht),B=(i,...e)=>{const t=i.length===1?i[0]:e.reduce((n,s,r)=>n+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+i[r+1],i[0]);return new rn(t,i,ht)},Bn=(i,e)=>{if(dt)i.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const n=document.createElement("style"),s=he.litNonce;s!==void 0&&n.setAttribute("nonce",s),n.textContent=t.cssText,i.appendChild(n)}},vt=dt?i=>i:i=>i instanceof CSSStyleSheet?(e=>{let t="";for(const n of e.cssRules)t+=n.cssText;return Rn(t)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Nn,defineProperty:Mn,getOwnPropertyDescriptor:qn,getOwnPropertyNames:Un,getOwnPropertySymbols:Ln,getPrototypeOf:xn}=Object,H=globalThis,wt=H.trustedTypes,jn=wt?wt.emptyScript:"",we=H.reactiveElementPolyfillSupport,se=(i,e)=>i,Ke={toAttribute(i,e){switch(e){case Boolean:i=i?jn:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,e){let t=i;switch(e){case Boolean:t=i!==null;break;case Number:t=i===null?null:Number(i);break;case Object:case Array:try{t=JSON.parse(i)}catch{t=null}}return t}},on=(i,e)=>!Nn(i,e),_t={attribute:!0,type:String,converter:Ke,reflect:!1,useDefault:!1,hasChanged:on};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),H.litPropertyMetadata??(H.litPropertyMetadata=new WeakMap);let G=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_t){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const n=Symbol(),s=this.getPropertyDescriptor(e,n,t);s!==void 0&&Mn(this.prototype,e,s)}}static getPropertyDescriptor(e,t,n){const{get:s,set:r}=qn(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){const l=s==null?void 0:s.call(this);r==null||r.call(this,o),this.requestUpdate(e,l,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_t}static _$Ei(){if(this.hasOwnProperty(se("elementProperties")))return;const e=xn(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(se("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(se("properties"))){const t=this.properties,n=[...Un(t),...Ln(t)];for(const s of n)this.createProperty(s,t[s])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[n,s]of t)this.elementProperties.set(n,s)}this._$Eh=new Map;for(const[t,n]of this.elementProperties){const s=this._$Eu(t,n);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const n=new Set(e.flat(1/0).reverse());for(const s of n)t.unshift(vt(s))}else e!==void 0&&t.push(vt(e));return t}static _$Eu(e,t){const n=t.attribute;return n===!1?void 0:typeof n=="string"?n:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const n of t.keys())this.hasOwnProperty(n)&&(e.set(n,this[n]),delete this[n]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Bn(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var n;return(n=t.hostConnected)==null?void 0:n.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var n;return(n=t.hostDisconnected)==null?void 0:n.call(t)})}attributeChangedCallback(e,t,n){this._$AK(e,n)}_$ET(e,t){var r;const n=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,n);if(s!==void 0&&n.reflect===!0){const o=(((r=n.converter)==null?void 0:r.toAttribute)!==void 0?n.converter:Ke).toAttribute(t,n.type);this._$Em=e,o==null?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(e,t){var r,o;const n=this.constructor,s=n._$Eh.get(e);if(s!==void 0&&this._$Em!==s){const l=n.getPropertyOptions(s),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((r=l.converter)==null?void 0:r.fromAttribute)!==void 0?l.converter:Ke;this._$Em=s,this[s]=a.fromAttribute(t,l.type)??((o=this._$Ej)==null?void 0:o.get(s))??null,this._$Em=null}}requestUpdate(e,t,n){var s;if(e!==void 0){const r=this.constructor,o=this[e];if(n??(n=r.getPropertyOptions(e)),!((n.hasChanged??on)(o,t)||n.useDefault&&n.reflect&&o===((s=this._$Ej)==null?void 0:s.get(e))&&!this.hasAttribute(r._$Eu(e,n))))return;this.C(e,t,n)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:n,reflect:s,wrapped:r},o){n&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||n||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var n;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[r,o]of s){const{wrapped:l}=o,a=this[r];l!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,o,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(n=this._$EO)==null||n.forEach(s=>{var r;return(r=s.hostUpdate)==null?void 0:r.call(s)}),this.update(t)):this._$EM()}catch(s){throw e=!1,this._$EM(),s}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(n=>{var s;return(s=n.hostUpdated)==null?void 0:s.call(n)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};G.elementStyles=[],G.shadowRootOptions={mode:"open"},G[se("elementProperties")]=new Map,G[se("finalized")]=new Map,we==null||we({ReactiveElement:G}),(H.reactiveElementVersions??(H.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ie=globalThis,fe=ie.trustedTypes,$t=fe?fe.createPolicy("lit-html",{createHTML:i=>i}):void 0,an="$lit$",D=`lit$${Math.random().toFixed(9).slice(2)}$`,ln="?"+D,On=`<${ln}>`,V=document,re=()=>V.createComment(""),oe=i=>i===null||typeof i!="object"&&typeof i!="function",ft=Array.isArray,Dn=i=>ft(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",_e=`[ 	
\f\r]`,te=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Et=/-->/g,Ct=/>/g,z=RegExp(`>|${_e}(?:([^\\s"'>=/]+)(${_e}*=${_e}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),At=/'/g,St=/"/g,un=/^(?:script|style|textarea|title)$/i,Hn=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),m=Hn(1),Z=Symbol.for("lit-noChange"),q=Symbol.for("lit-nothing"),It=new WeakMap,F=V.createTreeWalker(V,129);function cn(i,e){if(!ft(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return $t!==void 0?$t.createHTML(e):e}const zn=(i,e)=>{const t=i.length-1,n=[];let s,r=e===2?"<svg>":e===3?"<math>":"",o=te;for(let l=0;l<t;l++){const a=i[l];let u,c,d=-1,f=0;for(;f<a.length&&(o.lastIndex=f,c=o.exec(a),c!==null);)f=o.lastIndex,o===te?c[1]==="!--"?o=Et:c[1]!==void 0?o=Ct:c[2]!==void 0?(un.test(c[2])&&(s=RegExp("</"+c[2],"g")),o=z):c[3]!==void 0&&(o=z):o===z?c[0]===">"?(o=s??te,d=-1):c[1]===void 0?d=-2:(d=o.lastIndex-c[2].length,u=c[1],o=c[3]===void 0?z:c[3]==='"'?St:At):o===St||o===At?o=z:o===Et||o===Ct?o=te:(o=z,s=void 0);const h=o===z&&i[l+1].startsWith("/>")?" ":"";r+=o===te?a+On:d>=0?(n.push(u),a.slice(0,d)+an+a.slice(d)+D+h):a+D+(d===-2?l:h)}return[cn(i,r+(i[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),n]};class ae{constructor({strings:e,_$litType$:t},n){let s;this.parts=[];let r=0,o=0;const l=e.length-1,a=this.parts,[u,c]=zn(e,t);if(this.el=ae.createElement(u,n),F.currentNode=this.el.content,t===2||t===3){const d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(s=F.nextNode())!==null&&a.length<l;){if(s.nodeType===1){if(s.hasAttributes())for(const d of s.getAttributeNames())if(d.endsWith(an)){const f=c[o++],h=s.getAttribute(d).split(D),E=/([.?@])?(.*)/.exec(f);a.push({type:1,index:r,name:E[2],strings:h,ctor:E[1]==="."?Jn:E[1]==="?"?Vn:E[1]==="@"?Kn:pe}),s.removeAttribute(d)}else d.startsWith(D)&&(a.push({type:6,index:r}),s.removeAttribute(d));if(un.test(s.tagName)){const d=s.textContent.split(D),f=d.length-1;if(f>0){s.textContent=fe?fe.emptyScript:"";for(let h=0;h<f;h++)s.append(d[h],re()),F.nextNode(),a.push({type:2,index:++r});s.append(d[f],re())}}}else if(s.nodeType===8)if(s.data===ln)a.push({type:2,index:r});else{let d=-1;for(;(d=s.data.indexOf(D,d+1))!==-1;)a.push({type:7,index:r}),d+=D.length-1}r++}}static createElement(e,t){const n=V.createElement("template");return n.innerHTML=e,n}}function X(i,e,t=i,n){var o,l;if(e===Z)return e;let s=n!==void 0?(o=t._$Co)==null?void 0:o[n]:t._$Cl;const r=oe(e)?void 0:e._$litDirective$;return(s==null?void 0:s.constructor)!==r&&((l=s==null?void 0:s._$AO)==null||l.call(s,!1),r===void 0?s=void 0:(s=new r(i),s._$AT(i,t,n)),n!==void 0?(t._$Co??(t._$Co=[]))[n]=s:t._$Cl=s),s!==void 0&&(e=X(i,s._$AS(i,e.values),s,n)),e}class Fn{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:n}=this._$AD,s=((e==null?void 0:e.creationScope)??V).importNode(t,!0);F.currentNode=s;let r=F.nextNode(),o=0,l=0,a=n[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new le(r,r.nextSibling,this,e):a.type===1?u=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(u=new Yn(r,this,e)),this._$AV.push(u),a=n[++l]}o!==(a==null?void 0:a.index)&&(r=F.nextNode(),o++)}return F.currentNode=V,s}p(e){let t=0;for(const n of this._$AV)n!==void 0&&(n.strings!==void 0?(n._$AI(e,n,t),t+=n.strings.length-2):n._$AI(e[t])),t++}}class le{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,n,s){this.type=2,this._$AH=q,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=n,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),oe(e)?e===q||e==null||e===""?(this._$AH!==q&&this._$AR(),this._$AH=q):e!==this._$AH&&e!==Z&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Dn(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==q&&oe(this._$AH)?this._$AA.nextSibling.data=e:this.T(V.createTextNode(e)),this._$AH=e}$(e){var r;const{values:t,_$litType$:n}=e,s=typeof n=="number"?this._$AC(e):(n.el===void 0&&(n.el=ae.createElement(cn(n.h,n.h[0]),this.options)),n);if(((r=this._$AH)==null?void 0:r._$AD)===s)this._$AH.p(t);else{const o=new Fn(s,this),l=o.u(this.options);o.p(t),this.T(l),this._$AH=o}}_$AC(e){let t=It.get(e.strings);return t===void 0&&It.set(e.strings,t=new ae(e)),t}k(e){ft(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let n,s=0;for(const r of e)s===t.length?t.push(n=new le(this.O(re()),this.O(re()),this,this.options)):n=t[s],n._$AI(r),s++;s<t.length&&(this._$AR(n&&n._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){var n;for((n=this._$AP)==null?void 0:n.call(this,!1,!0,t);e&&e!==this._$AB;){const s=e.nextSibling;e.remove(),e=s}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}}class pe{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,n,s,r){this.type=1,this._$AH=q,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,n.length>2||n[0]!==""||n[1]!==""?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=q}_$AI(e,t=this,n,s){const r=this.strings;let o=!1;if(r===void 0)e=X(this,e,t,0),o=!oe(e)||e!==this._$AH&&e!==Z,o&&(this._$AH=e);else{const l=e;let a,u;for(e=r[0],a=0;a<r.length-1;a++)u=X(this,l[n+a],t,a),u===Z&&(u=this._$AH[a]),o||(o=!oe(u)||u!==this._$AH[a]),u===q?e=q:e!==q&&(e+=(u??"")+r[a+1]),this._$AH[a]=u}o&&!s&&this.j(e)}j(e){e===q?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Jn extends pe{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===q?void 0:e}}class Vn extends pe{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==q)}}class Kn extends pe{constructor(e,t,n,s,r){super(e,t,n,s,r),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??q)===Z)return;const n=this._$AH,s=e===q&&n!==q||e.capture!==n.capture||e.once!==n.once||e.passive!==n.passive,r=e!==q&&(n===q||s);s&&this.element.removeEventListener(this.name,this,n),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}}class Yn{constructor(e,t,n){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const $e=ie.litHtmlPolyfillSupport;$e==null||$e(ae,le),(ie.litHtmlVersions??(ie.litHtmlVersions=[])).push("3.3.0");const Qn=(i,e,t)=>{const n=(t==null?void 0:t.renderBefore)??e;let s=n._$litPart$;if(s===void 0){const r=(t==null?void 0:t.renderBefore)??null;n._$litPart$=s=new le(e.insertBefore(re(),r),r,void 0,t??{})}return s._$AI(i),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const J=globalThis;class R extends G{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Qn(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return Z}}var sn;R._$litElement$=!0,R.finalized=!0,(sn=J.litElementHydrateSupport)==null||sn.call(J,{LitElement:R});const Ee=J.litElementPolyfillSupport;Ee==null||Ee({LitElement:R});(J.litElementVersions??(J.litElementVersions=[])).push("4.2.0");class dn extends R{render(){return m`<p>Hello from Lit!</p>`}}$(dn,"styles",B`
    :host {
      display: block;
      padding: 1rem;
      background: #222;
      color: #fff;
    }
  `);customElements.define("hello-lit",dn);function ce(i){const e="=".repeat((4-i.length%4)%4),t=(i+e).replace(/-/g,"+").replace(/_/g,"/"),n=atob(t);return Uint8Array.from(n,s=>s.charCodeAt(0))}function Wn(i){const e=String.fromCharCode(...new Uint8Array(i));return btoa(e).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function kt(i){if(!i)return i;const e={...i};return e.challenge&&(e.challenge=ce(e.challenge)),e.user&&e.user.id&&(e.user.id=ce(e.user.id)),Array.isArray(e.allowCredentials)&&(e.allowCredentials=e.allowCredentials.map(t=>({...t,id:ce(t.id)}))),Array.isArray(e.excludeCredentials)&&(e.excludeCredentials=e.excludeCredentials.map(t=>({...t,id:ce(t.id)}))),e}function ge(i){if(i instanceof ArrayBuffer)return Wn(i);if(Array.isArray(i))return i.map(ge);if(i&&typeof i=="object"){const e={};for(const[t,n]of Object.entries(i))e[t]=ge(n);return e}return i}class hn extends R{constructor(){super(),this.loggedIn=!1}async _register(){try{const e=await fetch("/auth/register/options").then(r=>r.json()),t=kt(e),n=await navigator.credentials.create({publicKey:t});(await fetch("/auth/register/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(ge(n))}).then(r=>r.json())).verified&&(this.loggedIn=!0,this.dispatchEvent(new CustomEvent("login",{bubbles:!0,composed:!0})))}catch(e){alert(e.message)}}async _login(){try{const e=await fetch("/auth/login/options").then(r=>r.json()),t=kt(e),n=await navigator.credentials.get({publicKey:t});(await fetch("/auth/login/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(ge(n))}).then(r=>r.json())).verified?(this.loggedIn=!0,this.dispatchEvent(new CustomEvent("login",{bubbles:!0,composed:!0}))):alert("Authentication failed")}catch(e){alert(e.message)}}render(){return m`
      ${this.loggedIn?m`<p>Logged in as KJ</p>`:m`
            <button @click=${this._register}>Register Passkey</button>
            <button @click=${this._login}>Login with Passkey</button>
          `}
    `}}$(hn,"properties",{loggedIn:{state:!0}});customElements.define("kj-login",hn);class fn extends R{constructor(){super(),this.session=null}async _create(){const e=await fetch("/sessions",{method:"POST"}).then(t=>t.json());this.session=e,this.dispatchEvent(new CustomEvent("session-created",{detail:e,bubbles:!0,composed:!0}))}render(){return m`
      <div>
        ${this.session?m`
              <p aria-live="polite">Room Code: ${this.session.code}</p>
              <img src="${this.session.qrCode}" alt="QR Code" />
            `:m`<button @click=${this._create} aria-label="Start a new karaoke session">Start Session</button>`}
      </div>
    `}}$(fn,"properties",{session:{state:!0}});customElements.define("kj-session-creator",fn);class Ye extends R{constructor(){super(),this.queue=[],this.singer="",this.videoId=""}connectedCallback(){super.connectedCallback(),this._loadQueue(),this._interval=setInterval(()=>this._loadQueue(),5e3)}disconnectedCallback(){clearInterval(this._interval),super.disconnectedCallback()}async _loadQueue(){const e=await fetch("/queue").then(t=>t.json());this.queue=e.queue||[]}async _addSong(){!this.singer||!this.videoId||(await fetch("/songs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({videoId:this.videoId,singer:this.singer})}),this.videoId="",await this._loadQueue())}async _complete(e){await fetch(`/songs/${e}/complete`,{method:"POST"}),await this._loadQueue()}async _skip(e){await fetch(`/songs/${e}/skip`,{method:"POST"}),await this._loadQueue()}async _reorder(e,t){const n=[...this.queue],[s]=n.splice(e,1);n.splice(t,0,s),await fetch("/songs/reorder",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({order:n.map(r=>r.id)})}),await this._loadQueue()}render(){return m`
      <h3>Queue</h3>
      <div>
        <input
          placeholder="Singer"
          .value=${this.singer}
          @input=${e=>this.singer=e.target.value}
        />
        <input
          placeholder="Video ID"
          .value=${this.videoId}
          @input=${e=>this.videoId=e.target.value}
        />
        <button @click=${this._addSong}>Add</button>
      </div>
      <ul>
        ${this.queue.map((e,t)=>m`<li>
              ${e.singer}: ${e.videoId}
              <button
                @click=${()=>this._reorder(t,t-1)}
                disabled=${t===0}
              >
                ↑
              </button>
              <button
                @click=${()=>this._reorder(t,t+1)}
                disabled=${t===this.queue.length-1}
              >
                ↓
              </button>
              <button @click=${()=>this._skip(e.id)}>Skip</button>
              <button @click=${()=>this._complete(e.id)}>Complete</button>
            </li>`)}
      </ul>
    `}}$(Ye,"properties",{queue:{state:!0},singer:{state:!0},videoId:{state:!0}}),$(Ye,"styles",B`
    :host {
      display: block;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    input {
      margin-right: 0.25rem;
    }
  `);customElements.define("kj-control-panel",Ye);class Qe extends R{constructor(){super(),this.videos=[]}connectedCallback(){super.connectedCallback(),this._load()}_key(){return"kj-picks"}_load(){const e=localStorage.getItem(this._key());this.videos=e?JSON.parse(e):[]}_save(){localStorage.setItem(this._key(),JSON.stringify(this.videos))}_addVideo(){var n;const e=(n=this.renderRoot)==null?void 0:n.getElementById("vid"),t=e.value.trim();t&&(this.videos=[...this.videos,{videoId:t}],e.value="",this._save())}_remove(e){const t=Number(e.target.dataset.index);this.videos=this.videos.filter((n,s)=>s!==t),this._save()}render(){return m`
      <h3>KJ's Picks</h3>
      <input id="vid" placeholder="YouTube Video ID" />
      <button @click=${this._addVideo}>Add</button>
      <ul>
        ${this.videos.map((e,t)=>m`<li>
              <span>${e.videoId}</span>
              <button data-index=${t} @click=${this._remove}>Remove</button>
            </li>`)}
      </ul>
    `}}$(Qe,"properties",{videos:{state:!0}}),$(Qe,"styles",B`
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
  `);customElements.define("kj-catalog-manager",Qe);class Gn extends R{render(){return m`
      <kj-session-creator></kj-session-creator>
      <kj-control-panel></kj-control-panel>
      <kj-catalog-manager></kj-catalog-manager>
    `}}customElements.define("kj-dashboard",Gn);class We extends R{constructor(){super(),this.message="",this.open=!1,this.duration=3e3,this._timer=null}show(e,t=this.duration){this.message=e,this.open=!0,clearTimeout(this._timer),this._timer=setTimeout(()=>{this.open=!1},t)}render(){return m`<div role="status" aria-live="polite">${this.message}</div>`}}$(We,"properties",{message:{type:String},open:{type:Boolean,reflect:!0},duration:{type:Number}}),$(We,"styles",B`
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
  `);customElements.define("toast-notification",We);class Ge extends R{constructor(){super(),this.code="",this.name="",this.message=""}connectedCallback(){super.connectedCallback();const t=new URLSearchParams(window.location.search).get("code");t&&(this.code=t.toUpperCase())}_onCodeInput(e){this.code=e.target.value.toUpperCase()}_onNameInput(e){this.name=e.target.value}_showToast(e){var n;const t=(n=this.renderRoot)==null?void 0:n.getElementById("toast");t&&t.show(e)}async _join(){if(!(!this.code||!this.name))try{const e="karaoke-mn-id-"+this.code,t=localStorage.getItem(e),n=await fetch("/sessions/"+encodeURIComponent(this.code)+"/join",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:this.name.trim(),deviceId:t||void 0})}),s=await n.json();n.ok?(localStorage.setItem(e,s.deviceId),this.message=`Joined session as ${this.name}`,this._showToast(this.message),this.dispatchEvent(new CustomEvent("session-joined",{detail:{...s,code:this.code,name:this.name.trim()},bubbles:!0,composed:!0}))):(this.message=s.error||"Join failed",this._showToast(this.message))}catch(e){this.message=e.message,this._showToast(this.message)}}render(){return m`
      <form
        @submit=${e=>{e.preventDefault(),this._join()}}
      >
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
        ${this.message?m`<p aria-live="polite">${this.message}</p>`:""}
      </form>
      <toast-notification id="toast"></toast-notification>
    `}}$(Ge,"properties",{code:{state:!0},name:{state:!0},message:{state:!0}}),$(Ge,"styles",B`
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
  `);customElements.define("guest-join-session",Ge);class Ze extends R{constructor(){super(),this.value=""}_onInput(e){this.value=e.target.value,this.dispatchEvent(new CustomEvent("search-input",{detail:{value:this.value},bubbles:!0,composed:!0}))}_onKeyDown(e){e.key==="Enter"&&this.dispatchEvent(new CustomEvent("search",{detail:{value:this.value},bubbles:!0,composed:!0}))}render(){return m`
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
    `}}$(Ze,"properties",{value:{type:String}}),$(Ze,"styles",B`
    input {
      padding: 0.5rem;
      font-size: 1rem;
      width: 100%;
      box-sizing: border-box;
    }
  `);customElements.define("search-bar",Ze);class Xe extends R{constructor(){super(),this.result={videoId:"",title:""}}_preview(){this.dispatchEvent(new CustomEvent("preview-song",{detail:this.result,bubbles:!0,composed:!0}))}_add(){this.dispatchEvent(new CustomEvent("add-song",{detail:this.result,bubbles:!0,composed:!0}))}_save(){this.dispatchEvent(new CustomEvent("save-song",{detail:this.result,bubbles:!0,composed:!0}))}render(){return m`
      <li>
        <span>${this.result.title}</span>
        <span>
          <button
            @click=${this._add}
            aria-label="Add song: ${this.result.title}"
          >
            Add
          </button>
          <button
            @click=${this._save}
            aria-label="Save song: ${this.result.title}"
          >
            Save
          </button>
          <button
            @click=${this._preview}
            aria-label="Preview song: ${this.result.title}"
          >
            Preview
          </button>
        </span>
      </li>
    `}}$(Xe,"properties",{result:{type:Object}}),$(Xe,"styles",B`
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.25rem 0;
    }
    button {
      margin-left: 0.5rem;
    }
  `);customElements.define("search-result-item",Xe);class et extends R{constructor(){super(),this.results=[]}render(){return m`
      <ul>
        ${this.results.map(e=>m`<search-result-item
              .result=${e}
              @add-song=${t=>this.dispatchEvent(t)}
              @save-song=${t=>this.dispatchEvent(t)}
              @preview-song=${t=>this.dispatchEvent(t)}
            ></search-result-item>`)}
      </ul>
    `}}$(et,"properties",{results:{type:Array}}),$(et,"styles",B`
    ul {
      list-style: none;
      padding: 0;
    }
  `);customElements.define("search-results-list",et);class gn extends R{render(){return m`<div class="spinner"></div>`}}$(gn,"styles",B`
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
  `);customElements.define("loading-spinner",gn);class tt extends R{constructor(){super(),this.open=!1}close(){this.open=!1}_onBackdrop(e){e.target===e.currentTarget&&this.close()}render(){return m`
      <div class="dialog" @click=${e=>e.stopPropagation()}>
        <slot></slot>
      </div>
    `}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this._onBackdrop)}disconnectedCallback(){this.removeEventListener("click",this._onBackdrop),super.disconnectedCallback()}}$(tt,"properties",{open:{type:Boolean,reflect:!0}}),$(tt,"styles",B`
    :host {
      display: none;
    }
    :host([open]) {
      display: block;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dialog {
      background: #fff;
      color: #000;
      padding: 1rem;
      border-radius: 4px;
      max-width: 90%;
      max-height: 90%;
      overflow: auto;
    }
  `);customElements.define("modal-dialog",tt);class pn extends R{constructor(){super(),this.videoId=""}firstUpdated(){const e=document.createElement("script");e.src="https://www.youtube.com/iframe_api",document.body.appendChild(e),window.onYouTubeIframeAPIReady=()=>{this.player=new YT.Player(this.shadowRoot.getElementById("player"),{height:"390",width:"640",videoId:this.videoId})}}updated(e){e.has("videoId")&&this.player&&this.player.loadVideoById(this.videoId)}render(){return m` <div id="player"></div> `}}$(pn,"properties",{videoId:{type:String}});customElements.define("youtube-player",pn);class nt extends R{constructor(){super(),this.videoId="",this.title="",this.open=!1}_close(){this.open=!1}render(){return m`
      <modal-dialog ?open=${this.open} @click=${this._close}>
        <h2>${this.title}</h2>
        <youtube-player .videoId=${this.videoId}></youtube-player>
        <button @click=${this._close}>Close</button>
      </modal-dialog>
    `}}$(nt,"properties",{videoId:{type:String},title:{type:String},open:{type:Boolean,reflect:!0}}),$(nt,"styles",B`
    button {
      margin-top: 0.5rem;
    }
  `);customElements.define("video-preview-modal",nt);class st extends R{constructor(){super(),this.results=[],this.loading=!1,this.singer="",this.preview=null}async _onSearch(e){const t=e.detail.value.trim();if(!t)return;const n=t.toLowerCase().includes("karaoke")?t:`${t} karaoke`;this.loading=!0;try{const r=await(await fetch("/search?q="+encodeURIComponent(n))).json();this.results=Array.isArray(r)?r:[]}catch(s){console.error(s),this.results=[]}finally{this.loading=!1}}async _addSong(e){const{videoId:t}=e.detail;!t||!this.singer||await fetch("/songs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({videoId:t,singer:this.singer})})}async _previewSong(e){const{videoId:t}=e.detail;if(t)try{const n=await fetch(`/preview?videoId=${encodeURIComponent(t)}`);if(n.ok){const s=await n.json();this.preview=s}}catch(n){console.error(n)}}_saveSong(e){this.dispatchEvent(new CustomEvent("save-song",{detail:e.detail,bubbles:!0,composed:!0}))}render(){var e,t;return m`
      <search-bar @search=${this._onSearch}></search-bar>
      ${this.loading?m`<loading-spinner></loading-spinner>`:m`<search-results-list
            .results=${this.results}
            @add-song=${this._addSong}
            @save-song=${this._saveSong}
            @preview-song=${this._previewSong}
          ></search-results-list>`}
      <video-preview-modal
        .videoId=${((e=this.preview)==null?void 0:e.videoId)||""}
        .title=${((t=this.preview)==null?void 0:t.title)||""}
        .open=${!!this.preview}
        @click=${()=>this.preview=null}
      ></video-preview-modal>
    `}}$(st,"properties",{results:{state:!0},loading:{state:!0},singer:{type:String},preview:{state:!0}}),$(st,"styles",B`
    :host {
      display: block;
    }
  `);customElements.define("guest-song-search",st);class it extends R{constructor(){super(),this.singer="",this.queue=[]}connectedCallback(){super.connectedCallback(),this._load(),this._interval=setInterval(()=>this._load(),5e3)}disconnectedCallback(){clearInterval(this._interval),super.disconnectedCallback()}async _load(){const t=await(await fetch("/queue")).json();this.queue=Array.isArray(t.queue)?t.queue.filter(n=>n.singer===this.singer):[]}render(){return m`
      <h3>Your Songs</h3>
      <ul aria-label="Your queued songs">
        ${this.queue.map(e=>m`<li>Song ID: ${e.videoId}</li>`)}
      </ul>
    `}}$(it,"properties",{singer:{type:String},queue:{state:!0}}),$(it,"styles",B`
    ul {
      list-style: none;
      padding: 0;
    }
  `);customElements.define("guest-queue-view",it);class rt extends R{constructor(){super(),this.singer="",this.songs=[]}connectedCallback(){super.connectedCallback(),this._load()}_storageKey(){return`karaoke-mn-book-${this.singer}`}_load(){const e=localStorage.getItem(this._storageKey());this.songs=e?JSON.parse(e):[]}_save(){localStorage.setItem(this._storageKey(),JSON.stringify(this.songs))}addSong(e){!e||!e.videoId||this.songs.find(t=>t.videoId===e.videoId)||(this.songs=[...this.songs,e],this._save())}_remove(e){const t=e.target.dataset.id;this.songs=this.songs.filter(n=>n.videoId!==t),this._save()}render(){return m`
      <h3>Your Songbook</h3>
      <ul>
        ${this.songs.map(e=>m`<li>
              <span>${e.title}</span>
              <button data-id=${e.videoId} @click=${this._remove}>
                Remove
              </button>
            </li>`)}
      </ul>
    `}}$(rt,"properties",{singer:{type:String},songs:{state:!0}}),$(rt,"styles",B`
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
  `);customElements.define("guest-songbook",rt);class ot extends R{constructor(){super(),this.queue=[]}render(){return m`
      <ul aria-label="Upcoming singers queue">
        ${this.queue.map(e=>m`<li>Singer: ${e.singer}, Song ID: ${e.videoId}</li>`)}
      </ul>
    `}}$(ot,"properties",{queue:{type:Array}}),$(ot,"styles",B`
    ul {
      list-style: none;
      padding: 0;
    }
  `);customElements.define("main-queue-display",ot);class mn extends R{constructor(){super(),this.videoId="",this.playing=!1}play(e){this.videoId=e,this.playing=!0}stop(){this.playing=!1}render(){return this.playing?m`<youtube-player .videoId=${this.videoId}></youtube-player>`:m``}}$(mn,"properties",{videoId:{type:String},playing:{type:Boolean}});customElements.define("interstitial-player",mn);class at extends R{constructor(){super(),this.message="",this.open=!1}show(e){this.message=e,this.open=!0}hide(){this.open=!1}render(){return m`${this.message}`}}$(at,"properties",{message:{type:String},open:{type:Boolean,reflect:!0}}),$(at,"styles",B`
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
  `);customElements.define("on-screen-announcement",at);function Zn(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var W={},Ce,Pt;function Xn(){return Pt||(Pt=1,Ce=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}),Ce}var Ae={},O={},Tt;function K(){if(Tt)return O;Tt=1;let i;const e=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];return O.getSymbolSize=function(n){if(!n)throw new Error('"version" cannot be null or undefined');if(n<1||n>40)throw new Error('"version" should be in range from 1 to 40');return n*4+17},O.getSymbolTotalCodewords=function(n){return e[n]},O.getBCHDigit=function(t){let n=0;for(;t!==0;)n++,t>>>=1;return n},O.setToSJISFunction=function(n){if(typeof n!="function")throw new Error('"toSJISFunc" is not a valid function.');i=n},O.isKanjiModeEnabled=function(){return typeof i<"u"},O.toSJIS=function(n){return i(n)},O}var Se={},Rt;function gt(){return Rt||(Rt=1,function(i){i.L={bit:1},i.M={bit:0},i.Q={bit:3},i.H={bit:2};function e(t){if(typeof t!="string")throw new Error("Param is not a string");switch(t.toLowerCase()){case"l":case"low":return i.L;case"m":case"medium":return i.M;case"q":case"quartile":return i.Q;case"h":case"high":return i.H;default:throw new Error("Unknown EC Level: "+t)}}i.isValid=function(n){return n&&typeof n.bit<"u"&&n.bit>=0&&n.bit<4},i.from=function(n,s){if(i.isValid(n))return n;try{return e(n)}catch{return s}}}(Se)),Se}var Ie,Bt;function es(){if(Bt)return Ie;Bt=1;function i(){this.buffer=[],this.length=0}return i.prototype={get:function(e){const t=Math.floor(e/8);return(this.buffer[t]>>>7-e%8&1)===1},put:function(e,t){for(let n=0;n<t;n++)this.putBit((e>>>t-n-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(e){const t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),e&&(this.buffer[t]|=128>>>this.length%8),this.length++}},Ie=i,Ie}var ke,Nt;function ts(){if(Nt)return ke;Nt=1;function i(e){if(!e||e<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=e,this.data=new Uint8Array(e*e),this.reservedBit=new Uint8Array(e*e)}return i.prototype.set=function(e,t,n,s){const r=e*this.size+t;this.data[r]=n,s&&(this.reservedBit[r]=!0)},i.prototype.get=function(e,t){return this.data[e*this.size+t]},i.prototype.xor=function(e,t,n){this.data[e*this.size+t]^=n},i.prototype.isReserved=function(e,t){return this.reservedBit[e*this.size+t]},ke=i,ke}var Pe={},Mt;function ns(){return Mt||(Mt=1,function(i){const e=K().getSymbolSize;i.getRowColCoords=function(n){if(n===1)return[];const s=Math.floor(n/7)+2,r=e(n),o=r===145?26:Math.ceil((r-13)/(2*s-2))*2,l=[r-7];for(let a=1;a<s-1;a++)l[a]=l[a-1]-o;return l.push(6),l.reverse()},i.getPositions=function(n){const s=[],r=i.getRowColCoords(n),o=r.length;for(let l=0;l<o;l++)for(let a=0;a<o;a++)l===0&&a===0||l===0&&a===o-1||l===o-1&&a===0||s.push([r[l],r[a]]);return s}}(Pe)),Pe}var Te={},qt;function ss(){if(qt)return Te;qt=1;const i=K().getSymbolSize,e=7;return Te.getPositions=function(n){const s=i(n);return[[0,0],[s-e,0],[0,s-e]]},Te}var Re={},Ut;function is(){return Ut||(Ut=1,function(i){i.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};const e={N1:3,N2:3,N3:40,N4:10};i.isValid=function(s){return s!=null&&s!==""&&!isNaN(s)&&s>=0&&s<=7},i.from=function(s){return i.isValid(s)?parseInt(s,10):void 0},i.getPenaltyN1=function(s){const r=s.size;let o=0,l=0,a=0,u=null,c=null;for(let d=0;d<r;d++){l=a=0,u=c=null;for(let f=0;f<r;f++){let h=s.get(d,f);h===u?l++:(l>=5&&(o+=e.N1+(l-5)),u=h,l=1),h=s.get(f,d),h===c?a++:(a>=5&&(o+=e.N1+(a-5)),c=h,a=1)}l>=5&&(o+=e.N1+(l-5)),a>=5&&(o+=e.N1+(a-5))}return o},i.getPenaltyN2=function(s){const r=s.size;let o=0;for(let l=0;l<r-1;l++)for(let a=0;a<r-1;a++){const u=s.get(l,a)+s.get(l,a+1)+s.get(l+1,a)+s.get(l+1,a+1);(u===4||u===0)&&o++}return o*e.N2},i.getPenaltyN3=function(s){const r=s.size;let o=0,l=0,a=0;for(let u=0;u<r;u++){l=a=0;for(let c=0;c<r;c++)l=l<<1&2047|s.get(u,c),c>=10&&(l===1488||l===93)&&o++,a=a<<1&2047|s.get(c,u),c>=10&&(a===1488||a===93)&&o++}return o*e.N3},i.getPenaltyN4=function(s){let r=0;const o=s.data.length;for(let a=0;a<o;a++)r+=s.data[a];return Math.abs(Math.ceil(r*100/o/5)-10)*e.N4};function t(n,s,r){switch(n){case i.Patterns.PATTERN000:return(s+r)%2===0;case i.Patterns.PATTERN001:return s%2===0;case i.Patterns.PATTERN010:return r%3===0;case i.Patterns.PATTERN011:return(s+r)%3===0;case i.Patterns.PATTERN100:return(Math.floor(s/2)+Math.floor(r/3))%2===0;case i.Patterns.PATTERN101:return s*r%2+s*r%3===0;case i.Patterns.PATTERN110:return(s*r%2+s*r%3)%2===0;case i.Patterns.PATTERN111:return(s*r%3+(s+r)%2)%2===0;default:throw new Error("bad maskPattern:"+n)}}i.applyMask=function(s,r){const o=r.size;for(let l=0;l<o;l++)for(let a=0;a<o;a++)r.isReserved(a,l)||r.xor(a,l,t(s,a,l))},i.getBestMask=function(s,r){const o=Object.keys(i.Patterns).length;let l=0,a=1/0;for(let u=0;u<o;u++){r(u),i.applyMask(u,s);const c=i.getPenaltyN1(s)+i.getPenaltyN2(s)+i.getPenaltyN3(s)+i.getPenaltyN4(s);i.applyMask(u,s),c<a&&(a=c,l=u)}return l}}(Re)),Re}var de={},Lt;function yn(){if(Lt)return de;Lt=1;const i=gt(),e=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],t=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];return de.getBlocksCount=function(s,r){switch(r){case i.L:return e[(s-1)*4+0];case i.M:return e[(s-1)*4+1];case i.Q:return e[(s-1)*4+2];case i.H:return e[(s-1)*4+3];default:return}},de.getTotalCodewordsCount=function(s,r){switch(r){case i.L:return t[(s-1)*4+0];case i.M:return t[(s-1)*4+1];case i.Q:return t[(s-1)*4+2];case i.H:return t[(s-1)*4+3];default:return}},de}var Be={},ne={},xt;function rs(){if(xt)return ne;xt=1;const i=new Uint8Array(512),e=new Uint8Array(256);return function(){let n=1;for(let s=0;s<255;s++)i[s]=n,e[n]=s,n<<=1,n&256&&(n^=285);for(let s=255;s<512;s++)i[s]=i[s-255]}(),ne.log=function(n){if(n<1)throw new Error("log("+n+")");return e[n]},ne.exp=function(n){return i[n]},ne.mul=function(n,s){return n===0||s===0?0:i[e[n]+e[s]]},ne}var jt;function os(){return jt||(jt=1,function(i){const e=rs();i.mul=function(n,s){const r=new Uint8Array(n.length+s.length-1);for(let o=0;o<n.length;o++)for(let l=0;l<s.length;l++)r[o+l]^=e.mul(n[o],s[l]);return r},i.mod=function(n,s){let r=new Uint8Array(n);for(;r.length-s.length>=0;){const o=r[0];for(let a=0;a<s.length;a++)r[a]^=e.mul(s[a],o);let l=0;for(;l<r.length&&r[l]===0;)l++;r=r.slice(l)}return r},i.generateECPolynomial=function(n){let s=new Uint8Array([1]);for(let r=0;r<n;r++)s=i.mul(s,new Uint8Array([1,e.exp(r)]));return s}}(Be)),Be}var Ne,Ot;function as(){if(Ot)return Ne;Ot=1;const i=os();function e(t){this.genPoly=void 0,this.degree=t,this.degree&&this.initialize(this.degree)}return e.prototype.initialize=function(n){this.degree=n,this.genPoly=i.generateECPolynomial(this.degree)},e.prototype.encode=function(n){if(!this.genPoly)throw new Error("Encoder not initialized");const s=new Uint8Array(n.length+this.degree);s.set(n);const r=i.mod(s,this.genPoly),o=this.degree-r.length;if(o>0){const l=new Uint8Array(this.degree);return l.set(r,o),l}return r},Ne=e,Ne}var Me={},qe={},Ue={},Dt;function bn(){return Dt||(Dt=1,Ue.isValid=function(e){return!isNaN(e)&&e>=1&&e<=40}),Ue}var U={},Ht;function vn(){if(Ht)return U;Ht=1;const i="[0-9]+",e="[A-Z $%*+\\-./:]+";let t="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";t=t.replace(/u/g,"\\u");const n="(?:(?![A-Z0-9 $%*+\\-./:]|"+t+`)(?:.|[\r
]))+`;U.KANJI=new RegExp(t,"g"),U.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g"),U.BYTE=new RegExp(n,"g"),U.NUMERIC=new RegExp(i,"g"),U.ALPHANUMERIC=new RegExp(e,"g");const s=new RegExp("^"+t+"$"),r=new RegExp("^"+i+"$"),o=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");return U.testKanji=function(a){return s.test(a)},U.testNumeric=function(a){return r.test(a)},U.testAlphanumeric=function(a){return o.test(a)},U}var zt;function Y(){return zt||(zt=1,function(i){const e=bn(),t=vn();i.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]},i.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]},i.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]},i.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]},i.MIXED={bit:-1},i.getCharCountIndicator=function(r,o){if(!r.ccBits)throw new Error("Invalid mode: "+r);if(!e.isValid(o))throw new Error("Invalid version: "+o);return o>=1&&o<10?r.ccBits[0]:o<27?r.ccBits[1]:r.ccBits[2]},i.getBestModeForData=function(r){return t.testNumeric(r)?i.NUMERIC:t.testAlphanumeric(r)?i.ALPHANUMERIC:t.testKanji(r)?i.KANJI:i.BYTE},i.toString=function(r){if(r&&r.id)return r.id;throw new Error("Invalid mode")},i.isValid=function(r){return r&&r.bit&&r.ccBits};function n(s){if(typeof s!="string")throw new Error("Param is not a string");switch(s.toLowerCase()){case"numeric":return i.NUMERIC;case"alphanumeric":return i.ALPHANUMERIC;case"kanji":return i.KANJI;case"byte":return i.BYTE;default:throw new Error("Unknown mode: "+s)}}i.from=function(r,o){if(i.isValid(r))return r;try{return n(r)}catch{return o}}}(qe)),qe}var Ft;function ls(){return Ft||(Ft=1,function(i){const e=K(),t=yn(),n=gt(),s=Y(),r=bn(),o=7973,l=e.getBCHDigit(o);function a(f,h,E){for(let P=1;P<=40;P++)if(h<=i.getCapacity(P,E,f))return P}function u(f,h){return s.getCharCountIndicator(f,h)+4}function c(f,h){let E=0;return f.forEach(function(P){const N=u(P.mode,h);E+=N+P.getBitsLength()}),E}function d(f,h){for(let E=1;E<=40;E++)if(c(f,E)<=i.getCapacity(E,h,s.MIXED))return E}i.from=function(h,E){return r.isValid(h)?parseInt(h,10):E},i.getCapacity=function(h,E,P){if(!r.isValid(h))throw new Error("Invalid QR Code version");typeof P>"u"&&(P=s.BYTE);const N=e.getSymbolTotalCodewords(h),S=t.getTotalCodewordsCount(h,E),T=(N-S)*8;if(P===s.MIXED)return T;const I=T-u(P,h);switch(P){case s.NUMERIC:return Math.floor(I/10*3);case s.ALPHANUMERIC:return Math.floor(I/11*2);case s.KANJI:return Math.floor(I/13);case s.BYTE:default:return Math.floor(I/8)}},i.getBestVersionForData=function(h,E){let P;const N=n.from(E,n.M);if(Array.isArray(h)){if(h.length>1)return d(h,N);if(h.length===0)return 1;P=h[0]}else P=h;return a(P.mode,P.getLength(),N)},i.getEncodedBits=function(h){if(!r.isValid(h)||h<7)throw new Error("Invalid QR Code version");let E=h<<12;for(;e.getBCHDigit(E)-l>=0;)E^=o<<e.getBCHDigit(E)-l;return h<<12|E}}(Me)),Me}var Le={},Jt;function us(){if(Jt)return Le;Jt=1;const i=K(),e=1335,t=21522,n=i.getBCHDigit(e);return Le.getEncodedBits=function(r,o){const l=r.bit<<3|o;let a=l<<10;for(;i.getBCHDigit(a)-n>=0;)a^=e<<i.getBCHDigit(a)-n;return(l<<10|a)^t},Le}var xe={},je,Vt;function cs(){if(Vt)return je;Vt=1;const i=Y();function e(t){this.mode=i.NUMERIC,this.data=t.toString()}return e.getBitsLength=function(n){return 10*Math.floor(n/3)+(n%3?n%3*3+1:0)},e.prototype.getLength=function(){return this.data.length},e.prototype.getBitsLength=function(){return e.getBitsLength(this.data.length)},e.prototype.write=function(n){let s,r,o;for(s=0;s+3<=this.data.length;s+=3)r=this.data.substr(s,3),o=parseInt(r,10),n.put(o,10);const l=this.data.length-s;l>0&&(r=this.data.substr(s),o=parseInt(r,10),n.put(o,l*3+1))},je=e,je}var Oe,Kt;function ds(){if(Kt)return Oe;Kt=1;const i=Y(),e=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function t(n){this.mode=i.ALPHANUMERIC,this.data=n}return t.getBitsLength=function(s){return 11*Math.floor(s/2)+6*(s%2)},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(s){let r;for(r=0;r+2<=this.data.length;r+=2){let o=e.indexOf(this.data[r])*45;o+=e.indexOf(this.data[r+1]),s.put(o,11)}this.data.length%2&&s.put(e.indexOf(this.data[r]),6)},Oe=t,Oe}var De,Yt;function hs(){if(Yt)return De;Yt=1;const i=Y();function e(t){this.mode=i.BYTE,typeof t=="string"?this.data=new TextEncoder().encode(t):this.data=new Uint8Array(t)}return e.getBitsLength=function(n){return n*8},e.prototype.getLength=function(){return this.data.length},e.prototype.getBitsLength=function(){return e.getBitsLength(this.data.length)},e.prototype.write=function(t){for(let n=0,s=this.data.length;n<s;n++)t.put(this.data[n],8)},De=e,De}var He,Qt;function fs(){if(Qt)return He;Qt=1;const i=Y(),e=K();function t(n){this.mode=i.KANJI,this.data=n}return t.getBitsLength=function(s){return s*13},t.prototype.getLength=function(){return this.data.length},t.prototype.getBitsLength=function(){return t.getBitsLength(this.data.length)},t.prototype.write=function(n){let s;for(s=0;s<this.data.length;s++){let r=e.toSJIS(this.data[s]);if(r>=33088&&r<=40956)r-=33088;else if(r>=57408&&r<=60351)r-=49472;else throw new Error("Invalid SJIS character: "+this.data[s]+`
Make sure your charset is UTF-8`);r=(r>>>8&255)*192+(r&255),n.put(r,13)}},He=t,He}var ze={exports:{}},Wt;function gs(){return Wt||(Wt=1,function(i){var e={single_source_shortest_paths:function(t,n,s){var r={},o={};o[n]=0;var l=e.PriorityQueue.make();l.push(n,0);for(var a,u,c,d,f,h,E,P,N;!l.empty();){a=l.pop(),u=a.value,d=a.cost,f=t[u]||{};for(c in f)f.hasOwnProperty(c)&&(h=f[c],E=d+h,P=o[c],N=typeof o[c]>"u",(N||P>E)&&(o[c]=E,l.push(c,E),r[c]=u))}if(typeof s<"u"&&typeof o[s]>"u"){var S=["Could not find a path from ",n," to ",s,"."].join("");throw new Error(S)}return r},extract_shortest_path_from_predecessor_list:function(t,n){for(var s=[],r=n;r;)s.push(r),t[r],r=t[r];return s.reverse(),s},find_path:function(t,n,s){var r=e.single_source_shortest_paths(t,n,s);return e.extract_shortest_path_from_predecessor_list(r,s)},PriorityQueue:{make:function(t){var n=e.PriorityQueue,s={},r;t=t||{};for(r in n)n.hasOwnProperty(r)&&(s[r]=n[r]);return s.queue=[],s.sorter=t.sorter||n.default_sorter,s},default_sorter:function(t,n){return t.cost-n.cost},push:function(t,n){var s={value:t,cost:n};this.queue.push(s),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};i.exports=e}(ze)),ze.exports}var Gt;function ps(){return Gt||(Gt=1,function(i){const e=Y(),t=cs(),n=ds(),s=hs(),r=fs(),o=vn(),l=K(),a=gs();function u(S){return unescape(encodeURIComponent(S)).length}function c(S,T,I){const C=[];let M;for(;(M=S.exec(I))!==null;)C.push({data:M[0],index:M.index,mode:T,length:M[0].length});return C}function d(S){const T=c(o.NUMERIC,e.NUMERIC,S),I=c(o.ALPHANUMERIC,e.ALPHANUMERIC,S);let C,M;return l.isKanjiModeEnabled()?(C=c(o.BYTE,e.BYTE,S),M=c(o.KANJI,e.KANJI,S)):(C=c(o.BYTE_KANJI,e.BYTE,S),M=[]),T.concat(I,C,M).sort(function(w,v){return w.index-v.index}).map(function(w){return{data:w.data,mode:w.mode,length:w.length}})}function f(S,T){switch(T){case e.NUMERIC:return t.getBitsLength(S);case e.ALPHANUMERIC:return n.getBitsLength(S);case e.KANJI:return r.getBitsLength(S);case e.BYTE:return s.getBitsLength(S)}}function h(S){return S.reduce(function(T,I){const C=T.length-1>=0?T[T.length-1]:null;return C&&C.mode===I.mode?(T[T.length-1].data+=I.data,T):(T.push(I),T)},[])}function E(S){const T=[];for(let I=0;I<S.length;I++){const C=S[I];switch(C.mode){case e.NUMERIC:T.push([C,{data:C.data,mode:e.ALPHANUMERIC,length:C.length},{data:C.data,mode:e.BYTE,length:C.length}]);break;case e.ALPHANUMERIC:T.push([C,{data:C.data,mode:e.BYTE,length:C.length}]);break;case e.KANJI:T.push([C,{data:C.data,mode:e.BYTE,length:u(C.data)}]);break;case e.BYTE:T.push([{data:C.data,mode:e.BYTE,length:u(C.data)}])}}return T}function P(S,T){const I={},C={start:{}};let M=["start"];for(let p=0;p<S.length;p++){const w=S[p],v=[];for(let g=0;g<w.length;g++){const A=w[g],y=""+p+g;v.push(y),I[y]={node:A,lastCount:0},C[y]={};for(let _=0;_<M.length;_++){const b=M[_];I[b]&&I[b].node.mode===A.mode?(C[b][y]=f(I[b].lastCount+A.length,A.mode)-f(I[b].lastCount,A.mode),I[b].lastCount+=A.length):(I[b]&&(I[b].lastCount=A.length),C[b][y]=f(A.length,A.mode)+4+e.getCharCountIndicator(A.mode,T))}}M=v}for(let p=0;p<M.length;p++)C[M[p]].end=0;return{map:C,table:I}}function N(S,T){let I;const C=e.getBestModeForData(S);if(I=e.from(T,C),I!==e.BYTE&&I.bit<C.bit)throw new Error('"'+S+'" cannot be encoded with mode '+e.toString(I)+`.
 Suggested mode is: `+e.toString(C));switch(I===e.KANJI&&!l.isKanjiModeEnabled()&&(I=e.BYTE),I){case e.NUMERIC:return new t(S);case e.ALPHANUMERIC:return new n(S);case e.KANJI:return new r(S);case e.BYTE:return new s(S)}}i.fromArray=function(T){return T.reduce(function(I,C){return typeof C=="string"?I.push(N(C,null)):C.data&&I.push(N(C.data,C.mode)),I},[])},i.fromString=function(T,I){const C=d(T,l.isKanjiModeEnabled()),M=E(C),p=P(M,I),w=a.find_path(p.map,"start","end"),v=[];for(let g=1;g<w.length-1;g++)v.push(p.table[w[g]].node);return i.fromArray(h(v))},i.rawSplit=function(T){return i.fromArray(d(T,l.isKanjiModeEnabled()))}}(xe)),xe}var Zt;function ms(){if(Zt)return Ae;Zt=1;const i=K(),e=gt(),t=es(),n=ts(),s=ns(),r=ss(),o=is(),l=yn(),a=as(),u=ls(),c=us(),d=Y(),f=ps();function h(p,w){const v=p.size,g=r.getPositions(w);for(let A=0;A<g.length;A++){const y=g[A][0],_=g[A][1];for(let b=-1;b<=7;b++)if(!(y+b<=-1||v<=y+b))for(let k=-1;k<=7;k++)_+k<=-1||v<=_+k||(b>=0&&b<=6&&(k===0||k===6)||k>=0&&k<=6&&(b===0||b===6)||b>=2&&b<=4&&k>=2&&k<=4?p.set(y+b,_+k,!0,!0):p.set(y+b,_+k,!1,!0))}}function E(p){const w=p.size;for(let v=8;v<w-8;v++){const g=v%2===0;p.set(v,6,g,!0),p.set(6,v,g,!0)}}function P(p,w){const v=s.getPositions(w);for(let g=0;g<v.length;g++){const A=v[g][0],y=v[g][1];for(let _=-2;_<=2;_++)for(let b=-2;b<=2;b++)_===-2||_===2||b===-2||b===2||_===0&&b===0?p.set(A+_,y+b,!0,!0):p.set(A+_,y+b,!1,!0)}}function N(p,w){const v=p.size,g=u.getEncodedBits(w);let A,y,_;for(let b=0;b<18;b++)A=Math.floor(b/3),y=b%3+v-8-3,_=(g>>b&1)===1,p.set(A,y,_,!0),p.set(y,A,_,!0)}function S(p,w,v){const g=p.size,A=c.getEncodedBits(w,v);let y,_;for(y=0;y<15;y++)_=(A>>y&1)===1,y<6?p.set(y,8,_,!0):y<8?p.set(y+1,8,_,!0):p.set(g-15+y,8,_,!0),y<8?p.set(8,g-y-1,_,!0):y<9?p.set(8,15-y-1+1,_,!0):p.set(8,15-y-1,_,!0);p.set(g-8,8,1,!0)}function T(p,w){const v=p.size;let g=-1,A=v-1,y=7,_=0;for(let b=v-1;b>0;b-=2)for(b===6&&b--;;){for(let k=0;k<2;k++)if(!p.isReserved(A,b-k)){let j=!1;_<w.length&&(j=(w[_]>>>y&1)===1),p.set(A,b-k,j),y--,y===-1&&(_++,y=7)}if(A+=g,A<0||v<=A){A-=g,g=-g;break}}}function I(p,w,v){const g=new t;v.forEach(function(k){g.put(k.mode.bit,4),g.put(k.getLength(),d.getCharCountIndicator(k.mode,p)),k.write(g)});const A=i.getSymbolTotalCodewords(p),y=l.getTotalCodewordsCount(p,w),_=(A-y)*8;for(g.getLengthInBits()+4<=_&&g.put(0,4);g.getLengthInBits()%8!==0;)g.putBit(0);const b=(_-g.getLengthInBits())/8;for(let k=0;k<b;k++)g.put(k%2?17:236,8);return C(g,p,w)}function C(p,w,v){const g=i.getSymbolTotalCodewords(w),A=l.getTotalCodewordsCount(w,v),y=g-A,_=l.getBlocksCount(w,v),b=g%_,k=_-b,j=Math.floor(g/_),ee=Math.floor(y/_),Sn=ee+1,pt=j-ee,In=new a(pt);let me=0;const ue=new Array(_),mt=new Array(_);let ye=0;const kn=new Uint8Array(p.buffer);for(let Q=0;Q<_;Q++){const ve=Q<k?ee:Sn;ue[Q]=kn.slice(me,me+ve),mt[Q]=In.encode(ue[Q]),me+=ve,ye=Math.max(ye,ve)}const be=new Uint8Array(g);let yt=0,L,x;for(L=0;L<ye;L++)for(x=0;x<_;x++)L<ue[x].length&&(be[yt++]=ue[x][L]);for(L=0;L<pt;L++)for(x=0;x<_;x++)be[yt++]=mt[x][L];return be}function M(p,w,v,g){let A;if(Array.isArray(p))A=f.fromArray(p);else if(typeof p=="string"){let j=w;if(!j){const ee=f.rawSplit(p);j=u.getBestVersionForData(ee,v)}A=f.fromString(p,j||40)}else throw new Error("Invalid data");const y=u.getBestVersionForData(A,v);if(!y)throw new Error("The amount of data is too big to be stored in a QR Code");if(!w)w=y;else if(w<y)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+y+`.
`);const _=I(w,v,A),b=i.getSymbolSize(w),k=new n(b);return h(k,w),E(k),P(k,w),S(k,v,0),w>=7&&N(k,w),T(k,_),isNaN(g)&&(g=o.getBestMask(k,S.bind(null,k,v))),o.applyMask(g,k),S(k,v,g),{modules:k,version:w,errorCorrectionLevel:v,maskPattern:g,segments:A}}return Ae.create=function(w,v){if(typeof w>"u"||w==="")throw new Error("No input text");let g=e.M,A,y;return typeof v<"u"&&(g=e.from(v.errorCorrectionLevel,e.M),A=u.from(v.version),y=o.from(v.maskPattern),v.toSJISFunc&&i.setToSJISFunction(v.toSJISFunc)),M(w,A,g,y)},Ae}var Fe={},Je={},Xt;function wn(){return Xt||(Xt=1,function(i){function e(t){if(typeof t=="number"&&(t=t.toString()),typeof t!="string")throw new Error("Color should be defined as hex string");let n=t.slice().replace("#","").split("");if(n.length<3||n.length===5||n.length>8)throw new Error("Invalid hex color: "+t);(n.length===3||n.length===4)&&(n=Array.prototype.concat.apply([],n.map(function(r){return[r,r]}))),n.length===6&&n.push("F","F");const s=parseInt(n.join(""),16);return{r:s>>24&255,g:s>>16&255,b:s>>8&255,a:s&255,hex:"#"+n.slice(0,6).join("")}}i.getOptions=function(n){n||(n={}),n.color||(n.color={});const s=typeof n.margin>"u"||n.margin===null||n.margin<0?4:n.margin,r=n.width&&n.width>=21?n.width:void 0,o=n.scale||4;return{width:r,scale:r?4:o,margin:s,color:{dark:e(n.color.dark||"#000000ff"),light:e(n.color.light||"#ffffffff")},type:n.type,rendererOpts:n.rendererOpts||{}}},i.getScale=function(n,s){return s.width&&s.width>=n+s.margin*2?s.width/(n+s.margin*2):s.scale},i.getImageWidth=function(n,s){const r=i.getScale(n,s);return Math.floor((n+s.margin*2)*r)},i.qrToImageData=function(n,s,r){const o=s.modules.size,l=s.modules.data,a=i.getScale(o,r),u=Math.floor((o+r.margin*2)*a),c=r.margin*a,d=[r.color.light,r.color.dark];for(let f=0;f<u;f++)for(let h=0;h<u;h++){let E=(f*u+h)*4,P=r.color.light;if(f>=c&&h>=c&&f<u-c&&h<u-c){const N=Math.floor((f-c)/a),S=Math.floor((h-c)/a);P=d[l[N*o+S]?1:0]}n[E++]=P.r,n[E++]=P.g,n[E++]=P.b,n[E]=P.a}}}(Je)),Je}var en;function ys(){return en||(en=1,function(i){const e=wn();function t(s,r,o){s.clearRect(0,0,r.width,r.height),r.style||(r.style={}),r.height=o,r.width=o,r.style.height=o+"px",r.style.width=o+"px"}function n(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}i.render=function(r,o,l){let a=l,u=o;typeof a>"u"&&(!o||!o.getContext)&&(a=o,o=void 0),o||(u=n()),a=e.getOptions(a);const c=e.getImageWidth(r.modules.size,a),d=u.getContext("2d"),f=d.createImageData(c,c);return e.qrToImageData(f.data,r,a),t(d,u,c),d.putImageData(f,0,0),u},i.renderToDataURL=function(r,o,l){let a=l;typeof a>"u"&&(!o||!o.getContext)&&(a=o,o=void 0),a||(a={});const u=i.render(r,o,a),c=a.type||"image/png",d=a.rendererOpts||{};return u.toDataURL(c,d.quality)}}(Fe)),Fe}var Ve={},tn;function bs(){if(tn)return Ve;tn=1;const i=wn();function e(s,r){const o=s.a/255,l=r+'="'+s.hex+'"';return o<1?l+" "+r+'-opacity="'+o.toFixed(2).slice(1)+'"':l}function t(s,r,o){let l=s+r;return typeof o<"u"&&(l+=" "+o),l}function n(s,r,o){let l="",a=0,u=!1,c=0;for(let d=0;d<s.length;d++){const f=Math.floor(d%r),h=Math.floor(d/r);!f&&!u&&(u=!0),s[d]?(c++,d>0&&f>0&&s[d-1]||(l+=u?t("M",f+o,.5+h+o):t("m",a,0),a=0,u=!1),f+1<r&&s[d+1]||(l+=t("h",c),c=0)):a++}return l}return Ve.render=function(r,o,l){const a=i.getOptions(o),u=r.modules.size,c=r.modules.data,d=u+a.margin*2,f=a.color.light.a?"<path "+e(a.color.light,"fill")+' d="M0 0h'+d+"v"+d+'H0z"/>':"",h="<path "+e(a.color.dark,"stroke")+' d="'+n(c,u,a.margin)+'"/>',E='viewBox="0 0 '+d+" "+d+'"',N='<svg xmlns="http://www.w3.org/2000/svg" '+(a.width?'width="'+a.width+'" height="'+a.width+'" ':"")+E+' shape-rendering="crispEdges">'+f+h+`</svg>
`;return typeof l=="function"&&l(null,N),N},Ve}var nn;function vs(){if(nn)return W;nn=1;const i=Xn(),e=ms(),t=ys(),n=bs();function s(r,o,l,a,u){const c=[].slice.call(arguments,1),d=c.length,f=typeof c[d-1]=="function";if(!f&&!i())throw new Error("Callback required as last argument");if(f){if(d<2)throw new Error("Too few arguments provided");d===2?(u=l,l=o,o=a=void 0):d===3&&(o.getContext&&typeof u>"u"?(u=a,a=void 0):(u=a,a=l,l=o,o=void 0))}else{if(d<1)throw new Error("Too few arguments provided");return d===1?(l=o,o=a=void 0):d===2&&!o.getContext&&(a=l,l=o,o=void 0),new Promise(function(h,E){try{const P=e.create(l,a);h(r(P,o,a))}catch(P){E(P)}})}try{const h=e.create(l,a);u(null,r(h,o,a))}catch(h){u(h)}}return W.create=e.create,W.toCanvas=s.bind(null,t.render),W.toDataURL=s.bind(null,t.renderToDataURL),W.toString=s.bind(null,function(r,o,l){return n.render(r,l)}),W}var ws=vs();const _s=Zn(ws);class _n extends R{constructor(){super(),this.text="",this.dataUrl=""}updated(e){e.has("text")&&_s.toDataURL(this.text||"").then(t=>{this.dataUrl=t}).catch(()=>{this.dataUrl=""})}render(){return this.dataUrl?m`<img src="${this.dataUrl}" alt="QR" />`:""}}$(_n,"properties",{text:{type:String},dataUrl:{state:!0}});customElements.define("qr-code-display",_n);class $n extends R{render(){return m`
      <div>
        <p>Room Code: ${this.code}</p>
        ${this.qrCode?m`<img src="${this.qrCode}" alt="QR Code" />`:""}
      </div>
    `}}$($n,"properties",{code:{type:String},qrCode:{type:String}});customElements.define("session-info-display",$n);class lt extends R{constructor(){super(),this.queue=[],this.sessionCode="",this.qrCode=""}connectedCallback(){super.connectedCallback(),this._load(),this._interval=setInterval(()=>this._load(),5e3)}disconnectedCallback(){clearInterval(this._interval),super.disconnectedCallback()}async _load(){const[e,t]=await Promise.all([fetch("/queue"),fetch("/sessions/current")]),n=await e.json();if(this.queue=n.queue||[],t.ok){const s=await t.json();this.sessionCode=s.code,this.qrCode=s.qrCode}}render(){const e=this.queue[0];return m`
      <youtube-player
        .videoId=${e?e.videoId:""}
      ></youtube-player>
      <session-info-display
        .code=${this.sessionCode}
        .qrCode=${this.qrCode}
      ></session-info-display>
      <main-queue-display .queue=${this.queue.slice(1,6)}></main-queue-display>
      <interstitial-player id="interstitial"></interstitial-player>
      <on-screen-announcement id="announcement"></on-screen-announcement>
    `}}$(lt,"properties",{queue:{state:!0},sessionCode:{state:!0},qrCode:{state:!0}}),$(lt,"styles",B`
    :host {
      display: block;
      text-align: center;
    }
  `);customElements.define("main-screen-view",lt);class ut extends R{constructor(){super(),this.theme=localStorage.getItem("theme")||"light"}toggleTheme(){this.theme=this.theme==="light"?"dark":"light",localStorage.setItem("theme",this.theme),document.body.setAttribute("data-theme",this.theme)}render(){return m`
      <h2>Settings / Profile</h2>
      <div>
        <label>Theme: ${this.theme}</label>
        <button @click=${this.toggleTheme}>Toggle Theme</button>
      </div>
      <!-- Add more preferences here -->
    `}}$(ut,"properties",{theme:{type:String}}),$(ut,"styles",B`
    :host {
      display: block;
      padding: 1rem;
    }
    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
    }
  `);customElements.define("settings-profile",ut);class En extends R{render(){return m`
      <h2>Welcome to Karaoke MN!</h2>
      <p>
        This app helps you manage your karaoke sessions. As a KJ, you can create
        sessions and manage the queue. As a guest, you can join sessions and
        request songs.
      </p>
      <button @click=${this._completeOnboarding}>Got It!</button>
    `}_completeOnboarding(){this.dispatchEvent(new CustomEvent("onboarding-complete"))}}$(En,"styles",B`
    :host {
      display: block;
      padding: 20px;
      background-color: #f0f0f0;
      border-radius: 8px;
      text-align: center;
      max-width: 500px;
      margin: 50px auto;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h2 {
      color: #333;
      margin-bottom: 15px;
    }
    p {
      color: #666;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    button {
      background-color: #00bcd4;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }
    button:hover {
      background-color: #0097a7;
    }
  `);customElements.define("onboarding-flow",En);class Cn extends R{constructor(){super(),this.loggedIn=!1}_onLogin(){this.loggedIn=!0}render(){return this.loggedIn?m`<kj-dashboard></kj-dashboard>`:m`<kj-login @login=${this._onLogin}></kj-login>`}}$(Cn,"properties",{loggedIn:{state:!0}});customElements.define("kj-view",Cn);class An extends R{constructor(){super(),this.joined=!1,this.singer="",this.code=""}_onSaveSong(e){var n;const t=(n=this.renderRoot)==null?void 0:n.querySelector("guest-songbook");t==null||t.addSong(e.detail)}_onJoined(e){const{name:t,code:n}=e.detail;this.joined=!0,this.singer=t,this.code=n}render(){return this.joined?m`
          <guest-song-search
            .singer=${this.singer}
            @save-song=${this._onSaveSong}
          ></guest-song-search>
          <guest-songbook .singer=${this.singer}></guest-songbook>
          <guest-queue-view .singer=${this.singer}></guest-queue-view>
        `:m`<guest-join-session
          @session-joined=${this._onJoined}
        ></guest-join-session>`}}$(An,"properties",{joined:{state:!0},singer:{state:!0},code:{state:!0}});customElements.define("guest-view",An);class ct extends R{constructor(){super(),this.route=this._getRoute(),this.onboardingComplete=localStorage.getItem("onboardingComplete")==="true",this._onPopState=()=>{this.route=this._getRoute()}}connectedCallback(){super.connectedCallback(),window.addEventListener("popstate",this._onPopState)}disconnectedCallback(){window.removeEventListener("popstate",this._onPopState),super.disconnectedCallback()}_getRoute(){const e=window.location.pathname;return e==="/"||e.startsWith("/guest")?"guest":e.startsWith("/admin")?"kj":e.startsWith("/main")?"main":e.startsWith("/settings")?"settings":"guest"}_navigate(e){window.history.pushState({},"",e),this.route=this._getRoute()}_handleOnboardingComplete(){this.onboardingComplete=!0,localStorage.setItem("onboardingComplete","true")}render(){return m`
      ${this.onboardingComplete?m`
            <nav>
              <a @click=${()=>this._navigate("/admin")}>KJ</a>
              <a @click=${()=>this._navigate("/")}>Guest</a>
              <a @click=${()=>this._navigate("/main")}>Main</a>
              <a @click=${()=>this._navigate("/settings")}>Settings</a>
            </nav>
            ${this.route==="kj"?m`<kj-view></kj-view>`:this.route==="guest"?m`<guest-view></guest-view>`:this.route==="main"?m`<main-screen-view></main-screen-view>`:m`<settings-profile></settings-profile>`}
          `:m`<onboarding-flow @onboarding-complete=${this._handleOnboardingComplete}></onboarding-flow>`}
    `}}$(ct,"properties",{route:{state:!0},onboardingComplete:{state:!0}}),$(ct,"styles",B`
    nav {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    nav a {
      cursor: pointer;
      color: #00bcd4;
    }
  `);customElements.define("karaoke-app",ct);
