import * as adapter from '@astrojs/vercel/serverless/entrypoint';
import React, { createElement } from 'react';
import ReactDOM from 'react-dom/server';
import { escape } from 'html-escaper';
/* empty css                        *//* empty css                                             *//* empty css                           *//* empty css                                 */import { getHighlighter as getHighlighter$1 } from 'shiki';
/* empty css                           *//* empty css                              *//* empty css                           */import 'mime';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

/**
 * Astro passes `children` as a string of HTML, so we need
 * a wrapper `div` to render that content as VNodes.
 *
 * As a bonus, we can signal to React that this subtree is
 * entirely static and will never change via `shouldComponentUpdate`.
 */
const StaticHtml = ({ value, name }) => {
	if (!value) return null;
	return createElement('astro-slot', {
		name,
		suppressHydrationWarning: true,
		dangerouslySetInnerHTML: { __html: value },
	});
};

/**
 * This tells React to opt-out of re-rendering this subtree,
 * In addition to being a performance optimization,
 * this also allows other frameworks to attach to `children`.
 *
 * See https://preactjs.com/guide/v8/external-dom-mutations
 */
StaticHtml.shouldComponentUpdate = () => false;

const slotName$1 = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for('react.element');

function errorIsComingFromPreactComponent(err) {
	return (
		err.message &&
		(err.message.startsWith("Cannot read property '__H'") ||
			err.message.includes("(reading '__H')"))
	);
}

async function check$1(Component, props, children) {
	// Note: there are packages that do some unholy things to create "components".
	// Checking the $$typeof property catches most of these patterns.
	if (typeof Component === 'object') {
		const $$typeof = Component['$$typeof'];
		return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react');
	}
	if (typeof Component !== 'function') return false;

	if (Component.prototype != null && typeof Component.prototype.render === 'function') {
		return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
	}

	let error = null;
	let isReactComponent = false;
	function Tester(...args) {
		try {
			const vnode = Component(...args);
			if (vnode && vnode['$$typeof'] === reactTypeof) {
				isReactComponent = true;
			}
		} catch (err) {
			if (!errorIsComingFromPreactComponent(err)) {
				error = err;
			}
		}

		return React.createElement('div');
	}

	await renderToStaticMarkup$1(Tester, props, children, {});

	if (error) {
		throw error;
	}
	return isReactComponent;
}

async function getNodeWritable() {
	let nodeStreamBuiltinModuleName = 'stream';
	let { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName);
	return Writable;
}

async function renderToStaticMarkup$1(Component, props, { default: children, ...slotted }, metadata) {
	delete props['class'];
	const slots = {};
	for (const [key, value] of Object.entries(slotted)) {
		const name = slotName$1(key);
		slots[name] = React.createElement(StaticHtml, { value, name });
	}
	// Note: create newProps to avoid mutating `props` before they are serialized
	const newProps = {
		...props,
		...slots,
		children: children != null ? React.createElement(StaticHtml, { value: children }) : undefined,
	};
	const vnode = React.createElement(Component, newProps);
	let html;
	if (metadata && metadata.hydrate) {
		html = ReactDOM.renderToString(vnode);
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToPipeableStreamAsync(vnode);
		}
	} else {
		if ('renderToReadableStream' in ReactDOM) {
			html = await renderToReadableStreamAsync(vnode);
		} else {
			html = await renderToStaticNodeStreamAsync(vnode);
		}
	}
	return { html };
}

async function renderToPipeableStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve, reject) => {
		let error = undefined;
		let stream = ReactDOM.renderToPipeableStream(vnode, {
			onError(err) {
				error = err;
				reject(error);
			},
			onAllReady() {
				stream.pipe(
					new Writable({
						write(chunk, _encoding, callback) {
							html += chunk.toString('utf-8');
							callback();
						},
						destroy() {
							resolve(html);
						},
					})
				);
			},
		});
	});
}

async function renderToStaticNodeStreamAsync(vnode) {
	const Writable = await getNodeWritable();
	let html = '';
	return new Promise((resolve) => {
		let stream = ReactDOM.renderToStaticNodeStream(vnode);
		stream.pipe(
			new Writable({
				write(chunk, _encoding, callback) {
					html += chunk.toString('utf-8');
					callback();
				},
				destroy() {
					resolve(html);
				},
			})
		);
	});
}

/**
 * Use a while loop instead of "for await" due to cloudflare and Vercel Edge issues
 * See https://github.com/facebook/react/issues/24169
 */
async function readResult(stream) {
	const reader = stream.getReader();
	let result = '';
	const decoder = new TextDecoder('utf-8');
	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			if (value) {
				result += decoder.decode(value);
			} else {
				// This closes the decoder
				decoder.decode(new Uint8Array());
			}

			return result;
		}
		result += decoder.decode(value, { stream: true });
	}
}

async function renderToReadableStreamAsync(vnode) {
	return await readResult(await ReactDOM.renderToReadableStream(vnode));
}

const _renderer1 = {
	check: check$1,
	renderToStaticMarkup: renderToStaticMarkup$1,
};

const ASTRO_VERSION = "1.2.1";
function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLString extends String {
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};

class Metadata {
  constructor(filePathname, opts) {
    this.modules = opts.modules;
    this.hoisted = opts.hoisted;
    this.hydratedComponents = opts.hydratedComponents;
    this.clientOnlyComponents = opts.clientOnlyComponents;
    this.hydrationDirectives = opts.hydrationDirectives;
    this.mockURL = new URL(filePathname, "http://example.com");
    this.metadataCache = /* @__PURE__ */ new Map();
  }
  resolvePath(specifier) {
    if (specifier.startsWith(".")) {
      const resolved = new URL(specifier, this.mockURL).pathname;
      if (resolved.startsWith("/@fs") && resolved.endsWith(".jsx")) {
        return resolved.slice(0, resolved.length - 4);
      }
      return resolved;
    }
    return specifier;
  }
  getPath(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentUrl) || null;
  }
  getExport(Component) {
    const metadata = this.getComponentMetadata(Component);
    return (metadata == null ? void 0 : metadata.componentExport) || null;
  }
  getComponentMetadata(Component) {
    if (this.metadataCache.has(Component)) {
      return this.metadataCache.get(Component);
    }
    const metadata = this.findComponentMetadata(Component);
    this.metadataCache.set(Component, metadata);
    return metadata;
  }
  findComponentMetadata(Component) {
    const isCustomElement = typeof Component === "string";
    for (const { module, specifier } of this.modules) {
      const id = this.resolvePath(specifier);
      for (const [key, value] of Object.entries(module)) {
        if (isCustomElement) {
          if (key === "tagName" && Component === value) {
            return {
              componentExport: key,
              componentUrl: id
            };
          }
        } else if (Component === value) {
          return {
            componentExport: key,
            componentUrl: id
          };
        }
      }
    }
    return null;
  }
}
function createMetadata(filePathname, options) {
  return new Metadata(filePathname, options);
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new Error(
              'Error: Media query must be provided for "client:media", similar to client:media="(max-width: 600px)"'
            );
          }
          break;
        }
      }
    } else if (key === "class:list") {
      extracted.props[key.slice(0, -5)] = serializeListValue(value);
    } else {
      extracted.props[key] = value;
    }
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = value;
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  island.props["before-hydration-url"] = await result.resolve("astro:scripts/before-hydration.js");
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  return island;
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t)},o=(t,i)=>{if(t===""||!Array.isArray(i))return i;const[e,n]=i;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const i=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const s of n){const r=s.closest(this.tagName);!r||!r.isSameNode(this)||(e[s.getAttribute("data-astro-template")||"default"]=s.innerHTML,s.remove())}for(const s of i){const r=s.closest(this.tagName);!r||!r.isSameNode(this)||(e[s.getAttribute("name")||"default"]=s.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((i,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate),await import(this.getAttribute("before-hydration-url")),this.start()}start(){const i=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:s}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),r=this.getAttribute("component-export")||"default";if(!r.includes("."))this.Component=a[r];else{this.Component=a;for(const d of r.split("."))this.Component=this.Component[d]}return this.hydrator=s,this.hydrate},i,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      return chunk.toString();
    }
  }
}

function validateComponentProps(props, displayName) {
  var _a;
  if (((_a = (Object.assign({"BASE_URL":"/","MODE":"production","DEV":false,"PROD":true},{_:process.env._,}))) == null ? void 0 : _a.DEV) && props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
class AstroComponent {
  constructor(htmlParts, expressions) {
    this.htmlParts = htmlParts;
    this.expressions = expressions;
  }
  get [Symbol.toStringTag]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isAstroComponent(obj) {
  return typeof obj === "object" && Object.prototype.toString.call(obj) === "[object AstroComponent]";
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : !!obj.isAstroComponentFactory;
}
async function* renderAstroComponent(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
async function renderToString(result, componentFactory, props, children) {
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    const response = Component;
    throw response;
  }
  let html = "";
  for await (const chunk of renderAstroComponent(Component)) {
    html += stringifyChunk(result, chunk);
  }
  return html;
}
async function renderToIterable(result, componentFactory, displayName, props, children) {
  validateComponentProps(props, displayName);
  const Component = await componentFactory(result, props, children);
  if (!isAstroComponent(Component)) {
    console.warn(
      `Returning a Response is only supported inside of page components. Consider refactoring this logic into something like a function that can be used in the page.`
    );
    const response = Component;
    throw response;
  }
  return renderAstroComponent(Component);
}
async function renderTemplate(htmlParts, ...expressions) {
  return new AstroComponent(htmlParts, expressions);
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof HTMLString) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (child instanceof AstroComponent || Object.prototype.toString.call(child) === "[object AstroComponent]") {
    yield* renderAstroComponent(child);
  } else if (typeof child === "object" && Symbol.asyncIterator in child) {
    yield* child;
  } else {
    yield child;
  }
}
async function renderSlot(result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        content += stringifyChunk(result, chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(content);
  }
  return fallback;
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?<!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `let ${toIdent(key)} = ${JSON.stringify(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value));
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toStyleString(value)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact"];
    default:
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/vue", "@astrojs/svelte"];
  }
}
function getComponentType(Component) {
  if (Component === Fragment) {
    return "fragment";
  }
  if (Component && typeof Component === "object" && Component["astro:html"]) {
    return "html";
  }
  if (isAstroComponentFactory(Component)) {
    return "astro-factory";
  }
  return "unknown";
}
async function renderComponent(result, displayName, Component, _props, slots = {}) {
  var _a;
  Component = await Component;
  switch (getComponentType(Component)) {
    case "fragment": {
      const children2 = await renderSlot(result, slots == null ? void 0 : slots.default);
      if (children2 == null) {
        return children2;
      }
      return markHTMLString(children2);
    }
    case "html": {
      const children2 = {};
      if (slots) {
        await Promise.all(
          Object.entries(slots).map(
            ([key, value]) => renderSlot(result, value).then((output) => {
              children2[key] = output;
            })
          )
        );
      }
      const html2 = Component.render({ slots: children2 });
      return markHTMLString(html2);
    }
    case "astro-factory": {
      async function* renderAstroComponentInline() {
        let iterable = await renderToIterable(result, Component, displayName, _props, slots);
        yield* iterable;
      }
      return renderAstroComponentInline();
    }
  }
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(_props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  if (Array.isArray(renderers) && renderers.length === 0 && typeof Component !== "string" && !componentIsHTMLElement(Component)) {
    const message = `Unable to render ${metadata.displayName}!

There are no \`integrations\` set in your \`astro.config.mjs\` file.
Did you mean to add ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`;
    throw new Error(message);
  }
  const children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
          children[key] = output;
        })
      )
    );
  }
  let renderer;
  if (metadata.hydrate !== "only") {
    if (Component && Component[Renderer]) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && renderers.length === 1) {
      renderer = renderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new Error(`Unable to render ${metadata.displayName}!

Using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.
Did you mean to pass <${metadata.displayName} client:only="${probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")}" />
`);
    } else if (typeof Component !== "string") {
      const matchingRenderers = renderers.filter((r) => probableRendererNames.includes(r.name));
      const plural = renderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new Error(`Unable to render ${metadata.displayName}!

There ${plural ? "are" : "is"} ${renderers.length} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render ${metadata.displayName}.

Did you mean to enable ${formatList(probableRendererNames.map((r) => "`" + r + "`"))}?`);
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new Error(
      `${metadata.displayName} component has a \`client:${metadata.hydrate}\` directive, but no client entrypoint was provided by ${renderer.name}!`
    );
  }
  if (!html && typeof Component === "string") {
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroComponent(
      await renderTemplate`<${Component}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Component) ? `/>` : `>${childSlots}</${Component}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
      return html;
    }
    return markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement$1("astro-island", island, false));
  }
  return renderAll();
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
const alreadyHeadRenderedResults = /* @__PURE__ */ new WeakSet();
function renderHead(result) {
  alreadyHeadRenderedResults.add(result);
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement$1("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement$1("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement$1("link", link, false));
  return markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
}
async function* maybeRenderHead(result) {
  if (alreadyHeadRenderedResults.has(result)) {
    return;
  }
  yield renderHead(result);
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

new TextEncoder();

function createComponent(cb) {
  cb.isAstroComponentFactory = true;
  return cb;
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}

const ClientOnlyPlaceholder = "astro-client-only";
const skipAstroJSXCheck = /* @__PURE__ */ new WeakSet();
let originalConsoleError;
let consoleFilterRefs = 0;
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  if (isVNode(vnode)) {
    switch (true) {
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skipAstroJSXCheck.add(vnode.type);
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function" && !skipAstroJSXCheck.has(vnode.type)) {
        useConsoleFilter();
        try {
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2 && output2[AstroJSX]) {
            return await renderJSX(result, output2);
          } else if (!output2) {
            return await renderJSX(result, output2);
          }
        } catch (e) {
          skipAstroJSXCheck.add(vnode.type);
        } finally {
          finishUsingConsoleFilter();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponent(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponent(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let body = "";
        for await (const chunk of output) {
          let html = stringifyChunk(result, chunk);
          body += html;
        }
        return markHTMLString(body);
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
}

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const $$metadata$d = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Footer.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$f = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Footer.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Footer = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$Footer;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<footer class="astro-ZW3COV7S">
    <div class="headline astro-ZW3COV7S">
        <div class="logo-text astro-ZW3COV7S">Velocity</div>
        <div class="copyright astro-ZW3COV7S">© 2022 Velocity Team</div>
    </div>
    <div class="links astro-ZW3COV7S">
        <div class="row astro-ZW3COV7S">
            <a href="/" class="astro-ZW3COV7S">Home</a>
            <a href="/docs/intro" class="astro-ZW3COV7S">Docs</a>
            <a href="/branding" class="astro-ZW3COV7S">Branding</a>
        </div>
        <div class="row astro-ZW3COV7S">
            <a href="/store" class="astro-ZW3COV7S">Store</a>
            <a href="/discord" class="astro-ZW3COV7S">Discord</a>
            <a href="https://github.com/Velocity-Discord/" class="astro-ZW3COV7S">GitHub</a>
        </div>
    </div>
</footer>

`;
});

const $$file$d = "/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Footer.astro";
const $$url$d = undefined;

const $$module1$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$d,
	default: $$Footer,
	file: $$file$d,
	url: $$url$d
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$c = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/layouts/Main.astro", { modules: [{ module: $$module1$7, specifier: "../components/Footer.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$e = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/layouts/Main.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Main = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$Main;
  const { title } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`<html lang="en" class="astro-XVHCQVOL">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <meta name="generator"${addAttribute(Astro2.generator, "content")}>
        <title>${title}</title>
        <meta name="description" content="Velocity is a Discord Client modification that allows you to extend discord's functionality and capabilities however you want.">
        <meta name="og:description" content="Velocity is a Discord Client modification that allows you to extend discord's functionality and capabilities however you want.">
        <meta property="og:title" content="Velocity">
        <meta property="og:type" content="website">
        <meta name="theme-color" content="#5b88fc">
    ${renderHead($$result)}</head>
    <body class="astro-XVHCQVOL">
        ${renderSlot($$result, $$slots["default"])}
        ${renderComponent($$result, "Footer", $$Footer, { "class": "astro-XVHCQVOL" })}
        

        
    </body>
</html>`;
});

const $$file$c = "/Users/dylan/Documents/GitHub/Velocity-Site/src/layouts/Main.astro";
const $$url$c = undefined;

const $$module1$6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$c,
	default: $$Main,
	file: $$file$c,
	url: $$url$c
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$b = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Button.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$d = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Button.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Button = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Button;
  const { label, color = "brand", href = "", size = "small" } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<a${addAttribute(href, "href")}${addAttribute(`color-${color} size-${size} astro-QMM3EOD3`, "class")}>
    ${label}
</a>

`;
});

const $$file$b = "/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Button.astro";
const $$url$b = undefined;

const $$module3$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$b,
	default: $$Button,
	file: $$file$b,
	url: $$url$b
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$a = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Nav.astro", { modules: [{ module: $$module3$2, specifier: "./Button.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$c = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Nav.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Nav = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$Nav;
  const { expanded } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<nav class="astro-KXUN27LA">
    <a class="logo-text astro-KXUN27LA" href="/">Velocity</a>
    <div class="nav-links astro-KXUN27LA">
        <ul class="astro-KXUN27LA">
            ${expanded ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "class": "astro-KXUN27LA" }, { "default": () => renderTemplate`<li class="astro-KXUN27LA">
                            <a href="/branding" class="astro-KXUN27LA">Branding</a>
                        </li><li class="astro-KXUN27LA">
                            <a href="/docs" class="astro-KXUN27LA">Docs</a>
                        </li><li class="astro-KXUN27LA">
                            <a href="/store" class="astro-KXUN27LA">Store</a>
                        </li><li class="astro-KXUN27LA">
                            <a href="https://github.com/Velocity-Discord/" class="astro-KXUN27LA">GitHub</a>
                        </li>` })}` : renderTemplate`<li class="astro-KXUN27LA">
                        ${renderComponent($$result, "Button", $$Button, { "label": "Install", "href": "/docs/installation", "class": "astro-KXUN27LA" })}
                    </li>`}
        </ul>
    </div>
</nav>

`;
});

const $$file$a = "/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Nav.astro";
const $$url$a = undefined;

const $$module3$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$a,
	default: $$Nav,
	file: $$file$a,
	url: $$url$a
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$9 = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Banner.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$b = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Banner.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Banner = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Banner;
  const { title, content, type } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(`banner type-${type} astro-WGBACQ7Q`, "class")}>
    <div class="icon astro-WGBACQ7Q">
        <div class="title astro-WGBACQ7Q">
            <svg class="icon astro-WGBACQ7Q" width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1.999c5.524 0 10.002 4.478 10.002 10.002 0 5.523-4.478 10.001-10.002 10.001-5.524 0-10.002-4.478-10.002-10.001C1.998 6.477 6.476 1.999 12 1.999Zm0 1.5a8.502 8.502 0 1 0 0 17.003A8.502 8.502 0 0 0 12 3.5Zm-.004 7a.75.75 0 0 1 .744.648l.007.102.003 5.502a.75.75 0 0 1-1.493.102l-.007-.101-.003-5.502a.75.75 0 0 1 .75-.75ZM12 7.003a.999.999 0 1 1 0 1.997.999.999 0 0 1 0-1.997Z" fill="currentColor" class="astro-WGBACQ7Q"></path>
            </svg>
            ${title}
        </div>
        <div class="content astro-WGBACQ7Q">
            ${content}
        </div>
    </div>
</div>

`;
});

const $$file$9 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Banner.astro";
const $$url$9 = undefined;

const $$module3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$9,
	default: $$Banner,
	file: $$file$9,
	url: $$url$9
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$8 = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Chip.astro", { modules: [], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$a = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Chip.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Chip = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Chip;
  const { label } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div class="chip astro-EDTNLFEU">${label}</div>

`;
});

const $$file$8 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Chip.astro";
const $$url$8 = undefined;

const $$module1$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$8,
	default: $$Chip,
	file: $$file$8,
	url: $$url$8
}, Symbol.toStringTag, { value: 'Module' }));

// Caches Promise<Highligher> for reuse when the same theme and langs are provided
const _resolvedHighlighters = new Map();

function stringify(opts) {
	// Always sort keys before stringifying to make sure objects match regardless of parameter ordering
	return JSON.stringify(opts, Object.keys(opts).sort());
}

/**
 * @param {import('shiki').HighlighterOptions} opts
 * @returns {Promise<import('shiki').Highlighter>}
 */
function getHighlighter(opts) {
	const key = stringify(opts);

	// Highlighter has already been requested, reuse the same instance
	if (_resolvedHighlighters.has(key)) {
		return _resolvedHighlighters.get(key);
	}

	// Start the async getHighlighter call and cache the Promise
	const highlighter = getHighlighter$1(opts).then((hl) => {
		hl.setColorReplacements({
			'#000001': 'var(--astro-code-color-text)',
			'#000002': 'var(--astro-code-color-background)',
			'#000004': 'var(--astro-code-token-constant)',
			'#000005': 'var(--astro-code-token-string)',
			'#000006': 'var(--astro-code-token-comment)',
			'#000007': 'var(--astro-code-token-keyword)',
			'#000008': 'var(--astro-code-token-parameter)',
			'#000009': 'var(--astro-code-token-function)',
			'#000010': 'var(--astro-code-token-string-expression)',
			'#000011': 'var(--astro-code-token-punctuation)',
			'#000012': 'var(--astro-code-token-link)',
		});
		return hl;
	});
	_resolvedHighlighters.set(key, highlighter);

	return highlighter;
}

const $$module1$4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	getHighlighter
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$7 = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/node_modules/astro/components/Code.astro", { modules: [{ module: $$module1$4, specifier: "./Shiki.js", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$9 = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/node_modules/astro/components/Code.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Code = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$Code;
  const { code, lang = "plaintext", theme = "github-dark", wrap = false } = Astro2.props;
  function repairShikiTheme(html2) {
    html2 = html2.replace('<pre class="shiki"', '<pre class="astro-code"');
    if (wrap === false) {
      html2 = html2.replace(/style="(.*?)"/, 'style="$1; overflow-x: auto;"');
    } else if (wrap === true) {
      html2 = html2.replace(
        /style="(.*?)"/,
        'style="$1; overflow-x: auto; white-space: pre-wrap; word-wrap: break-word;"'
      );
    }
    return html2;
  }
  const highlighter = await getHighlighter({
    theme,
    langs: typeof lang !== "string" ? [lang] : void 0
  });
  const _html = highlighter.codeToHtml(code, { lang: typeof lang === "string" ? lang : lang.id });
  const html = repairShikiTheme(_html);
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": () => renderTemplate`${markHTMLString(html)}` })}
`;
});

const $$file$7 = "/Users/dylan/Documents/GitHub/Velocity-Site/node_modules/astro/components/Code.astro";
const $$url$7 = undefined;

const $$module1$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$7,
	default: $$Code,
	file: $$file$7,
	url: $$url$7
}, Symbol.toStringTag, { value: 'Module' }));

createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/node_modules/astro/components/Debug.astro", { modules: [{ module: $$module1$3, specifier: "./Code.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$8 = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/node_modules/astro/components/Debug.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Debug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$Debug;
  const key = Object.keys(Astro2.props)[0];
  const value = Astro2.props[key];
  return renderTemplate`${maybeRenderHead($$result)}<div class="astro-debug">
	<div class="astro-debug-header">
		<h2 class="astro-debug-title">
			<span class="astro-debug-label">Debug</span>
			<span class="astro-debug-name">"${key}"</span>
		</h2>
	</div>

	${renderComponent($$result, "Code", $$Code, { "code": JSON.stringify(value, null, 2) })}
</div>

<style>
	.astro-debug {
		font-size: 14px;
		padding: 1rem 1.5rem;
		background: white;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
	}

	.astro-debug-header,
	pre.astro-code {
		margin: -1rem -1.5rem 1rem;
		padding: 0.25rem 0.75rem;
	}

	.astro-debug-header {
		background: #ff1639;
		border-radius: 4px;
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.astro-debug-title {
		font-size: 1em;
		color: white;
		margin: 0.5em 0;
	}

	.astro-debug-label {
		font-weight: bold;
		text-transform: uppercase;
		margin-right: 0.75em;
	}

	pre.astro-code {
		border: 1px solid #eee;
		padding: 1rem 0.75rem;
		border-radius: 4px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		font-size: 14px;
	}
</style>`;
});

const $$module2$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	Code: $$Code,
	Debug: $$Debug
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$6 = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Feature.astro", { modules: [{ module: $$module1$5, specifier: "./Chip.astro", assert: {} }, { module: $$module2$1, specifier: "astro/components", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$7 = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Feature.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Feature = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Feature;
  const { decoration, title, content, code = "", lang } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div class="feature astro-4GJEUT4E">
    ${renderComponent($$result, "Chip", $$Chip, { "label": decoration, "class": "astro-4GJEUT4E" })}
    <h2 class="title astro-4GJEUT4E">${title}</h2>
    <p class="content astro-4GJEUT4E">${content}</p>
    ${renderComponent($$result, "Code", $$Code, { "lang": lang, "code": code, "theme": "github-dark", "class": "astro-4GJEUT4E" })}
</div>

`;
});

const $$file$6 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/components/Feature.astro";
const $$url$6 = undefined;

const $$module5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$6,
	default: $$Feature,
	file: $$file$6,
	url: $$url$6
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$5 = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/index.astro", { modules: [{ module: $$module1$6, specifier: "../layouts/Main.astro", assert: {} }, { module: $$module3$1, specifier: "../components/Nav.astro", assert: {} }, { module: $$module3$2, specifier: "../components/Button.astro", assert: {} }, { module: $$module3, specifier: "../components/Banner.astro", assert: {} }, { module: $$module5, specifier: "../components/Feature.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$6 = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/index.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Index$1 = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$Index$1;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Layout", $$Main, { "title": "Velocity", "class": "astro-R5YZYNLI" }, { "default": () => renderTemplate`${maybeRenderHead($$result)}<div class="hero astro-R5YZYNLI">
        <div class="hero-backdrop astro-R5YZYNLI">
            ${renderComponent($$result, "Nav", $$Nav, { "expanded": false, "class": "astro-R5YZYNLI" })}
            ${renderComponent($$result, "Banner", $$Banner, { "type": "info", "title": "End of Life", "content": "Velocity version 1.x.x is now deprecated. For more information, join the official Discord Server.", "class": "astro-R5YZYNLI" })}
            <div class="hero-content astro-R5YZYNLI">
                <div class="quote astro-R5YZYNLI"></div>
                <div class="title astro-R5YZYNLI">Supercharge your Discord today.</div>
                <div class="subtitle astro-R5YZYNLI">Velocity adds the ability to customise your favourite chat app however <strong class="astro-R5YZYNLI">you</strong> want.</div>
                <div class="buttons astro-R5YZYNLI">
                    ${renderComponent($$result, "Button", $$Button, { "label": "Install \u2192", "size": "large", "href": "/docs/installation", "class": "astro-R5YZYNLI" })}
                    ${renderComponent($$result, "Button", $$Button, { "label": "Documentation", "color": "outline", "size": "large", "href": "/docs/intro", "class": "astro-R5YZYNLI" })}
                </div>
            </div>
            <!-- <div class="downloads">Over <div class="highlight">{getDownloadCount()}+</div> Recent Installer Downloads</div> -->
        </div>
    </div><main class="astro-R5YZYNLI">
        ${renderComponent($$result, "Feature", $$Feature, { "code": `const { WebpackModules, showToast, React } = VApi;

const ButtonModules = WebpackModules.find(["ButtonColors"]);

React.createElement(ButtonModules.default, {
    children: "Click me!",
    color: ButtonModules.ButtonColors.GREEN,
    onClick: () => showToast("Clicked!")
})`, "lang": "js", "decoration": "Extendable", "title": "Plugins", "content": "Plugins can make use of Discord's internal methods and Velocity's provided utilities to create advanced and creative Plugins.", "class": "astro-R5YZYNLI" })}
        ${renderComponent($$result, "Feature", $$Feature, { "code": `.something {
    display: none; /* :( */
}

.something::after {
    display: flex;
    content: "";
    /* make stuff better */
}`, "lang": "css", "decoration": "Customisable", "title": "Themes", "content": "Themes allow you to re-imagine Discord's look and feel, either by creating your own with CSS or by downloading one of the numerous public themes.", "class": "astro-R5YZYNLI" })}
    </main>` })}

`;
});

const $$file$5 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/index.astro";
const $$url$5 = "";

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$5,
	default: $$Index$1,
	file: $$file$5,
	url: $$url$5
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$4 = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/branding.astro", { modules: [{ module: $$module1$6, specifier: "../layouts/Main.astro", assert: {} }, { module: $$module3$1, specifier: "../components/Nav.astro", assert: {} }, { module: $$module3$2, specifier: "../components/Button.astro", assert: {} }, { module: $$module3, specifier: "../components/Banner.astro", assert: {} }, { module: $$module5, specifier: "../components/Feature.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$5 = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/branding.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Branding = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$Branding;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Layout", $$Main, { "title": "Branding", "class": "astro-URH5UH67" }, { "default": () => renderTemplate`${renderComponent($$result, "Nav", $$Nav, { "expanded": true, "class": "astro-URH5UH67" })}${maybeRenderHead($$result)}<div class="page-header astro-URH5UH67">Branding</div><main class="astro-URH5UH67">
        <section class="branding-section astro-URH5UH67">
            <div class="branding-section-title astro-URH5UH67">Colour</div>
            <div class="palette-grid astro-URH5UH67">
                <div style="--palette-colour: #5B88FC" class="palette-colour large astro-URH5UH67">
                    <div class="palette-info astro-URH5UH67">
                        <div class="palette-colour-hex astro-URH5UH67">#5B88FC</div>
                    </div>
                </div>
                <div style="--palette-colour: #F2E047" class="palette-colour astro-URH5UH67">
                    <div class="palette-info astro-URH5UH67">
                        <div class="palette-colour-hex astro-URH5UH67">#F2E047</div>
                    </div>
                </div>
                <div style="--palette-colour: #D46060" class="palette-colour astro-URH5UH67">
                    <div class="palette-info astro-URH5UH67">
                        <div class="palette-colour-hex astro-URH5UH67">#D46060</div>
                    </div>
                </div>
                <div style="--palette-colour: #FFFFFF" class="palette-colour astro-URH5UH67">
                    <div class="palette-info astro-URH5UH67">
                        <div class="palette-colour-hex astro-URH5UH67">#FFFFFF</div>
                    </div>
                </div>
                <div style="--palette-colour: #62ED9A" class="palette-colour astro-URH5UH67">
                    <div class="palette-info astro-URH5UH67">
                        <div class="palette-colour-hex astro-URH5UH67">#62ED9A</div>
                    </div>
                </div>
                <div style="--palette-colour: #232121" class="palette-colour large astro-URH5UH67">
                    <div class="palette-info astro-URH5UH67">
                        <div class="palette-colour-hex astro-URH5UH67">#232121</div>
                    </div>
                </div>
            </div>
        </section>
        <section class="branding-section astro-URH5UH67">
            <div class="branding-section-title astro-URH5UH67">Logos</div>
            <div class="logo-grid astro-URH5UH67">
                <img src="/assets/logos/Blue.svg" alt="Blue" class="astro-URH5UH67">
                <img src="/assets/logos/Text-Blue.svg" class="large astro-URH5UH67" alt="Blue Text">
                <img src="/assets/logos/Black.svg" class="light astro-URH5UH67" alt="Black">
                <img src="/assets/logos/Text-Black.svg" class="large light astro-URH5UH67" alt="Black Text">
            </div>
        </section>
    </main>` })}

`;
});

const $$file$4 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/branding.astro";
const $$url$4 = "/branding";

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$4,
	default: $$Branding,
	file: $$file$4,
	url: $$url$4
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$3 = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/store/index.astro", { modules: [{ module: $$module1$6, specifier: "../../layouts/Main.astro", assert: {} }, { module: $$module3$1, specifier: "../../components/Nav.astro", assert: {} }, { module: $$module3, specifier: "../../components/Banner.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$4 = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/store/index.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$Index;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${renderComponent($$result, "Layout", $$Main, { "title": "Store", "class": "astro-METBMAIW" }, { "default": () => renderTemplate`${renderComponent($$result, "Nav", $$Nav, { "expanded": true, "class": "astro-METBMAIW" })}${maybeRenderHead($$result)}<div class="page-header astro-METBMAIW">Store</div>${renderComponent($$result, "Banner", $$Banner, { "title": "Hey there, this page isn't ready!", "content": "Come back soon! You can follow this site's development from our GitHub.", "class": "astro-METBMAIW" })}<main class="astro-METBMAIW"></main>` })}

`;
});

const $$file$3 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/store/index.astro";
const $$url$3 = "/store";

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$3,
	default: $$Index,
	file: $$file$3,
	url: $$url$3
}, Symbol.toStringTag, { value: 'Module' }));

const DOC_OUTLINE = [
  {
    type: "title",
    label: "Introduction",
    path: ""
  },
  {
    type: "item",
    label: "Getting Started",
    path: "/docs/intro"
  },
  {
    type: "item",
    label: "Installation",
    path: "/docs/installation"
  },
  {
    type: "title",
    label: "Plugins",
    path: ""
  },
  {
    type: "item",
    label: "Creating Plugins",
    path: "/docs/creating-plugins"
  },
  {
    type: "item",
    label: "Plugin API",
    path: "/docs/plugin-api"
  },
  {
    type: "item",
    label: "Webpack",
    path: "/docs/webpack"
  },
  {
    type: "title",
    label: "Themes",
    path: ""
  },
  {
    type: "item",
    label: "Creating Themes",
    path: "/docs/creating-themes"
  }
];

const $$module1$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	DOC_OUTLINE
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$2 = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/DocLayout.astro", { modules: [{ module: $$module1$2, specifier: "../constants", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$3 = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/DocLayout.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$DocLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$DocLayout;
  const { selected } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div class="doc-outline astro-AQKGXUS5">
    <div class="sidebar astro-AQKGXUS5">
        ${DOC_OUTLINE.map(
    (item, index) => item.type === "title" ? renderTemplate`<div class="title astro-AQKGXUS5">${item.label}</div>` : renderTemplate`<a${addAttribute(item.path, "href")}${addAttribute(`item ${selected == item.label && "selected"} astro-AQKGXUS5`, "class")}>
                        <div class="item-label astro-AQKGXUS5">${item.label}</div>
                    </a>`
  )}
    </div>
    ${renderSlot($$result, $$slots["default"])}
</div>

`;
});

const $$file$2 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/components/DocLayout.astro";
const $$url$2 = undefined;

const $$module1$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$2,
	default: $$DocLayout,
	file: $$file$2,
	url: $$url$2
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata$1 = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/DocOutline.astro", { modules: [{ module: $$module1$2, specifier: "../constants", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$2 = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/DocOutline.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$DocOutline = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$DocOutline;
  const { selected, title } = Astro2.props;
  const se = DOC_OUTLINE.find((e) => e.label === selected);
  const docFiles = await Astro2.glob(/* #__PURE__ */ Object.assign({"../pages/docs/creating-plugins.md": () => Promise.resolve().then(() => _page3),"../pages/docs/creating-themes.md": () => Promise.resolve().then(() => _page4),"../pages/docs/installation.md": () => Promise.resolve().then(() => _page5),"../pages/docs/intro.md": () => Promise.resolve().then(() => _page8),"../pages/docs/plugin-api.md": () => Promise.resolve().then(() => _page6),"../pages/docs/webpack.md": () => Promise.resolve().then(() => _page7)}), () => "../pages/docs/*.md");
  let activeFile;
  let headers;
  if (se)
    activeFile = docFiles.find((e) => e.file.includes(se.path));
  headers = activeFile?.getHeadings();
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<nav class="outline astro-4RN56GRQ">
    <ul class="astro-4RN56GRQ">
        <li class="title astro-4RN56GRQ">
            <a href="#" class="astro-4RN56GRQ">${title}</a>
        </li>
        ${headers?.map((header) => {
    if (header.depth > 3)
      return;
    return renderTemplate`<li class="list-item astro-4RN56GRQ">
                        <a${addAttribute(`indent-${header.depth} astro-4RN56GRQ`, "class")}${addAttribute(`#${header.slug}`, "href")}>
                            ${header.text}
                        </a>
                    </li>`;
  })}
    </ul>
</nav>

`;
});

const $$file$1 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/components/DocOutline.astro";
const $$url$1 = undefined;

const $$module1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata: $$metadata$1,
	default: $$DocOutline,
	file: $$file$1,
	url: $$url$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$metadata = createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/DocPage.astro", { modules: [{ module: $$module1, specifier: "./DocOutline.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro$1 = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/components/DocPage.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$DocPage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$DocPage;
  const { title, dev, selected } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`${maybeRenderHead($$result)}<div class="backdrop astro-OC4YRTHN">
    ${dev && renderTemplate`<div class="dev-cover astro-OC4YRTHN">Oh no! This Page isn't finished.</div>`}
    <div class="titlebar astro-OC4YRTHN">
        <h1 class="astro-OC4YRTHN">${title}</h1>
    </div>
    <div class="content astro-OC4YRTHN">
        <div class="markdown astro-OC4YRTHN">
            ${renderSlot($$result, $$slots["default"])}
        </div>
        ${renderComponent($$result, "DocOutline", $$DocOutline, { "selected": selected, "title": "Outline", "class": "astro-OC4YRTHN" })}
    </div>
</div>



`;
});

const $$file = "/Users/dylan/Documents/GitHub/Velocity-Site/src/components/DocPage.astro";
const $$url = undefined;

const $$module2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	$$metadata,
	default: $$DocPage,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

createMetadata("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/layouts/Docs.astro", { modules: [{ module: $$module1$1, specifier: "../components/DocLayout.astro", assert: {} }, { module: $$module2, specifier: "../components/DocPage.astro", assert: {} }, { module: $$module3$1, specifier: "../components/Nav.astro", assert: {} }], hydratedComponents: [], clientOnlyComponents: [], hydrationDirectives: /* @__PURE__ */ new Set([]), hoisted: [] });
const $$Astro = createAstro("/@fs/Users/dylan/Documents/GitHub/Velocity-Site/src/layouts/Docs.astro", "", "file:///Users/dylan/Documents/GitHub/Velocity-Site/");
const $$Docs = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Docs;
  const { frontmatter } = Astro2.props;
  const STYLES = [];
  for (const STYLE of STYLES)
    $$result.styles.add(STYLE);
  return renderTemplate`<html lang="en" class="astro-N6UNXTYC">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <meta name="generator"${addAttribute(Astro2.generator, "content")}>
        <title>${frontmatter.title}</title>
    ${renderHead($$result)}</head>
    <body class="astro-N6UNXTYC">
        ${renderComponent($$result, "Nav", $$Nav, { "expanded": true, "class": "astro-N6UNXTYC" })}
        ${renderComponent($$result, "DocLayout", $$DocLayout, { "selected": frontmatter.title, "class": "astro-N6UNXTYC" }, { "default": () => renderTemplate`${renderComponent($$result, "DocPage", $$DocPage, { "selected": frontmatter.title, "dev": !!frontmatter.dev, "title": frontmatter.title, "class": "astro-N6UNXTYC" }, { "default": () => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}` })}
        

        
    </body>
</html>`;
});

const html$5 = "";

				const frontmatter$5 = {"layout":"../../layouts/Docs.astro","title":"Creating Plugins","url":"/docs/creating-plugins.md","dev":true};
				const file$5 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/docs/creating-plugins.md";
				const url$5 = "/docs/creating-plugins";
				function rawContent$5() {
					return "";
				}
				function compiledContent$5() {
					return html$5;
				}
				function getHeadings$5() {
					return [];
				}
				function getHeaders$5() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$5();
				}				async function Content$5() {
					const { layout, ...content } = frontmatter$5;
					content.file = file$5;
					content.url = url$5;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$5 });
					return createVNode($$Docs, {
									file: file$5,
									url: url$5,
									content,
									frontmatter: content,
									headings: getHeadings$5(),
									rawContent: rawContent$5,
									compiledContent: compiledContent$5,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$5[Symbol.for('astro.needsHeadRendering')] = false;

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$5,
	file: file$5,
	url: url$5,
	rawContent: rawContent$5,
	compiledContent: compiledContent$5,
	getHeadings: getHeadings$5,
	getHeaders: getHeaders$5,
	Content: Content$5,
	default: Content$5
}, Symbol.toStringTag, { value: 'Module' }));

const html$4 = "<p>You Don’t.</p>";

				const frontmatter$4 = {"layout":"../../layouts/Docs.astro","title":"Creating Themes","url":"/docs/creating-themes.md","dev":true};
				const file$4 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/docs/creating-themes.md";
				const url$4 = "/docs/creating-themes";
				function rawContent$4() {
					return "\nYou Don't.";
				}
				function compiledContent$4() {
					return html$4;
				}
				function getHeadings$4() {
					return [];
				}
				function getHeaders$4() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$4();
				}				async function Content$4() {
					const { layout, ...content } = frontmatter$4;
					content.file = file$4;
					content.url = url$4;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$4 });
					return createVNode($$Docs, {
									file: file$4,
									url: url$4,
									content,
									frontmatter: content,
									headings: getHeadings$4(),
									rawContent: rawContent$4,
									compiledContent: compiledContent$4,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$4[Symbol.for('astro.needsHeadRendering')] = false;

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$4,
	file: file$4,
	url: url$4,
	rawContent: rawContent$4,
	compiledContent: compiledContent$4,
	getHeadings: getHeadings$4,
	getHeaders: getHeaders$4,
	Content: Content$4,
	default: Content$4
}, Symbol.toStringTag, { value: 'Module' }));

const html$3 = "<h1 id=\"installation-and-maintenance\">Installation and Maintenance</h1>\n<p>This page will cover the installation and maintenance of Velocity.</p>\n<h2 id=\"installation\">Installation</h2>\n<h4 id=\"prerequisites\">Prerequisites</h4>\n<p><a href=\"https://nodejs.org/en/\">Node.js</a> v12+, <a href=\"https://git-scm.com/\">git</a> and <a href=\"https://www.npmjs.com/\">npm</a>.</p>\n<hr>\n<h3 id=\"1-clone-the-repository\">1. Clone the repository.</h3>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">git clone https:</span><span style=\"color: #FF7B72\">//</span><span style=\"color: #79C0FF\">github.com</span><span style=\"color: #FF7B72\">/</span><span style=\"color: #C9D1D9\">Velocity</span><span style=\"color: #FF7B72\">-</span><span style=\"color: #C9D1D9\">Discord</span><span style=\"color: #FF7B72\">/</span><span style=\"color: #C9D1D9\">Velocity.git</span></span></code></pre>\n<h3 id=\"2-run-the-install-script\">2. Run the install script.</h3>\n<h4 id=\"stable\">Stable</h4>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">npm run install</span></span></code></pre>\n<h4 id=\"ptb\">PTB</h4>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">npm run install </span><span style=\"color: #FF7B72\">--</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">--</span><span style=\"color: #C9D1D9\">ptb</span></span></code></pre>\n<h4 id=\"canary\">Canary</h4>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">npm run install </span><span style=\"color: #FF7B72\">--</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">--</span><span style=\"color: #C9D1D9\">canary</span></span></code></pre>\n<hr>\n<h2 id=\"development\">Development</h2>\n<h3 id=\"1-clone-the-repository-1\">1. Clone the repository.</h3>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">git clone https:</span><span style=\"color: #FF7B72\">//</span><span style=\"color: #79C0FF\">github.com</span><span style=\"color: #FF7B72\">/</span><span style=\"color: #C9D1D9\">Velocity</span><span style=\"color: #FF7B72\">-</span><span style=\"color: #C9D1D9\">Discord</span><span style=\"color: #FF7B72\">/</span><span style=\"color: #C9D1D9\">Velocity.git</span></span></code></pre>\n<h3 id=\"2-run-the-install-script-1\">2. Run the install script.</h3>\n<h4 id=\"stable-1\">Stable</h4>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">npm run install</span></span></code></pre>\n<h4 id=\"ptb-1\">PTB</h4>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">npm run install </span><span style=\"color: #FF7B72\">--</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">--</span><span style=\"color: #C9D1D9\">ptb</span></span></code></pre>\n<h4 id=\"canary-1\">Canary</h4>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">npm run install </span><span style=\"color: #FF7B72\">--</span><span style=\"color: #C9D1D9\"> </span><span style=\"color: #FF7B72\">--</span><span style=\"color: #C9D1D9\">canary</span></span></code></pre>\n<h3 id=\"3-build\">3. Build.</h3>\n<p>To use latest changes, run</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">npm run dist</span></span></code></pre>\n<h3 id=\"4-watch\">4. Watch.</h3>\n<p>To automatically compile the asar, run</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">npm run watch</span></span></code></pre>";

				const frontmatter$3 = {"layout":"../../layouts/Docs.astro","title":"Installation","url":"/docs/installation.md"};
				const file$3 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/docs/installation.md";
				const url$3 = "/docs/installation";
				function rawContent$3() {
					return "\n# Installation and Maintenance\nThis page will cover the installation and maintenance of Velocity.\n\n## Installation\n\n#### Prerequisites\n[Node.js](https://nodejs.org/en/) v12+, [git](https://git-scm.com/) and [npm](https://www.npmjs.com/).\n\n---\n\n### 1. Clone the repository.\n```ps\ngit clone https://github.com/Velocity-Discord/Velocity.git\n```\n\n### 2. Run the install script.\n\n#### Stable \n```ps\nnpm run install\n```\n\n#### PTB\n```ps\nnpm run install -- --ptb\n```\n\n#### Canary\n```ps\nnpm run install -- --canary\n```\n\n---\n## Development\n\n### 1. Clone the repository.\n```ps\ngit clone https://github.com/Velocity-Discord/Velocity.git\n```\n\n### 2. Run the install script.\n\n#### Stable \n```ps\nnpm run install\n```\n\n#### PTB\n```ps\nnpm run install -- --ptb\n```\n\n#### Canary\n```ps\nnpm run install -- --canary\n```\n### 3. Build.\nTo use latest changes, run\n```ps\nnpm run dist\n```\n\n### 4. Watch.\nTo automatically compile the asar, run \n```ps\nnpm run watch\n```";
				}
				function compiledContent$3() {
					return html$3;
				}
				function getHeadings$3() {
					return [{"depth":1,"slug":"installation-and-maintenance","text":"Installation and Maintenance"},{"depth":2,"slug":"installation","text":"Installation"},{"depth":4,"slug":"prerequisites","text":"Prerequisites"},{"depth":3,"slug":"1-clone-the-repository","text":"1. Clone the repository."},{"depth":3,"slug":"2-run-the-install-script","text":"2. Run the install script."},{"depth":4,"slug":"stable","text":"Stable"},{"depth":4,"slug":"ptb","text":"PTB"},{"depth":4,"slug":"canary","text":"Canary"},{"depth":2,"slug":"development","text":"Development"},{"depth":3,"slug":"1-clone-the-repository-1","text":"1. Clone the repository."},{"depth":3,"slug":"2-run-the-install-script-1","text":"2. Run the install script."},{"depth":4,"slug":"stable-1","text":"Stable"},{"depth":4,"slug":"ptb-1","text":"PTB"},{"depth":4,"slug":"canary-1","text":"Canary"},{"depth":3,"slug":"3-build","text":"3. Build."},{"depth":3,"slug":"4-watch","text":"4. Watch."}];
				}
				function getHeaders$3() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$3();
				}				async function Content$3() {
					const { layout, ...content } = frontmatter$3;
					content.file = file$3;
					content.url = url$3;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$3 });
					return createVNode($$Docs, {
									file: file$3,
									url: url$3,
									content,
									frontmatter: content,
									headings: getHeadings$3(),
									rawContent: rawContent$3,
									compiledContent: compiledContent$3,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$3[Symbol.for('astro.needsHeadRendering')] = false;

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$3,
	file: file$3,
	url: url$3,
	rawContent: rawContent$3,
	compiledContent: compiledContent$3,
	getHeadings: getHeadings$3,
	getHeaders: getHeaders$3,
	Content: Content$3,
	default: Content$3
}, Symbol.toStringTag, { value: 'Module' }));

const html$2 = "";

				const frontmatter$2 = {"layout":"../../layouts/Docs.astro","title":"Plugin API","url":"/docs/plugin-api.md","dev":true};
				const file$2 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/docs/plugin-api.md";
				const url$2 = "/docs/plugin-api";
				function rawContent$2() {
					return "";
				}
				function compiledContent$2() {
					return html$2;
				}
				function getHeadings$2() {
					return [];
				}
				function getHeaders$2() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$2();
				}				async function Content$2() {
					const { layout, ...content } = frontmatter$2;
					content.file = file$2;
					content.url = url$2;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$2 });
					return createVNode($$Docs, {
									file: file$2,
									url: url$2,
									content,
									frontmatter: content,
									headings: getHeadings$2(),
									rawContent: rawContent$2,
									compiledContent: compiledContent$2,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$2[Symbol.for('astro.needsHeadRendering')] = false;

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$2,
	file: file$2,
	url: url$2,
	rawContent: rawContent$2,
	compiledContent: compiledContent$2,
	getHeadings: getHeadings$2,
	getHeaders: getHeaders$2,
	Content: Content$2,
	default: Content$2
}, Symbol.toStringTag, { value: 'Module' }));

const html$1 = "";

				const frontmatter$1 = {"layout":"../../layouts/Docs.astro","title":"Webpack","url":"/docs/webpack.md","dev":true};
				const file$1 = "/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/docs/webpack.md";
				const url$1 = "/docs/webpack";
				function rawContent$1() {
					return "";
				}
				function compiledContent$1() {
					return html$1;
				}
				function getHeadings$1() {
					return [];
				}
				function getHeaders$1() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$1();
				}				async function Content$1() {
					const { layout, ...content } = frontmatter$1;
					content.file = file$1;
					content.url = url$1;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$1 });
					return createVNode($$Docs, {
									file: file$1,
									url: url$1,
									content,
									frontmatter: content,
									headings: getHeadings$1(),
									rawContent: rawContent$1,
									compiledContent: compiledContent$1,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$1[Symbol.for('astro.needsHeadRendering')] = false;

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter: frontmatter$1,
	file: file$1,
	url: url$1,
	rawContent: rawContent$1,
	compiledContent: compiledContent$1,
	getHeadings: getHeadings$1,
	getHeaders: getHeaders$1,
	Content: Content$1,
	default: Content$1
}, Symbol.toStringTag, { value: 'Module' }));

const html = "<h1 id=\"welcome-to-the-velocity-documentation\">Welcome to the Velocity Documentation!</h1>";

				const frontmatter = {"layout":"../../layouts/Docs.astro","title":"Getting Started","url":"/docs/intro.md","dev":true};
				const file = "/Users/dylan/Documents/GitHub/Velocity-Site/src/pages/docs/intro.md";
				const url = "/docs/intro";
				function rawContent() {
					return "\n# Welcome to the Velocity Documentation!\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [{"depth":1,"slug":"welcome-to-the-velocity-documentation","text":"Welcome to the Velocity Documentation!"}];
				}
				function getHeaders() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings();
				}				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return createVNode($$Docs, {
									file,
									url,
									content,
									frontmatter: content,
									headings: getHeadings(),
									rawContent,
									compiledContent,
									'server:root': true,
									children: contentFragment
								});
				}
				Content[Symbol.for('astro.needsHeadRendering')] = false;

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	frontmatter,
	file,
	url,
	rawContent,
	compiledContent,
	getHeadings,
	getHeaders,
	Content,
	default: Content
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.astro', _page0],['src/pages/branding.astro', _page1],['src/pages/store/index.astro', _page2],['src/pages/docs/creating-plugins.md', _page3],['src/pages/docs/creating-themes.md', _page4],['src/pages/docs/installation.md', _page5],['src/pages/docs/plugin-api.md', _page6],['src/pages/docs/webpack.md', _page7],['src/pages/docs/intro.md', _page8],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),Object.assign({"name":"@astrojs/react","clientEntrypoint":"@astrojs/react/client.js","serverEntrypoint":"@astrojs/react/server.js","jsxImportSource":"react"}, { ssr: _renderer1 }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return segment[0].spread ? `/:${segment[0].content.slice(3)}(.*)?` : "/" + segment.map((part) => {
      if (part)
        return part.dynamic ? `:${part.content}` : part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":["assets/e3d9b4ef.94add04b.css","assets/branding-index.52076faa.css","assets/branding-index-store-index.112aad5b.css","assets/index.7f17bcf4.css"],"scripts":[],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/e3d9b4ef.94add04b.css","assets/branding-index.52076faa.css","assets/branding-index-store-index.112aad5b.css","assets/branding.eee3ff4e.css"],"scripts":[],"routeData":{"route":"/branding","type":"page","pattern":"^\\/branding\\/?$","segments":[[{"content":"branding","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/branding.astro","pathname":"/branding","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/e3d9b4ef.94add04b.css","assets/branding-index-store-index.112aad5b.css","assets/store-index.6bba0b9a.css"],"scripts":[],"routeData":{"route":"/store","type":"page","pattern":"^\\/store\\/?$","segments":[[{"content":"store","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/store/index.astro","pathname":"/store","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/e3d9b4ef.94add04b.css","assets/1e6d4445.9c560e9c.css"],"scripts":[],"routeData":{"route":"/docs/creating-plugins","type":"page","pattern":"^\\/docs\\/creating-plugins\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}],[{"content":"creating-plugins","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/docs/creating-plugins.md","pathname":"/docs/creating-plugins","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/e3d9b4ef.94add04b.css","assets/1e6d4445.9c560e9c.css"],"scripts":[],"routeData":{"route":"/docs/creating-themes","type":"page","pattern":"^\\/docs\\/creating-themes\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}],[{"content":"creating-themes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/docs/creating-themes.md","pathname":"/docs/creating-themes","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/e3d9b4ef.94add04b.css","assets/1e6d4445.9c560e9c.css"],"scripts":[],"routeData":{"route":"/docs/installation","type":"page","pattern":"^\\/docs\\/installation\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}],[{"content":"installation","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/docs/installation.md","pathname":"/docs/installation","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/e3d9b4ef.94add04b.css","assets/1e6d4445.9c560e9c.css"],"scripts":[],"routeData":{"route":"/docs/plugin-api","type":"page","pattern":"^\\/docs\\/plugin-api\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}],[{"content":"plugin-api","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/docs/plugin-api.md","pathname":"/docs/plugin-api","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/e3d9b4ef.94add04b.css","assets/1e6d4445.9c560e9c.css"],"scripts":[],"routeData":{"route":"/docs/webpack","type":"page","pattern":"^\\/docs\\/webpack\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}],[{"content":"webpack","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/docs/webpack.md","pathname":"/docs/webpack","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/e3d9b4ef.94add04b.css","assets/1e6d4445.9c560e9c.css"],"scripts":[],"routeData":{"route":"/docs/intro","type":"page","pattern":"^\\/docs\\/intro\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}],[{"content":"intro","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/docs/intro.md","pathname":"/docs/intro","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.js","@astrojs/react/client.js":"client.bf4f0f8e.js","astro:scripts/before-hydration.js":"data:text/javascript;charset=utf-8,//[no before-hydration script]"},"assets":["/assets/branding.eee3ff4e.css","/assets/branding-index.52076faa.css","/assets/e3d9b4ef.94add04b.css","/assets/index.7f17bcf4.css","/assets/store-index.6bba0b9a.css","/assets/1e6d4445.9c560e9c.css","/assets/branding-index-store-index.112aad5b.css","/client.bf4f0f8e.js","/favicon.svg","/assets/logos/Black.svg","/assets/logos/Blue.svg","/assets/logos/Text-Black.svg","/assets/logos/Text-Blue.svg"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = undefined;

const _exports = adapter.createExports(_manifest, _args);
const _default = _exports['default'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { _default as default };
