const kontainer = document.querySelector("#kontainer")
const ClanneuesAnlegen = document.querySelector("#ClanneuesAnlegen")
const mitglieder = document.querySelector("#mitglieder")
const nameFeld = document.querySelector("#div2")
const rangFeld = document.querySelector("#div4")
const spezialgebietFeld = document.querySelector("#div6")
const bild = document.querySelector("#divlinks")
const vorschauTitel = document.querySelector("#vorschauTitel")
const vorschauBox = document.querySelector("#vorschau")

// Das Bild wird automatisch vom Server gewählt
function zufaelligesBild() {
    return `https://mafiacats.onrender.com/cats/${Math.floor(Math.random() * 15) + 1}`
}
let bildSrc = zufaelligesBild()

// Vorschau nur zeigen, wenn Name und Rang ausgefüllt sind
function aktualisiereVorschau() {
    const bereit = nameFeld.value.trim() !== "" && rangFeld.value.trim() !== ""
    bild.replaceChildren()
    if (bereit) {
        const mBild = document.createElement("img")
        mBild.src = bildSrc
        mBild.alt = "Mitglied_Bild"
        bild.append(mBild)
    }
    vorschauTitel.style.display = bereit ? "" : "none"
    vorschauBox.style.display = bereit ? "" : "none"
}
nameFeld.addEventListener("input", aktualisiereVorschau)
rangFeld.addEventListener("input", aktualisiereVorschau)
aktualisiereVorschau()

kontainer.addEventListener("submit", async (event) => {
    event.preventDefault()
    const name = nameFeld.value
    const rang = rangFeld.value
    const spezialgebiet = spezialgebietFeld.value

    const response = await fetch("http://127.0.0.1:6767/api/cat", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: name,
            rank: rang,
            specialty: spezialgebiet,
            avatar_url: bildSrc,
            status: "aktive"
        })
    });

    if (!response.ok) {
        alert("Mitglied konnte nicht angelegt werden!")
        return
    }

    alert("Mitglied erfolgreich angelegt!")

    // Formular und Vorschau zurücksetzen, damit das nächste Mitglied leer beginnt
    kontainer.reset()
    bildSrc = zufaelligesBild()
    aktualisiereVorschau()
});

ClanneuesAnlegen.addEventListener("click", wetierleitenclan)
function wetierleitenclan() {
    window.location.href = "http://127.0.0.1:5500/frontend/clanAnlegen.html"
}

mitglieder.addEventListener("click", hauptSeite)
function hauptSeite() {
    window.location.href = "http://127.0.0.1:5500/frontend/index.html"
}