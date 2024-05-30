export enum NodeEnv {
    Development = "development",
    Production = "production"
}

export const appConfig = {
    inProduction: process.env.NODE_ENV as NodeEnv === NodeEnv.Production,
}