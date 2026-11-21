import { findAll,changeClanId, changeGewinner } from "../repositories/region.repository.js"

export async function allRegions() {
    const regions = await findAll()
    return regions
}
export async function changeRegionClan(data) {

    const result = await changeClanId(data)

    return result;

}
export async function gewinnerBerechnen(infos) {
    const ergebnis = await changeGewinner(infos)
    return ergebnis
} 