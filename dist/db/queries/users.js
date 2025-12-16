import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { users } from "../schema.js";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function deleteAllUsers() {
    await db.delete(users);
}
export async function getUserByEmail(email) {
    const rows = await db.select().from(users).where(eq(users.email, email));
    if (rows.length === 0) {
        return;
    }
    return rows[0];
}
