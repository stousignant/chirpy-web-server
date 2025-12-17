import type { MigrationConfig } from "drizzle-orm/migrator";


export enum Platform {
    DEV = "dev",
    PROD = "prod",
}

type Config = {
    api: APIConfig,
    db: DBConfig,
    jwt: JWTConfig,
};

type APIConfig = {
    port: number,
    platform: string,
    polkaApiKey: string,
    fileServerHits: number,
}

type DBConfig = {
    url: string,
    migrationConfig: MigrationConfig,
}

type JWTConfig = {
    secret: string,
    issuer: string,
    accessTokenDuration: number,
    refreshTokenDuration: number,
}

process.loadEnvFile();

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
    api: {
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM"),
        polkaApiKey: envOrThrow("POLKA_KEY"),
        fileServerHits: 0,
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    },
    jwt: {
        secret: envOrThrow("SECRET"),
        issuer: "chirpy",
        accessTokenDuration: 60 * 60, // 1 hour in seconds
        refreshTokenDuration: 60 * 60 * 24 * 60 // 60 days in seconds
    }
};

function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Could not find environment variable ${key}`);
    }
    return value;
}