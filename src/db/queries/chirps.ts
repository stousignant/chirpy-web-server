import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}

export async function getAllChirps() {
    return await db.select().from(chirps).orderBy(chirps.createdAt);
}

export async function getChirp(id: string) {
    const rows = await db.select().from(chirps).where(eq(chirps.id, id));
    if (rows.length === 0) {
        return;
    }

    return rows[0];
}

export async function deleteAllChirps() {
    await db.delete(chirps);
}