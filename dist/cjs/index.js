"use strict";var b=Object.create;var o=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var P=Object.getOwnPropertyNames;var I=Object.getPrototypeOf,T=Object.prototype.hasOwnProperty;var $=(a,e)=>{for(var r in e)o(a,r,{get:e[r],enumerable:!0})},y=(a,e,r,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let t of P(e))!T.call(a,t)&&t!==r&&o(a,t,{get:()=>e[t],enumerable:!(i=p(e,t))||i.enumerable});return a};var g=(a,e,r)=>(r=a!=null?b(I(a)):{},y(e||!a||!a.__esModule?o(r,"default",{value:a,enumerable:!0}):r,a)),E=a=>y(o({},"__esModule",{value:!0}),a);var U={};$(U,{BillingLogixClient:()=>w,default:()=>k});module.exports=E(U);var s=class extends Error{constructor(e,r){super(e),this.name=this.constructor.name,typeof r<"u"&&(this.data=r)}};s.prototype.toJSON=function(a=!1){let e=a===!0?{stack:this.stack}:{};return typeof this.data>"u"?{name:this.name,message:this.message,...e}:{name:this.name,message:this.message,data:this.data,...e}};var q=g(require("node-fetch"),1),v=g(require("jsonwebtoken"),1);var A=["GET","POST","PUT","PATCH","DELETE"],R={version:"v1",timeout:1e4,headers:{},debug:!1},w=class{#r;#s;#n;#h;#u;#i;#a;constructor(e,r,i,t={}){let n={acccountSub:/^(?![-])[a-z0-9-]+(?<![-])$/gm,accessKey:/^[a-zA-Z0-9]+$/,secretKey:/^[a-zA-Z0-9_=\-\/]+$/};if(typeof e!="string"||!n.acccountSub.test(e))throw new s(`Missing or invalid account subdomain: ${e}`);if(typeof r!="string"||!n.accessKey.test(r))throw new s(`Missing or invalid access key: ${r}`);if(typeof i!="string"||!n.secretKey.test(i))throw new s(`Missing or invalid secret key: ${i}`);if(typeof t!="object")throw new s(`Invalid options object: ${typeof t}`,t);if(t={...R,...t},typeof t.version!="string")throw new s(`Invalid API version: ${t.version}`);if(t.version!=="v1")throw new s(`Unsupported API version: ${t.version}`);if(typeof t.timeout!="number")throw new s(`Invalid request timeout: ${t.timeout}`);if(t.timeout<1e3||t.timeout>6e4)throw new s(`Unsupported request timeout: ${t.timeout}`);if(typeof t.headers!="object")throw new s(`Invalid additional request headers: ${typeof t.headers}`,t.headers);for(let l in t.headers){if(typeof l!="string")throw new s(`Invalid request header key: ${l}`,t.headers);if(typeof t.headers[l]!="string")throw new s(`Invalid request header value: ${t.headers[l]}`,t.headers)}this.#n=t,this.#r=r,this.#s=i,this.#h=`https://${e}.billinglogix.com/api/${t.version}`,this.#u={...t.headers,"User-Agent":"BillingLogix API Client v1.0.0","Content-Type":"application/json",Accept:"application/json"},this.#i=t.timeout,this.#a=t.debug===!0}#e(){this.#a&&console.debug(...arguments)}#t(){this.#a&&console.error(...arguments)}#d(e){if(this.#r&&this.#s)e.headers.Authorization="Bearer "+v.default.sign({iss:this.#r,iat:new Date().getTime(),exp:new Date().getTime()+3e4},this.#s);else throw new s("No Authentication Data");return e}#l(e){if(typeof e!="object")return{};let r={};for(let[i,t]in e){if(typeof i!="string"||typeof t!="string"){this.#e("Invalid Header",i,t);continue}r[i.trim()]=t.trim()}return r}request(e,r){this.#e("Request Options",e,r?"Callback":"Promise");let i=globalThis.AbortController??void 0,t=i?new i:void 0,n=i?setTimeout(()=>{t.abort()},this.#i):void 0;t===void 0&&this.#e("AbortController","Not Supported");let l=new Promise((u,c)=>{if(typeof e!="object")throw this.#e("Invalid Request Options",e),new s("Invalid request options",e);if(!(e!=null&&e.method)||typeof e.method!="string")throw this.#e("Invalid Request Method",e),new s("Invalid request method",e);if(!A.includes(e.method.toUpperCase()))throw this.#e("Invalid Request Method Option",e),new s("Unsupported request method",e);if(!(e!=null&&e.path)||typeof e.path!="string"||e.path.trim().length===0||e.path.trim()==="/")throw this.#e("Invalid Request Path",e),new s("Invalid request path",e);if(typeof e.timeout<"u"&&typeof e.timeout!="number")throw this.#e("Invalid Request Timeout",e),new s("Invalid request timeout",e);if(e.timeout<1e3||e.timeout>6e4)throw this.#e("Unsupported Request Timeout",e),new s("Unsupported request timeout",e);if(typeof e.query<"u"&&typeof e.query!="object")throw this.#e("Invalid Request Query Params",e),new s("Invalid request query params",e);try{let f=e.query?`?${new URLSearchParams(e.query).toString()}`:"",d=this.#d({method:e.method,path:e.path,headers:{...this.#l(e.headers),...this.#u},timeout:e.timeout||this.#i,body:e.body?typeof e.body=="string"?e.body:JSON.stringify(e.body):null,signal:t?t.signal:null});return d.path.charAt(0)!=="/"&&(d.path=`/${d.path}`),this.#e("Fetch Options",{method:d.method,path:d.path,query:f}),(0,q.default)(`${this.#h}${d.path}${f}`,d).then(m=>{m.ok?m.json().then(h=>{this.#e("Response Success"),u(h)}).catch(h=>{this.#t("Response Parsing Error",h),c(new s("Error parsing response data",h))}):m.json().then(h=>{this.#e("Response Error",h),c(h)}).catch(h=>{this.#t("Response Parsing Failure",h),c(new s("Error parsing request failure",h))})}).catch(m=>{this.#t("Request Failure",m),c(new s("Request Failure",m))})}catch(f){throw this.#t("Unexpected Error",f),c(new s("Unexpected Error",f)),f}}).then(u=>(this.#e("Promise Success",u),n&&clearTimeout(n),r&&(this.#e("Promise Success","Callback Success"),r(null,u)),u)).catch(u=>{throw this.#e("Promise Error",u),n&&clearTimeout(n),r&&(this.#e("Promise Error","Callback Error"),r(u)),u});if(!r)return this.#e("Promise Returned","No callback"),l}get(e,r={},i){return this.request({...r,path:e,method:"GET"},i)}post(e,r,i={},t){return this.request({...i,path:e,method:"POST",body:r},t)}put(e,r,i={},t){return this.request({...i,path:e,method:"PUT",body:r},t)}patch(e,r,i={},t){return this.request({...i,path:e,method:"PATCH",body:r},t)}delete(e,r={},i){return this.request({...r,path:e,method:"DELETE"},i)}},k=w;0&&(module.exports={BillingLogixClient});
/**
 * JavaScript BillingLogix API Client
 * @module billinglogix-api
 * @license MIT
 * @version 1.0.0
 * @since 1.0.0
 * @description A simple BillingLogix API client for Node.js
 * @repository https://github.com/billinglogix/node-billinglogix-api
 */
