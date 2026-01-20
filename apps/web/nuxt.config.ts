export default defineNuxtConfig({
    compatibilityDate: "2026-01-20",
    ssr: false,
    nitro: { preset: "netlify" },
    devtools: { enabled: true },

    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api"
        }
    },

    app: {
        head: {
            title: "Verifiable Inference EDA",
            meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }]
        }
    }
})
