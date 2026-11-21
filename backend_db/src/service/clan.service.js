
import { getAllClans, createNewClan } from "../repositories/clan.repository.js"

export async function allClans() {
    const clans = await getAllClans()
    return clans
}

export async function newClan(data) {
    const [cat, clan] = data

    cat.rank = 10
    cat.avatar = "https://mafiacats.onrender.com/cats/4"
    if (clan.fische == null) {
    clan.fische = 100
}

    return await createNewClan(clan, cat)
}