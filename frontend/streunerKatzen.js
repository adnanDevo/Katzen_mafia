const katzenKontainer = document.querySelector("#katzenKontainer")
const alleMitglieder = document.querySelector("#knopf2")
const alleClans = document.querySelector("#knopf1")
const url = "http://127.0.0.1:6767/api/cat"
async function hollDieKatzen(url) {
    try {
        const res = await fetch(url, {
            credentials: "include"
        })
        if (!res.ok) {
            throw new Error("Katzen konnten nicht geladen werden")
        }
        const daten = await res.json()
        katzenKontainer.innerHTML = ""
        for (const katze of daten) {
            const karte = document.createElement("div")
            karte.classList.add("karte")
            const karteOben = document.createElement("div")
            karteOben.classList.add("karteOben")
            const catfoto = document.createElement("img")
            catfoto.classList.add("catfoto")
            catfoto.src = katze.avatar_url
            catfoto.alt = "Katze"
            karteOben.append(catfoto)
            const karteMitte = document.createElement("div")
            karteMitte.classList.add("karteMitte");
            const catName = document.createElement("p")
            catName.textContent = katze.cat_name
            catName.classList.add("catname")
            const catSkills = document.createElement("p")
            catSkills.textContent = katze.skill
            const gehalt = document.createElement("p");
            gehalt.textContent = "Gehalt: " + katze.gehalt
            const einstellen = document.createElement("button")
            einstellen.textContent = "Rekrutieren"
            einstellen.addEventListener("click", () => {
                katzeEinstellen(katze.id, einstellen)
            })
            karteMitte.append(
                catName,
                catSkills,
                gehalt,
                einstellen
            )
            karte.append(karteOben, karteMitte)
            katzenKontainer.append(karte)
        }
    } catch (error) {
        console.error("Fehler beim Laden der Katzen:", error)
        katzenKontainer.textContent =
            "Die Katzen konnten nicht geladen werden."
    }
}
async function katzeEinstellen(catId, taste) {
    const clanCookie = document.cookie
        .split("; ")
        .find(cookie => cookie.startsWith("clan="))
    if (!clanCookie) {
        alert("Bitte wähle zuerst einen Clan in der Clan Area aus!")
        return
    }
    const bestaetigung = confirm(
        `Möchtest du Kazte ${catId} für deinen Clan anheuern?`
    )
    if (!bestaetigung) {
        return
    }
    taste.disabled = true;
    taste.textContent = "Wird angeheurt ..."
    try {
        const response = await fetch(
            `${url}/${catId}`,
            {
                method: "PUT",
                credentials: "include"
            }
        )
        const result = await response.json()
        if (!response.ok) {
            alert(result.error || "Die Katze konnte nicht angeheuert werden!")
            return
        }
        if (!result.success) {
            alert(result.message || "Die Anheuerung ist fehlgeschlagen!")
            return
        }
        alert("Die Katze ist jetzt Teil von deinem Clan!");

        // Katzen neu laden
        await hollDieKatzen(url);
    } catch (error) {
        console.error("Fehler beim Einsellen:", error)
        alert("Die Katze konnte nicht angeheurt werden!")
    } finally {
        taste.disabled = false
        taste.textContent = "Rekrutieren"
    }
}
hollDieKatzen(url)
alleMitglieder.addEventListener("click", mitgliederSeite)
function mitgliederSeite() {
    window.location.href = "./index.html"
}
alleClans.addEventListener("click", zuClanSeite)
function zuClanSeite() {
    window.location.href = "./clanArea.html"
}