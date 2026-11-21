//
import { getAllCats, insertNewCat,meineTransaction } from "../repositories/cat.repository.js"
export async function allCats(){
  const cats = await getAllCats()
  return cats
}
export async function createNewDon(cat) {
  cat.cat_rank_id = 1
  cat.avatar_url = cat.avatar_url || "https://mafiacats.onrender.com/cats/12"
  return await insertNewCat(cat)
}
export async function changeCatClan(ids) {

    const result = await meineTransaction(ids);

    return result

}