-- =====================================================================
-- Cat Mafia – Datenbank "mafiacats"
-- Erstellt die Datenbank, alle Tabellen mit Beziehungen und die Startdaten.
--
-- Import (PowerShell, im Projektordner):
--   mysql -u root -p
--   SOURCE database/mafiacats.sql;
-- =====================================================================

DROP DATABASE IF EXISTS mafiacats;
CREATE DATABASE mafiacats CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mafiacats;

-- clan.don_id zeigt auf cat und cat.clan_id zeigt auf clan.
-- Wegen dieser gegenseitigen Verbindung werden die Prüfungen beim Einfügen kurz ausgeschaltet.
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- Tabellen
-- ---------------------------------------------------------------------

-- Ränge der Katzen (1 = Straßenkater ... 10 = Don)
CREATE TABLE cat_rank (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

-- Clans (eine Katze ist der Don des Clans)
CREATE TABLE clan (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    clan_name VARCHAR(50) NOT NULL,
    fische    INT,
    don_id    INT
);

-- Katzen (Mitglieder). Ohne Clan = Streuner (clan_id ist NULL)
CREATE TABLE cat (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    cat_name    VARCHAR(50) NOT NULL,
    skill       VARCHAR(50),
    cat_rank_id INT,
    clan_id     INT,
    cat_status  TINYINT(1) DEFAULT 1,   -- 1 = aktiv, 0 = inaktiv
    avatar_url  VARCHAR(255),
    gehalt      INT DEFAULT 20
);

-- Regionen (gehören einem Clan oder niemandem)
CREATE TABLE region (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    region_name VARCHAR(50) NOT NULL,
    fish_rate   INT NOT NULL,
    clan_id     INT
);

-- Kämpfe um eine Region
CREATE TABLE regionbattle (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    battle_ongoing    TINYINT(1) NOT NULL,
    battle_start_time DATETIME NOT NULL,
    region_id         INT NOT NULL,
    winner_id         INT
);

-- Verbindungstabelle: welche Clans an welchem Kampf teilnehmen (n:m)
CREATE TABLE clan_regionbattle (
    clan_id         INT NOT NULL,
    regionbattle_id INT NOT NULL,
    PRIMARY KEY (clan_id, regionbattle_id)
);

-- ---------------------------------------------------------------------
-- Beziehungen (Fremdschlüssel)
-- ---------------------------------------------------------------------

ALTER TABLE clan
    ADD CONSTRAINT fk_clan_don
    FOREIGN KEY (don_id) REFERENCES cat(id) ON DELETE SET NULL;

ALTER TABLE cat
    ADD CONSTRAINT fk_cat_rank
    FOREIGN KEY (cat_rank_id) REFERENCES cat_rank(id),
    ADD CONSTRAINT fk_cat_clan
    FOREIGN KEY (clan_id) REFERENCES clan(id) ON DELETE SET NULL;

ALTER TABLE region
    ADD CONSTRAINT fk_region_clan
    FOREIGN KEY (clan_id) REFERENCES clan(id) ON DELETE SET NULL;

ALTER TABLE regionbattle
    ADD CONSTRAINT fk_battle_region
    FOREIGN KEY (region_id) REFERENCES region(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_battle_winner
    FOREIGN KEY (winner_id) REFERENCES clan(id) ON DELETE SET NULL;

ALTER TABLE clan_regionbattle
    ADD CONSTRAINT fk_crb_clan
    FOREIGN KEY (clan_id) REFERENCES clan(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_crb_battle
    FOREIGN KEY (regionbattle_id) REFERENCES regionbattle(id) ON DELETE CASCADE;

-- ---------------------------------------------------------------------
-- Startdaten
-- ---------------------------------------------------------------------

INSERT INTO cat_rank (id, name) VALUES
(1, 'Straßenkater'),
(2, 'Gelegenheitsdieb'),
(3, 'Späher'),
(4, 'Schläger'),
(5, 'Fischschmuggler'),
(6, 'Soldat'),
(7, 'Caporegime'),
(8, 'Consigliere'),
(9, 'Underboss'),
(10, 'Don');

INSERT INTO clan (id, clan_name, fische, don_id) VALUES
(1, 'Die Schnurrenden Sensenmänner', 9980, 70),
(3, 'Die Schattenpfoten', 100, 102),
(4, 'der Bosen', 0, 103),
(5, 'die Katianos', 110, 104),
(7, 'die Piraten Mausis', 160, 106);

INSERT INTO cat (id, cat_name, skill, cat_rank_id, clan_id, cat_status, avatar_url, gehalt) VALUES
(1, 'Milo', 'Taschendiebstahl', 1, NULL, 1, 'https://mafiacats.onrender.com/cats/9', 20),
(2, 'Luna', 'Leises Anschleichen', 2, 4, 1, 'https://mafiacats.onrender.com/cats/8', 20),
(3, 'Shadow', 'Schattenbewegung', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/4', 20),
(4, 'Tiger', 'Einschüchterung', 4, NULL, 1, 'https://mafiacats.onrender.com/cats/11', 20),
(5, 'Smokey', 'Fischschmuggel', 5, NULL, 1, 'https://mafiacats.onrender.com/cats/6', 20),
(6, 'Felix', 'Nahkampf', 6, 5, 0, 'https://mafiacats.onrender.com/cats/8', 20),
(7, 'Bandit', 'Überfallplanung', 7, NULL, 1, 'https://mafiacats.onrender.com/cats/5', 20),
(8, 'Cleo', 'Verhandlung', 8, 5, 0, 'https://mafiacats.onrender.com/cats/3', 20),
(9, 'Rocco', 'Organisation', 9, NULL, 1, 'https://mafiacats.onrender.com/cats/12', 20),
(10, 'Don Whiskers', 'Strategische Führung', 10, 1, 1, 'https://mafiacats.onrender.com/cats/11', 20),
(11, 'Balu', 'Spurensuche', 1, NULL, 1, 'https://mafiacats.onrender.com/cats/8', 20),
(12, 'Nala', 'Tarnung', 2, 4, 0, 'https://mafiacats.onrender.com/cats/12', 20),
(13, 'Krümel', 'Taschenklauberei', 1, NULL, 1, 'https://mafiacats.onrender.com/cats/7', 20),
(14, 'Shadowfax', 'Nachtaufklärung', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/15', 20),
(15, 'Brutus', 'Kraft', 4, 4, 1, 'https://mafiacats.onrender.com/cats/2', 20),
(16, 'Sushi', 'Fischhandel', 5, NULL, 1, 'https://mafiacats.onrender.com/cats/13', 20),
(17, 'Rambo', 'Kampftaktik', 6, NULL, 1, 'https://mafiacats.onrender.com/cats/5', 20),
(18, 'Viper', 'Geheiminformationen', 7, 4, 1, 'https://mafiacats.onrender.com/cats/12', 20),
(19, 'Misty', 'Diplomatie', 8, NULL, 1, 'https://mafiacats.onrender.com/cats/5', 20),
(20, 'Don Purrone', 'Mafiaführung', 10, NULL, 1, 'https://mafiacats.onrender.com/cats/3', 20),
(21, 'Oskar', 'Diebstahl', 2, NULL, 1, 'https://mafiacats.onrender.com/cats/7', 20),
(22, 'Peaches', 'Spuren verwischen', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/15', 20),
(23, 'Zorro', 'Maskierung', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/14', 20),
(24, 'Kira', 'Überwachung', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/11', 20),
(25, 'Diesel', 'Einschüchterung', 4, NULL, 1, 'https://mafiacats.onrender.com/cats/4', 20),
(26, 'Muffin', 'Schmuggelrouten', 5, NULL, 1, 'https://mafiacats.onrender.com/cats/15', 20),
(27, 'Rocky', 'Revierverteidigung', 6, NULL, 1, 'https://mafiacats.onrender.com/cats/9', 20),
(28, 'Schatzi', 'Bestechung', 7, NULL, 1, 'https://mafiacats.onrender.com/cats/3', 20),
(29, 'Morpheus', 'Geheime Absprachen', 8, NULL, 1, 'https://mafiacats.onrender.com/cats/5', 20),
(30, 'Don Clawdius', 'Strategische Planung', 10, NULL, 1, 'https://mafiacats.onrender.com/cats/6', 20),
(31, 'Findus', 'Aufklärung', 1, 4, 1, 'https://mafiacats.onrender.com/cats/15', 20),
(32, 'Pünktchen', 'Taschendiebstahl', 2, NULL, 1, 'https://mafiacats.onrender.com/cats/10', 20),
(33, 'Raven', 'Nachtwache', 3, 1, 1, 'https://mafiacats.onrender.com/cats/15', 20),
(34, 'Blitz', 'Schnelle Flucht', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/15', 20),
(35, 'Hektor', 'Drohgebärden', 4, NULL, 1, 'https://mafiacats.onrender.com/cats/2', 20),
(36, 'Wasabi', 'Fischhandel', 5, NULL, 1, 'https://mafiacats.onrender.com/cats/13', 20),
(37, 'Khan', 'Kampfführung', 6, NULL, 1, 'https://mafiacats.onrender.com/cats/4', 20),
(38, 'Sable', 'Schmuggelkoordination', 7, NULL, 1, 'https://mafiacats.onrender.com/cats/2', 20),
(39, 'Merlin', 'Strategische Beratung', 8, NULL, 1, 'https://mafiacats.onrender.com/cats/6', 20),
(40, 'Don Tabby', 'Revierkontrolle', 10, NULL, 1, 'https://mafiacats.onrender.com/cats/11', 20),
(41, 'Minka', 'Beobachtung', 1, NULL, 1, 'https://mafiacats.onrender.com/cats/5', 20),
(42, 'Pablo', 'Einbruch', 2, 1, 1, 'https://mafiacats.onrender.com/cats/4', 20),
(43, 'Onyx', 'Schattenkunde', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/8', 20),
(44, 'Flocke', 'Spionage', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/7', 20),
(45, 'Goliath', 'Körperkraft', 4, NULL, 1, 'https://mafiacats.onrender.com/cats/4', 20),
(46, 'Wasabi Jr.', 'Fischtransport', 5, NULL, 1, 'https://mafiacats.onrender.com/cats/4', 20),
(47, 'Ajax', 'Revierkampf', 6, NULL, 1, 'https://mafiacats.onrender.com/cats/9', 20),
(48, 'Scarlet', 'Verhandlungen', 7, NULL, 1, 'https://mafiacats.onrender.com/cats/9', 20),
(49, 'Salem', 'Geheimdienst', 8, 1, 1, 'https://mafiacats.onrender.com/cats/2', 20),
(50, 'Don Meowrio', 'Mafiaorganisation', 10, NULL, 1, 'https://mafiacats.onrender.com/cats/14', 20),
(51, 'Keks', 'Diebstahl', 1, NULL, 1, 'https://mafiacats.onrender.com/cats/2', 20),
(52, 'Coco', 'Ablenkungsmanöver', 2, NULL, 1, 'https://mafiacats.onrender.com/cats/3', 20),
(53, 'Storm', 'Nachtaufklärung', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/5', 20),
(54, 'Echo', 'Lauschen', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/2', 20),
(55, 'Boris', 'Einschüchterung', 4, NULL, 1, 'https://mafiacats.onrender.com/cats/4', 20),
(56, 'Nori', 'Fischschmuggel', 5, NULL, 1, 'https://mafiacats.onrender.com/cats/11', 20),
(57, 'Thor', 'Kampftaktik', 6, 1, 1, 'https://mafiacats.onrender.com/cats/15', 20),
(58, 'Nyx', 'Schmuggelplanung', 7, NULL, 1, 'https://mafiacats.onrender.com/cats/8', 20),
(59, 'Aristocat', 'Diplomatie', 8, NULL, 1, 'https://mafiacats.onrender.com/cats/5', 20),
(60, 'Don Furioso', 'Territorialherrschaft', 10, 1, 1, 'https://mafiacats.onrender.com/cats/7', 20),
(61, 'Pip', 'Spurensuche', 1, NULL, 1, 'https://mafiacats.onrender.com/cats/3', 20),
(62, 'Mochi', 'Schlösserknacken', 2, NULL, 1, 'https://mafiacats.onrender.com/cats/3', 20),
(63, 'Ghost', 'Unsichtbarkeit', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/9', 20),
(64, 'Freya', 'Überwachung', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/14', 20),
(65, 'Hulk', 'Kraftdemonstration', 4, NULL, 1, 'https://mafiacats.onrender.com/cats/7', 20),
(66, 'Anchovy', 'Fischhandel', 5, NULL, 1, 'https://mafiacats.onrender.com/cats/14', 20),
(67, 'Samurai', 'Präzisionskampf', 6, NULL, 1, 'https://mafiacats.onrender.com/cats/10', 20),
(68, 'Duchess', 'Organisation', 7, NULL, 1, 'https://mafiacats.onrender.com/cats/8', 20),
(69, 'Sherlock', 'Ermittlung', 8, NULL, 1, 'https://mafiacats.onrender.com/cats/15', 20),
(70, 'Don Purrucci', 'Strategische Führung', 10, 1, 1, 'https://mafiacats.onrender.com/cats/10', 20),
(71, 'Loki', 'Trickbetrug', 1, NULL, 1, 'https://mafiacats.onrender.com/cats/8', 20),
(72, 'Socks', 'Taschendiebstahl', 2, NULL, 1, 'https://mafiacats.onrender.com/cats/7', 20),
(73, 'Midnight', 'Nachtwache', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/7', 20),
(74, 'Comet', 'Schnelle Flucht', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/13', 20),
(75, 'Fang', 'Einschüchterung', 4, NULL, 1, 'https://mafiacats.onrender.com/cats/13', 20),
(76, 'Ginger', 'Schmuggelhandel', 5, NULL, 1, 'https://mafiacats.onrender.com/cats/1', 20),
(77, 'Rex', 'Revierverteidigung', 6, NULL, 1, 'https://mafiacats.onrender.com/cats/8', 20),
(78, 'Sphinx', 'Geheimoperationen', 7, NULL, 1, 'https://mafiacats.onrender.com/cats/14', 20),
(79, 'Olivia', 'Konfliktlösung', 8, NULL, 1, 'https://mafiacats.onrender.com/cats/15', 20),
(80, 'Don Clawson', 'Mafiaführung', 10, NULL, 1, 'https://mafiacats.onrender.com/cats/10', 20),
(81, 'Paws', 'Beobachtung', 1, 1, 1, 'https://mafiacats.onrender.com/cats/13', 20),
(82, 'Trixie', 'Ablenkung', 2, NULL, 1, 'https://mafiacats.onrender.com/cats/1', 20),
(83, 'Ash', 'Spionage', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/15', 20),
(84, 'Velvet', 'Informationsbeschaffung', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/9', 20),
(85, 'Maverick', 'Einschüchterung', 4, NULL, 1, 'https://mafiacats.onrender.com/cats/10', 20),
(86, 'Calypso', 'Fischlogistik', 5, NULL, 1, 'https://mafiacats.onrender.com/cats/11', 20),
(87, 'Diesel Jr.', 'Kampftaktik', 6, NULL, 1, 'https://mafiacats.onrender.com/cats/15', 20),
(88, 'Rascal', 'Schmuggelnetzwerk', 7, 1, 1, 'https://mafiacats.onrender.com/cats/11', 20),
(89, 'Ophelia', 'Strategische Beratung', 8, NULL, 1, 'https://mafiacats.onrender.com/cats/5', 20),
(90, 'Don Meowtini', 'Revierherrschaft', 10, NULL, 1, 'https://mafiacats.onrender.com/cats/14', 20),
(91, 'Pixel', 'Spurensuche', 1, NULL, 1, 'https://mafiacats.onrender.com/cats/11', 20),
(92, 'Trüffel', 'Einbruch', 2, NULL, 1, 'https://mafiacats.onrender.com/cats/7', 20),
(93, 'Nebula', 'Tarnung', 3, 1, 0, 'https://mafiacats.onrender.com/cats/8', 20),
(94, 'Whisper', 'Lauschen', 3, NULL, 1, 'https://mafiacats.onrender.com/cats/6', 20),
(95, 'Crusher', 'Kraft', 4, NULL, 1, 'https://mafiacats.onrender.com/cats/3', 20),
(96, 'Sardine', 'Fischhandel', 5, NULL, 1, 'https://mafiacats.onrender.com/cats/8', 20),
(97, 'Blade', 'Revierkampf', 6, NULL, 1, 'https://mafiacats.onrender.com/cats/8', 20),
(98, 'Godfather Purr', 'Organisation', 7, NULL, 1, 'https://mafiacats.onrender.com/cats/11', 20),  -- Name im Screenshot abgeschnitten, bitte prüfen
(99, 'Madame Claws', 'Diplomatie', 9, NULL, 1, 'https://mafiacats.onrender.com/cats/5', 20),
(100, 'Don Catone', 'Oberste Mafiaführung', 10, NULL, 1, 'https://mafiacats.onrender.com/cats/12', 20),
(101, 'Sir Donalot', NULL, 10, NULL, 1, 'https://mafiacats.onrender.com/cats/12', 20),
(102, 'Don Testino', NULL, 10, 3, 1, 'https://mafiacats.onrender.com/cats/4', 20),
(103, 'don Alfredo', NULL, 10, 4, 1, 'https://mafiacats.onrender.com/cats/4', 20),
(104, 'don Pablo', NULL, 10, 5, 1, 'https://mafiacats.onrender.com/cats/4', 20),
(106, 'don John', NULL, 10, 7, 1, 'https://mafiacats.onrender.com/cats/4', 20);

INSERT INTO region (id, region_name, fish_rate, clan_id) VALUES
(1, 'Hafen der Streuner', 12, 5),
(2, 'Die alte Fischgasse', 8, 5),
(3, 'Nebelviertel', 5, NULL),
(4, 'Schwarzer Kanal', 14, NULL),
(5, 'Dachlandschaft', 3, NULL),
(6, 'Markt der Sardinen', 18, NULL),
(7, 'Verlassener Bahnhof', 4, 7),
(8, 'Mondscheinpark', 6, NULL),
(9, 'Lagerhaus 13', 15, NULL),
(10, 'Rostige Werft', 17, NULL),
(11, 'Katzenkatakomben', 2, 1),
(12, 'Goldene Promenade', 9, NULL),
(13, 'Hinterhof der Schatten', 7, NULL),  -- Name im Screenshot abgeschnitten, bitte prüfen
(14, 'Sardineninsel', 20, NULL),
(15, 'Alte Mühle', 10, 1),
(16, 'Schmugglerbucht', 16, NULL),
(17, 'Nachtmarkt', 13, NULL),
(18, 'Verbotenes Revier', 11, NULL),
(19, 'Fischerhafen Nord', 19, NULL),
(20, 'Don-Viertel', 25, NULL);

INSERT INTO regionbattle (id, battle_ongoing, battle_start_time, region_id, winner_id) VALUES
(54, 0, '2026-11-09 00:34:19', 1, 5),
(55, 0, '2026-11-09 00:38:35', 11, 1);

INSERT INTO clan_regionbattle (clan_id, regionbattle_id) VALUES
(4, 54),
(5, 54),
(1, 55),
(5, 55);

SET FOREIGN_KEY_CHECKS = 1;
