import { t as tryUseNuxtApp, v as vueExports } from "../server.mjs";
import { useHead as useHead$1, headSymbol } from "C:/Users/bradl/OneDrive/Documents/GitHub/verifiable-inference-eda-vue/node_modules/.pnpm/@unhead+vue@2.1.2_vue@3.5.27_typescript@5.9.3_/node_modules/@unhead/vue/dist/index.mjs";
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || tryUseNuxtApp();
  return nuxt?.ssrContext?.head || nuxt?.runWithContext(() => {
    if (vueExports.hasInjectionContext()) {
      return vueExports.inject(headSymbol);
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}
export {
  useHead as u
};
//# sourceMappingURL=v3-B7ac-1pK.js.map
