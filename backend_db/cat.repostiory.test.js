import { jest, beforeEach, describe, it, expect } from "@jest/globals";

// Künstliche Datenbankverbindung
const mockConn = {
    query: jest.fn(),
    release: jest.fn()
};

// Echte Datenbankverbindung durch Mock ersetzen
jest.unstable_mockModule("./src/util/db.js", () => ({
    pool: {
        getConnection: jest.fn()
    }
}));

// Erst nach dem Mock importieren
const { pool } = await import("./src/util/db.js");

const { getAllCats } = await import(
    "./src/repositories/cat.repository.js"
);

// Vor jedem Test vorbereiten
beforeEach(() => {
    jest.resetAllMocks();

    pool.getConnection.mockResolvedValue(mockConn);
});

// Tests für getAllCats
describe("getAllCats", () => {

    it("liefert alle Katzen aus der Datenbank", async () => {

        // Testdaten
        const cats = [
            { id: 1, cat_name: "Hamburger" },
            { id: 2, cat_name: "Fischstäbchen" }
        ];

        // SQL-Ergebnis simulieren
        mockConn.query.mockResolvedValue([cats, []]);

        // Repository-Funktion ausführen
        const result = await getAllCats();

        // Ergebnis überprüfen
        expect(result).toEqual(cats);

        // Überprüfen, ob die richtige Tabelle abgefragt wurde
        expect(mockConn.query).toHaveBeenCalledWith(
            expect.stringContaining("FROM cat c")
        );

        // Überprüfen, ob die Verbindung freigegeben wurde
        expect(mockConn.release).toHaveBeenCalledTimes(1);

    });

});