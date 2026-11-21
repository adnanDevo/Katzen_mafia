//Hier werden die http Requests und Respondes behandelt

import { allCats, createNewDon,changeCatClan } from "../service/cat.service.js";
export async function getCats(req,res){
    const cats = await allCats()
    res.status(200).json(cats)


}
export async function createDon(req,res) {
    const result = await createNewDon(req.body)
    res.status(201).json(result)
}
export async function changeBoss(req, res) {

    try {

        const ids = {
            clanId: Number(req.cookies?.clan),
            catId: Number(req.params.id)
        };

        if (
            !Number.isInteger(ids.clanId) ||
            ids.clanId <= 0 ||
            !Number.isInteger(ids.catId) ||
            ids.catId <= 0
        ) {
            return res.status(400).json({
                error: "Ungültige Clan-ID oder Katzen-ID!"
            });
        }

        const result = await changeCatClan(ids);

        return res.status(200).json(result);

    } catch (error) {

        console.error("Fehler bei der Anheuerung:", error.message);

        if (error.message === "Der Clan hat nicht genug Fische!") {
            return res.status(400).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: "Die Anheuerung konnte nicht abgeschlossen werden."
        });

    }
}