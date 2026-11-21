const clanName = document.querySelector("#clan-name")
const clanArea = document.querySelector("#clanarea")
const mitglieder = document.querySelector("#mitglieder")
const fische = document.querySelector("#fische")
const don = document.querySelector("#don")
const clananlegen = document.querySelector("form")
const meldung = document.querySelector("#meldung")
clananlegen.addEventListener("submit", unserclananlegen)
async function unserclananlegen(event) {
    event.preventDefault()
    try {
        const res = await fetch("http://127.0.0.1:6767/api/clan/new", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([
                {
                    name: don.value
                },
                {
                    name: clanName.value,
                    fische: Number(fische.value)
                }
            ])
        })
        if (!res.ok) {
            throw new Error(`HTTP-Fehler: ${res.status}`)
        }
        const ergebnis = await res.json()
        meldung.textContent = "✅ Clan wurde erfolgreich erstellt!"
        meldung.style.color = "green"
    } catch (err) {
        console.error("Fehler beim erstellen des Clan", err)
        meldung.textContent = "❌ Fehler! Clan konnte nicht erstellt werden."
        meldung.style.color = "red"
    }

}
mitglieder.addEventListener("click", hauptSeite)
function hauptSeite() {
    window.location.href = "http://127.0.0.1:5500/frontend/index.html"

}
clanArea.addEventListener("click", mainSeite)
function mainSeite() {
    window.location.href = "http://127.0.0.1:5500/frontend/clanArea.html"

}
