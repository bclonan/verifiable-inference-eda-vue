export default defineNuxtConfig({
    compatibilityDate: "2026-01-20",
    ssr: false,
    nitro: { preset: "netlify" },
    devtools: { enabled: true },
    runtimeConfig: {
        public: {
            apiBase: "/api"
        }
    }
})