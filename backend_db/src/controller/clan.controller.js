
import { allClans, newClan } from "../service/clan.service.js"

export async function getClans(req, res) {
    const clans = await allClans()
    res.status(200).json(clans)
}

export async function createNewClan(req, res) {
    const result = await newClan(req.body)
    res.status(201).json(result)
}
export function setClanCookie(req, res) {
    const clanID = req.params.id
    res.cookie("clan", clanID, {
       // partitioned: true,
        //secure: true,
       // sameSeite: "none"

    })
    res.sendStatus(200)

}