import { appConfig } from "@config"

const BACKEND_DEVELOPMENT_URL = process.env.NEXT_PUBLIC_BACKEND_DEVELOPMENT_URL
const BACKEND_PRODUCTION_URL = process.env.NEXT_PUBLIC_BACKEND_PRODUCTION_URL

export const backendUrl = () =>
    appConfig.inProduction ? BACKEND_PRODUCTION_URL : BACKEND_DEVELOPMENT_URL
