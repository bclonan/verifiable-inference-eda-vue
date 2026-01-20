export default defineNuxtConfig({
    compatibilityDate: "2026-01-20",

    nitro: {
        preset: "netlify"
    },

    ssr: false, // important for static SPA-style demo

    devtools: { enabled: true },

    runtimeConfig: {
        public: {
            apiBase: "/api"
        }
    }
})
