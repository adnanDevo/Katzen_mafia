import { pool } from "../util/db.js"

export async function getAllClans() {
    const conn = await pool.getConnection()

    try {
        const [rows] = await conn.query("SELECT c.id, c.clan_name,c.fische,d.cat_name AS don_name, d.avatar_url AS don_bild,COUNT(DISTINCT r.id) AS anzahl_regionen,COUNT(DISTINCT k.id) AS anzahl_mitglieder FROM clan c LEFT JOIN cat k ON k.clan_id = c.id LEFT JOIN region r ON r.clan_id = c.id LEFT JOIN cat d ON d.id = c.don_id GROUP BY c.id, c.clan_name, c.fische, d.cat_name, d.avatar_url;")
        return rows

    } catch(err) {
        throw err

    } finally {
        conn.release()
    }
}


export async function createNewClan(clan, cat) {

    const conn = await pool.getConnection()

    try {
        await conn.beginTransaction()

        // 1. Katze als Don erstellen

        const [catRes] = await conn.execute(
            `INSERT INTO cat
            (cat_name, cat_rank_id, avatar_url)
            VALUES (:name, :rank, :avatar)`,
            cat
        )

        clan.don_id = catRes.insertId

        // 2. Clan erstellen

        const [clanRes] = await conn.execute(
            `INSERT INTO clan
            (clan_name, don_id, fische)
            VALUES (:name, :don_id, :fische)`,
            clan
        )

        const clanId = clanRes.insertId

        // 3. Katze dem Clan zuordnen

        await conn.execute(
            "UPDATE cat SET clan_id = ? WHERE id = ?",
            [clanId, clan.don_id]
        )

        await conn.commit()

        return {
            catId: clan.don_id,
            clanId
        }

    } catch(err) {

        await conn.rollback()
        throw err

    } finally {

        conn.release()
    }
}