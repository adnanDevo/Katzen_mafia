const kontainer = document.querySelector("#kontainer")
const region = document.querySelector("#region")
const neuMitglied = document.querySelector("#neuMitglied")
const ClanneuesAnlegen = document.querySelector("#ClanneuesAnlegen")
const clanArea = document.querySelector("#mitglieder")
const streuner = document.querySelector("#streuner")

try {
    const res = await fetch("http://127.0.0.1:6767/api/cat")
    if (!res.ok) {
        throw new Error({ fehler: "datei nicht gefunden" })
    }
    const data = await res.json()
    for (const member of data) {
        console.table(member)
        const karte = document.createElement("div")
        karte.className = "karte"
        const karteLinks = document.createElement("div")
        karteLinks.classList.add("linkeKarte")
        const karteRechts = document.createElement("div")
        karteRechts.classList.add("karteRechts")
        const bild = document.createElement("img")
        bild.classList.add("bild")
        bild.src = member.avatar_url
        bild.alt = member.name
        karteLinks.append(bild)
        const katzeName = document.createElement("p")
        katzeName.textContent = member.cat_name
        const katzeRank = document.createElement("p")
        katzeRank.textContent = member.name
        const katzeSpecialty = document.createElement("p")
        katzeSpecialty.textContent = member.skill
        const katzeStatus = document.createElement("p")
        katzeStatus.classList.add("statusKatze")
        if(member.cat_status){
            katzeStatus.textContent= "Aktive"
            katzeStatus.style.color = "green"
        }else{
            katzeStatus.textContent= "Inaktive"
            karte.style.backgroundColor = "rgb(159, 157, 157)"
            katzeStatus.style.color = "red"
        }
       
        karteRechts.append(katzeName, katzeRank, katzeSpecialty,katzeStatus)
        karte.append(karteLinks, karteRechts)
        kontainer.append(karte)
    }

} catch (fehler) {
    console.log('Das hat nicht geklappt:', fehler.message)
}

ClanneuesAnlegen.addEventListener("click", wetierleitenclan)
function wetierleitenclan() {
    window.location.href = "http://127.0.0.1:5500/frontend/clanAnlegen.html"
}
neuMitglied.addEventListener("click", wetierleiten)
function wetierleiten() {
    window.location.href = "http://127.0.0.1:5500/Frontend/indexZwei.html"
}
clanArea.addEventListener("click", mainSeite)
function mainSeite() {
    window.location.href = "http://127.0.0.1:5500/frontend/clanArea.html"

}
region.addEventListener("click", regionSeite)
function regionSeite() {
    window.location.href = "http://127.0.0.1:5500/frontend/regionen.html"

}
streuner.addEventListener("click", streunerSeite)
function streunerSeite() {
    window.location.href = "http://127.0.0.1:5500/frontend/streunerKatzen.html"

}
