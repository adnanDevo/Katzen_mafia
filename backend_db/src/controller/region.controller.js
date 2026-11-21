
import { json } from "express";
import { allRegions, changeRegionClan, gewinnerBerechnen } from "../service/region.service.js";

export async function changeOwner(req, res) {
    try {
        const ids = {
            clanId: req.cookies.clan,
            regionId: req.params.id
        }
        const result = await changeRegionClan(ids)
        res.json(result)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: "Da hat was nicht geklappt" })
    }
}
export async function getRegions(req, res) {
    const regions = await allRegions()
    res.status(200).json(regions)
}
export async function gewinnerZeigen(req, res) {
    try {
        const infos = {
            clan_id: req.cookies.clan,
            region_id: req.params.id
        }
        const gewinnerName = await gewinnerBerechnen(infos)
        res.json(gewinnerName)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Da hat was nicht geklappt" })
    }

}