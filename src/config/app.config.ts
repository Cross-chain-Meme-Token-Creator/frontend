export enum NodeEnv {
    Development = "development",
    Production = "production"
}

export const appConfig = {
    inProduction: false,
    //process.env.NODE_ENV as NodeEnv === NodeEnv.Production,
    timeOuts: {
        searchTimeout: 1_000
    }
}