import { v as vueExports, s as serverRenderer_cjs_prodExports } from "../server.mjs";
import "C:/Users/bradl/OneDrive/Documents/GitHub/verifiable-inference-eda-vue/node_modules/.pnpm/hookable@5.5.3/node_modules/hookable/dist/index.mjs";
import "C:/Users/bradl/OneDrive/Documents/GitHub/verifiable-inference-eda-vue/node_modules/.pnpm/ofetch@1.5.1/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/bradl/OneDrive/Documents/GitHub/verifiable-inference-eda-vue/node_modules/.pnpm/unctx@2.5.0/node_modules/unctx/dist/index.mjs";
import "C:/Users/bradl/OneDrive/Documents/GitHub/verifiable-inference-eda-vue/node_modules/.pnpm/h3@1.15.5/node_modules/h3/dist/index.mjs";
import "C:/Users/bradl/OneDrive/Documents/GitHub/verifiable-inference-eda-vue/node_modules/.pnpm/radix3@1.1.2/node_modules/radix3/dist/index.mjs";
import "C:/Users/bradl/OneDrive/Documents/GitHub/verifiable-inference-eda-vue/node_modules/.pnpm/defu@6.1.4/node_modules/defu/dist/defu.mjs";
import "C:/Users/bradl/OneDrive/Documents/GitHub/verifiable-inference-eda-vue/node_modules/.pnpm/ufo@1.6.3/node_modules/ufo/dist/index.mjs";
import "node:stream";
const _sfc_main = /* @__PURE__ */ vueExports.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const sessionId = vueExports.ref("S123");
    const busy = vueExports.ref(false);
    const error = vueExports.ref(null);
    const activity = vueExports.ref(null);
    const summary = vueExports.ref(null);
    const lastReceiptId = vueExports.ref(null);
    const lastReceipt = vueExports.ref(null);
    const verifyResult = vueExports.ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${serverRenderer_cjs_prodExports.ssrRenderAttrs(vueExports.mergeProps({ style: { "max-width": "980px", "margin": "0 auto", "padding": "24px", "font-family": "ui-sans-serif, system-ui" } }, _attrs))}><h1>Verifiable Inference EDA — v0.1</h1><p> Deterministic core (events→state→views) with a bounded inference plane (Inference URI + receipts). </p><section style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "display": "flex", "gap": "12px", "flex-wrap": "wrap", "margin": "16px 0" })}"><button${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(busy)) ? " disabled" : ""}>Emit Demo Events</button><button${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(busy)) ? " disabled" : ""}>Get session_activity@1</button><button${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(busy)) ? " disabled" : ""}>Get session_summary@1 (inference)</button><button${serverRenderer_cjs_prodExports.ssrIncludeBooleanAttr(vueExports.unref(busy) || !vueExports.unref(lastReceiptId)) ? " disabled" : ""}>Verify last receipt</button></section><section style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "display": "grid", "grid-template-columns": "1fr", "gap": "16px" })}"><div><h3>Session</h3><label>sessionId:</label><input${serverRenderer_cjs_prodExports.ssrRenderAttr("value", vueExports.unref(sessionId))} style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "width": "260px", "margin-left": "8px" })}"></div>`);
      if (vueExports.unref(activity)) {
        _push(`<div><h3>Deterministic View Output (session_activity@1)</h3><pre>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(activity))}</pre></div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(summary)) {
        _push(`<div><h3>Inference View Output (session_summary@1)</h3><pre>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(summary))}</pre></div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(lastReceipt)) {
        _push(`<div><h3>Receipt</h3><pre>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(lastReceipt))}</pre></div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(verifyResult)) {
        _push(`<div><h3>Verify Result</h3><pre>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(verifyResult))}</pre></div>`);
      } else {
        _push(`<!---->`);
      }
      if (vueExports.unref(error)) {
        _push(`<div style="${serverRenderer_cjs_prodExports.ssrRenderStyle({ "color": "#b91c1c" })}"><h3>Error</h3><pre>${serverRenderer_cjs_prodExports.ssrInterpolate(vueExports.unref(error))}</pre></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vueExports.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-BGofqpj_.js.map
