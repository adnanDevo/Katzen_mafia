import { pool } from "../util/db.js"
export async function findAll() {
    const conn = await pool.getConnection()
    try {
        const [rows] = await conn.query("SELECT r.id, r.region_name, r.fish_rate,c.clan_name, EXISTS" +
            "(SELECT 1 FROM regionbattle b WHERE b.region_id = r.id AND b.battle_ongoing = TRUE) AS battle_ongoing," +
            "( SELECT MAX(b.battle_start_time) FROM regionbattle b WHERE b.region_id = r.id AND b.battle_ongoing = TRUE)" +
            " AS battle_start_time FROM region r LEFT JOIN clan c ON c.id = r.clan_id")
        return rows
    } catch (err) {
        throw err

    } finally {
        conn.release()
    }
}
export async function changeClanId(ids) {
    const conn = await pool.getConnection()
    try {
        await conn.beginTransaction()
        const sql1 = `
            SELECT clan_id
            FROM region
            WHERE id = ?
            FOR UPDATE`
        const [erg] = await conn.execute(
            sql1,
            [ids.regionId]
        )
        if (erg.length === 0) {
            throw new Error("Region existiert nicht!")
        }
        if (erg[0].clan_id === null) {
            const sql2 = `
                UPDATE region
                SET clan_id = ?
                WHERE id = ?`
            await conn.execute(
                sql2,
                [ids.clanId, ids.regionId]
            )
            await conn.commit();
            return {
                success: true,
                message: "Region erfolgreich übernommen!"
            }
        }
        else if (erg[0].clan_id == ids.clanId) {
            await conn.commit()
            return {
                success: true,
                message: "Diese Region gehört bereits deinem Clan!"
            }
        }
        else if (erg[0].clan_id == null) {
            await conn.commit()
            return {
                success: true,
                message: "Deiner Clan kann nicht eine Region beanprochen wenn er weniger als 10 fische hat oder weniger als 2 Mitglieder"
            }
        }
        else {
            const sqlCheck =`SELECT cl.id, cl.fische , COUNT(ca.id) AS anzahl_mitglieder FROM clan cl 
            LEFT JOIN cat ca ON ca.clan_id = cl.id WHERE ca.clan_id = cl.id AND cl.id = ? GROUP BY cl.id`
            const [kontrolle] = await conn.execute(sqlCheck,[ids.clanId])
            if(kontrolle.length === 0 || Number(kontrolle[0].fische) < 10 || Number(kontrolle[0].anzahl_mitglieder) < 2){
               await conn.commit()
               return {
                 success: true,
                  message: "Deiner Clan kann nicht eine Region beanprochen wenn er weniger als 10 fische oder weniger als 2 Mitglieder hat"
            } 
            }
            const sql3 = `
                INSERT INTO regionbattle
                (battle_ongoing, battle_start_time, region_id, winner_id)
                VALUES (TRUE, NOW(), ?, NULL)`
            const [kampf] = await conn.execute(
                sql3,
                [ids.regionId]
            )
            const battleId = kampf.insertId;
            const sql4 = `
                INSERT INTO clan_regionbattle
                (clan_id, regionbattle_id)
                VALUES (?, ?)`
            await conn.execute(
                sql4,
                [ids.clanId, battleId]
            )
            const sql5 = `
                INSERT INTO clan_regionbattle
                (clan_id, regionbattle_id)
                VALUES (?, ?)`
            await conn.execute(
                sql5,
                [erg[0].clan_id, battleId]
            );
            await conn.commit()
            return {
                success: true,
                message: "Ein Kampf wurde gestartet!",
                battleId: battleId
            }
        }
    } catch (error) {
        await conn.rollback()
        throw error
    } finally {
        conn.release()
    }
}
export async function changeGewinner(infos) {
    const verbinung = await pool.getConnection()
    try {
        await verbinung.beginTransaction()
        const sqlAnfrage1 = ` SELECT c.id, c.clan_name, c.fische, rb.region_id,sum(gehalt) As gesamtGehlt
         FROM clan c LEFT JOIN clan_regionbattle crb 
        ON crb.clan_id = c.id LEFT JOIN regionbattle rb ON rb.id = crb.regionbattle_id 
        LEFT JOIN cat ca ON ca.clan_id = c.id WHERE rb.region_id = ? AND ca.cat_status = true
        GROUP BY c.id,c.clan_name,c.fische , rb.region_id  ORDER BY (c.id = ?) DESC,c.id ASC`
        const [zeilen1] = await verbinung.execute(sqlAnfrage1, [infos.region_id, infos.clan_id])
        if (zeilen1.length < 2) {
            throw new Error("In dieser Region kämpfen zu wenige Clans!")
        }
        const clanFische0 = Number(zeilen1[0].fische) + Number(zeilen1[0].gesamtGehlt)
        const clanFische1 = Number(zeilen1[1].fische) + Number(zeilen1[1].gesamtGehlt)
        const sqlAnfrage2 = `UPDATE clan SET fische = CASE 
                                WHEN clan_name = ? THEN ?
                                WHEN clan_name = ? THEN ?
                                END
                                WHERE clan_name IN (?, ?)`
        let neueFishe1 = 0
        let neueFishe2 = 0
        if(Number(zeilen1[0].fische) >= 10){
             neueFishe1 = Number(zeilen1[0].fische) - 10 
        }
        if(Number(zeilen1[1].fische) >= 10){
             neueFishe2 = Number(zeilen1[1].fische) - 10 
        }
        const [zeilen2] = await verbinung.execute(sqlAnfrage2, [zeilen1[0].clan_name,neueFishe1, zeilen1[1].clan_name, neueFishe2,zeilen1[0].clan_name,zeilen1[1].clan_name])
        const sqlAnfrage3 = `UPDATE cat SET cat_status = ? WHERE ( clan_id = ? AND id =(SELECT id FROM
                   (SELECT id FROM cat WHERE clan_id = ? AND cat_rank_id <> 10 AND cat_status <> false ORDER BY RAND() LIMIT 1 ) AS erste_katze)OR
                   (clan_id = ? AND id =(SELECT id FROM
                   (SELECT id FROM cat WHERE clan_id = ? AND cat_rank_id <> 10 AND cat_status <> false ORDER BY RAND() LIMIT 1 ) AS zweite_katze))) `
        const [zeilen3] = await verbinung.execute(sqlAnfrage3, [false, zeilen1[0].id, zeilen1[0].id, zeilen1[1].id, zeilen1[1].id])
        const sqlAnfrage4 = `UPDATE regionbattle rb LEFT JOIN region r ON rb.region_id = r.id
                             SET rb.battle_ongoing = ? , rb.winner_id = ?, r.clan_id = ?
                             WHERE region_id = ? `
        
        
        if (clanFische0 > clanFische1) {
            const gewinner = zeilen1[0].clan_name
            const [zeilen4] = await verbinung.execute(sqlAnfrage4,[false,zeilen1[0].id,zeilen1[0].id,infos.region_id])
             await verbinung.commit()
            return {
                success: true,
                message: "Eine neuer Clan hat dieser Region übernommen",
                gewinner:gewinner
            }
        }else if(clanFische0 <= clanFische1){
            const gewinner = zeilen1[1].clan_name
            const [zeilen4] = await verbinung.execute(sqlAnfrage4,[false,zeilen1[1].id,zeilen1[1].id,infos.region_id])
            await verbinung.commit()
            return {
                success: true,
                message: "der Verteidiger herrscht  immer noch über diesen Region ",
                gewinner:gewinner
            }
        
        }
    } catch (error) {
        await verbinung.rollback()
        throw error

    } finally {
        verbinung.release()
    }
}

