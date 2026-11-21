const klanKontainer = document.querySelector("#clanKontainer")
const knopf1 = document.querySelector("#knopf1")
const knopf2 = document.querySelector("#knopf2")

const res = await fetch("http://127.0.0.1:6767/api/clan")
const daten = await res.json()
for(const katze of daten){
    console.log(katze.id)
    const karte = document.createElement("div")
    karte.classList.add("karte")

     const karteOben = document.createElement("div")
     karteOben.classList.add("karteoben")
     const clanName = document.createElement("p")
     clanName.textContent = katze.clan_name
     karteOben.append(clanName)
     const karteLinks = document.createElement("div")
     karteLinks.classList.add("kartelinks")
     const donfoto = document.createElement("img")
     donfoto.classList.add("donfoto")
     donfoto.src = katze.don_bild
     donfoto.alt ="bild"
     karteLinks.append(donfoto)
    const karteRechts = document.createElement("div")
    karteRechts.classList.add("karterecht")
    const donName = document.createElement("p")
    donName.textContent = "BOSS: "+(katze.don_name)
    const anzahlGebiete = document.createElement("p")
    anzahlGebiete.textContent ="Anzahl Gebiete: " + katze.anzahl_regionen
    const anzahlFische = document.createElement("p")
    anzahlFische.textContent ="Fische: "+ katze.fische
    const anzahlMitgliede = document.createElement("p")
    anzahlMitgliede.textContent = "Anzahl Mitglieder: "+katze.anzahl_mitglieder
    karteRechts.append(donName,anzahlGebiete,anzahlFische,anzahlMitgliede)
    const karteMitte = document.createElement("div")
    karteMitte.classList.add("kartemitte")
    karteMitte.append(karteLinks,karteRechts)
    const karteUnten = document.createElement("button")
    karteUnten.classList.add("karteunten")
    karteUnten.textContent = "Wählen"
    karteUnten.addEventListener("click", async (event) => {
        const resp = await fetch("http://127.0.0.1:6767/api/clan"+`/set/${katze.id}`,{
            credentials:"include"
            
        })
        alert(`der Clan ${katze.clan_name} wurde erfolgreich ausgewählt !`)
    })
    karte.append(karteOben,karteMitte,karteUnten)
    klanKontainer.append(karte)
    
}
knopf1.addEventListener("click",zuClanSeite)
function zuClanSeite(){
    window.location.href="http://127.0.0.1:5500/frontend/clanAnlegen.html"
}
knopf2.addEventListener("click",zuHauptSeite)
function zuHauptSeite(){
    window.location.href="http://127.0.0.1:5500/frontend/index.html"
}