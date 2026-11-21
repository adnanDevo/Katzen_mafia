//hier Datenzugriffsschicht kommunikation mit der Datenbank
import { pool } from "../util/db.js"

export async function getAllCats() {
    const conn = await pool.getConnection()

    try {
        const [rows] = await conn.query(`SELECT c.id, c.cat_name , c.gehalt, c.skill ,
            c.cat_status, c.avatar_url , cr.name FROM cat c 
            LEFT JOIN cat_rank cr ON c.cat_rank_id = cr.id `)
        return rows

    } catch (err) {
        throw err

    } finally {
        conn.release()
    }
}
export async function insertNewCat(cat) {

    const [result] = await pool.execute(
        "INSERT INTO cat (cat_name, cat_rank_id, avatar_url) VALUES (:name, :rank, :avatar)",
        {
            name: cat.name,
            rank: cat.cat_rank_id,
            avatar: cat.avatar_url
        }
    )
    return result
}
export async function meineTransaction(ids) {
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        const [clanFische] = await conn.execute(
            "SELECT fische FROM clan WHERE id =?",
            [ids.clanId]
        );
        const [catFische] = await conn.execute(
            "SELECT gehalt FROM cat WHERE id =?",
            [ids.catId]
        )
        if (clanFische.length === 0) {
            throw new Error("Clan existiert nicht!")
        }
        if (catFische.length === 0) {
            throw new Error("Katze existiert nicht!")
        }
        if (Number(clanFische[0].fische) < Number(catFische[0].gehalt)) {
            throw new Error("Der Clan hat nicht genug Fische!");
        }
        await conn.execute(
            "UPDATE cat  SET clan_id = ? WHERE id =?",
            [ids.clanId, ids.catId]
        )
        const neuMenge = Number(clanFische[0].fische) - Number(catFische[0].gehalt)
        await conn.execute(
            "UPDATE clan SET fische =? WHERE id =?",
            [neuMenge, ids.clanId]
        )
        await conn.commit()
        return { success: true,message:"Katze erfolgreich angeheurt" }

    } catch (error) {
        await conn.rollback()
        throw error;
    } finally {
        conn.release()
    }
}