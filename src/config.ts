import type { MigrationConfig } from "drizzle-orm/migrator";

export enum Platform {
    DEV = "dev",
    PROD = "prod",
}

type Config = {
    api: APIConfig,
    db: DBConfig,
};

type APIConfig = {
    port: number,
    platform: string,
    fileServerHits: number,
}

type DBConfig = {
    url: string,
    migrationConfig: MigrationConfig,
}

process.loadEnvFile();

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
};

export const config: Config = {
    api: {
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM"),
        fileServerHits: 0,
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
    },
};

function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Could not find environment variable ${key}`);
    }
    return value;
}