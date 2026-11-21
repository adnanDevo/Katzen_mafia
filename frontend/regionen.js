const API_URL = "http://127.0.0.1:6767/api"
async function ladeRegionen() {
    const container = document.querySelector("#regionen-container")
    container.replaceChildren()
    try {
        const response = await fetch(`${API_URL}/region`, {
            credentials: "include"
        })
        if (!response.ok) {
            throw new Error("Regionen konnten nicht geladen werden")
        }
        const regionen = await response.json()
        for (const region of regionen) {
            const karte = document.createElement("div")
            karte.className = "region-card"
            const regionId = document.createElement("p")
            regionId.classList.add("region-id")
            regionId.textContent = "Region " + `${region.id}`
            const regionName = document.createElement("h3")
            regionName.classList.add("regionName")
            regionName.textContent = region.region_name
            const fischbereich = document.createElement("div")
            fischbereich.classList.add("bereich")
            const fischeBild = document.createElement("p")
            fischeBild.classList.add("info-label")
            fischeBild.textContent = "🐟 Fischrate :"
            const fischeRate = document.createElement("p")
            fischeRate.classList.add("fischeRate")
            fischeRate.textContent = region.fish_rate
            fischbereich.append(fischeBild, fischeRate)
            const herrscherbereich = document.createElement("div")
            herrscherbereich.classList.add("bereich")
            const herrscherlogo = document.createElement("p")
            herrscherlogo.classList.add("info-label")
            herrscherlogo.textContent = "👑 Herrscher:"
            const herrscherName = document.createElement("p")
            herrscherName.classList.add("info-label")
            herrscherName.textContent = region.clan_name || "Nicht bekannt"
            herrscherbereich.append(herrscherlogo, herrscherName)

            const regionUebernahme = document.createElement("button")
            regionUebernahme.classList.add("region-button")
            const regionstatus = region.battle_ongoing
            if (!regionstatus) {
                regionUebernahme.textContent = "Region übernehmen"
            } else {
                regionUebernahme.textContent = "⚔️ Kampf läuft!"
                regionUebernahme.disabled = true
                karte.classList.add("kampf")
                const zeitButton = document.createElement("button")
                zeitButton.classList.add("zeit-button")
                const zeitZahl = zeitBerechnen(region)
                console.log(zeitZahl)
                
                if (zeitZahl != "Gewinner Zeigen") {
                    zeitButton.textContent = zeitZahl
                    zeitButton.disabled = true
                    seiteZeigen()   
                   
                }
                zeitButton.textContent = zeitZahl
                karte.append(zeitButton)
                zeitButton.addEventListener("click", async () => {
                    try {
                        const resp = await fetch(
                            `${API_URL}/region/gewinner/${region.id}`,
                            {
                                method: "PUT",
                                credentials: "include"
                            }
                        )
                        if (!resp.ok) {
                            throw new Error("Regionen konnten nicht geladen werden")
                        }
                        const ergebnisse = await resp.json()
                        if (!ergebnisse.gewinner == false) {
                            alert(ergebnisse.message)
                            herrscherName.textContent = ergebnisse.gewinner
                            regionUebernahme.textContent = "Region übernehmen"
                            regionUebernahme.disabled = false
                            karte.className = "region-card"
                            zeitButton.style.display = "none"
                            ladeRegionen()
                        }

                    } catch (error) {
                        console.error("Fehler beim Laden der Regionen:", error);
                        container.textContent = "Die Regionen konnten nicht geladen werden."
                    }
                })
            }
            karte.append(regionId, regionName, fischbereich, herrscherbereich, regionUebernahme)

            regionUebernahme.addEventListener("click", () => {
                regionUebernehmen(region.id, regionUebernahme);
            })
            container.appendChild(karte);
        }
    } catch (error) {
        console.error("Fehler beim Laden der Regionen:", error);
        container.textContent = "Die Regionen konnten nicht geladen werden."
    }
}
async function regionUebernehmen(regionId, button) {
    const clanCookie = document.cookie
        .split("; ")
        .find(cookie => cookie.startsWith("clan="));
    if (!clanCookie) {
        alert("Bitte wähle zuerst einen Clan in der Clan Area aus!");
        return
    }
    const bestaetigung = confirm(
        `Möchtest du Region ${regionId} für deinen Clan übernehmen?`
    )
    if (!bestaetigung) {
        return
    }
    button.disabled = true
    button.textContent = "Wird übernommen ..."
    try {
        const response = await fetch(
            `${API_URL}/region/${regionId}`,
            {
                method: "PUT",
                credentials: "include"
            }
        )
        if (!response.ok) {
            throw new Error("Region konnte nicht übernommen werden");
        }
        const result = await response.json();
        if (!result.success) {
            alert("Diese Region wurde nicht gefunden!")
            return
        }
        alert(result.message)
        await ladeRegionen()
    } catch (error) {
        console.error("Fehler beim Übernehmen:", error)
        alert("Die Region konnte nicht übernommen werden!")
    } finally {
        button.disabled = false
        button.textContent = "Region übernehmen"
    }
}
function zeitBerechnen(region) {
    const startZeit = new Date(region.battle_start_time).getTime()
    const endZeit = startZeit + (3 * 60 * 1000)
    const verbleibendeZeit = endZeit - Date.now()
    const zeit = Math.trunc(verbleibendeZeit / (1000 * 60))
    if (zeit >= 1) {
        return zeit + " Min noch bis Kampfende"
    }
    return "Gewinner Zeigen"
}
function seiteZeigen() {
    setTimeout(() => {
        ladeRegionen()
    }, 60000)
    
    
}

ladeRegionen()