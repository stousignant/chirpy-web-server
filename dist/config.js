export var Platform;
(function (Platform) {
    Platform["DEV"] = "dev";
    Platform["PROD"] = "prod";
})(Platform || (Platform = {}));
process.loadEnvFile();
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
export const config = {
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
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Could not find environment variable ${key}`);
    }
    return value;
}
