CREATE TABLE "pouzivatel" (
  "id" SERIAL PRIMARY KEY,
  "meno" varchar NOT NULL,
  "heslo" varchar NOT NULL,
  "email" varchar NOT NULL,
  "registracia" int NOT NULL
);

CREATE TABLE "registracia" (
  "id" SERIAL PRIMARY KEY,
  "typ" varchar
);

CREATE TABLE "priatelstvo" (
  "id" SERIAL PRIMARY KEY,
  "pouzivatel1_id" int NOT NULL,
  "pouzivatel2_id" int NOT NULL,
  "status" int
);

CREATE TABLE "status" (
  "id" SERIAL PRIMARY KEY,
  "text" varchar
);

CREATE TABLE "tim" (
  "id" SERIAL PRIMARY KEY,
  "nazov" varchar
);

CREATE TABLE "pouzivatelia_timy" (
  "id" SERIAL PRIMARY KEY,
  "pouzivatel_id" int,
  "tim_id" int,
  "status" int
);

CREATE TABLE "spravy" (
  "id" SERIAL PRIMARY KEY,
  "odosielatel_id" int,
  "prijimatel_pouzivatel_id" int,
  "prijimatel_tim_id" int,
  "text" varchar,
  "cas_odoslania" timestamp
);

CREATE TABLE "postava" (
  "id" SERIAL PRIMARY KEY,
  "pouzivatel_id" int,
  "meno" varchar,
  "level" int,
  "rola" int,
  "pocet_zivotov" int,
  "akt_pocet_zivotov" int,
  "obranne_cislo" int,
  "utocne_cislo" int,
  "experience" int,
  "hra_id" int
);

CREATE TABLE "rola" (
  "id" SERIAL PRIMARY KEY,
  "typ" varchar,
  "pocet_zivotov" int,
  "obranne_cislo" int,
  "utocne_cislo" int
);

CREATE TABLE "hra" (
  "id" SERIAL PRIMARY KEY,
  "nazov" varchar,
  "zacatie_hry" timestamp
);

CREATE TABLE "poschodie" (
  "id" SERIAL PRIMARY KEY,
  "meno" varchar,
  "hra_id" int
);

CREATE TABLE "pozicia" (
  "id" SERIAL PRIMARY KEY,
  "poschodie_id" int,
  "x" int,
  "y" int,
  "postava_id" int,
  "predmet_id" int,
  "prisera_id" int
);

CREATE TABLE "prisera" (
  "id" SERIAL PRIMARY KEY,
  "meno" varchar,
  "max_pocet_zivotov" int,
  "obranne_cislo" int,
  "utocne_cislo" int,
  "podmienka_zobrazenia" int,
  "experience" int
);

CREATE TABLE "podmienka_zobrazenia" (
  "id" SERIAL PRIMARY KEY,
  "prisera_id" int,
  "pozadovana_prisera_id" int,
  "pozadovana_uloha_id" int,
  "level_min" int,
  "level_max" int
);

CREATE TABLE "instancia_prisery" (
  "id" SERIAL PRIMARY KEY,
  "monster_id" int,
  "pocet_zivotov" int,
  "obtaznost" int
);

CREATE TABLE "schopnosti" (
  "id" SERIAL PRIMARY KEY,
  "nazov" varchar,
  "rola_id" int
);

CREATE TABLE "potrebne_schopnosti" (
  "id" SERIAL PRIMARY KEY,
  "schopnost_id" int,
  "pozadovana_id" int,
  "level" int
);

CREATE TABLE "postavy_schopnosti" (
  "id" SERIAL PRIMARY KEY,
  "postava_id" int,
  "schopnost_id" int
);

CREATE TABLE "level" (
  "id" SERIAL PRIMARY KEY,
  "experience_to_gain" int
);

CREATE TABLE "predmet" (
  "id" SERIAL PRIMARY KEY,
  "nazov" varchar,
  "pocet_zivotov" int,
  "obranne_cislo" int,
  "utocne_cislo" int,
  "stockable" boolean
);

CREATE TABLE "predmety_prisery" (
  "id" SERIAL PRIMARY KEY,
  "predmet_id" int,
  "prisera_id" int,
  "pravdepodobnost" decimal
);

CREATE TABLE "inventar" (
  "id" SERIAL PRIMARY KEY,
  "postava_id" int,
  "predmet_id" int,
  "pouzivany" boolean
);

CREATE TABLE "uloha" (
  "id" SERIAL PRIMARY KEY,
  "nazov" varchar,
  "zadanie_ulohy" varchar,
  "prisera_id" int,
  "pocet_zabiti_priser" int,
  "min_level" int,
  "predmet_id" int,
  "experience" int
);

CREATE TABLE "postava_uloha" (
  "id" SERIAL PRIMARY KEY,
  "pouzivatel_id" int,
  "uloha_id" int,
  "akt_pocet_zabiti" int
);

CREATE TABLE "ulohy_poschodia" (
  "id" SERIAL PRIMARY KEY,
  "uloha_id" int,
  "poschodie_id" int
);

CREATE TABLE "combat_log" (
  "id" SERIAL PRIMARY KEY,
  "postava_id" int,
  "prisera_id" int,
  "obtaznost" int,
  "experience" int,
  "kedy" timestamp
);

ALTER TABLE "pouzivatel" ADD FOREIGN KEY ("registracia") REFERENCES "registracia" ("id");

ALTER TABLE "priatelstvo" ADD FOREIGN KEY ("pouzivatel1_id") REFERENCES "pouzivatel" ("id");

ALTER TABLE "priatelstvo" ADD FOREIGN KEY ("pouzivatel2_id") REFERENCES "pouzivatel" ("id");

ALTER TABLE "priatelstvo" ADD FOREIGN KEY ("status") REFERENCES "status" ("id");

ALTER TABLE "spravy" ADD FOREIGN KEY ("odosielatel_id") REFERENCES "pouzivatel" ("id");

ALTER TABLE "spravy" ADD FOREIGN KEY ("prijimatel_pouzivatel_id") REFERENCES "priatelstvo" ("id");

ALTER TABLE "tim" ADD FOREIGN KEY ("id") REFERENCES "spravy" ("prijimatel_tim_id");

ALTER TABLE "pouzivatelia_timy" ADD FOREIGN KEY ("pouzivatel_id") REFERENCES "pouzivatel" ("id");

ALTER TABLE "pouzivatelia_timy" ADD FOREIGN KEY ("tim_id") REFERENCES "tim" ("id");

ALTER TABLE "pouzivatelia_timy" ADD FOREIGN KEY ("status") REFERENCES "status" ("id");

ALTER TABLE "postava" ADD FOREIGN KEY ("rola") REFERENCES "rola" ("id");

ALTER TABLE "postavy_schopnosti" ADD FOREIGN KEY ("postava_id") REFERENCES "postava" ("id");

ALTER TABLE "postavy_schopnosti" ADD FOREIGN KEY ("schopnost_id") REFERENCES "schopnosti" ("id");

ALTER TABLE "potrebne_schopnosti" ADD FOREIGN KEY ("schopnost_id") REFERENCES "schopnosti" ("id");

ALTER TABLE "potrebne_schopnosti" ADD FOREIGN KEY ("pozadovana_id") REFERENCES "schopnosti" ("id");

ALTER TABLE "predmety_prisery" ADD FOREIGN KEY ("predmet_id") REFERENCES "predmet" ("id");

ALTER TABLE "predmety_prisery" ADD FOREIGN KEY ("prisera_id") REFERENCES "prisera" ("id");

ALTER TABLE "instancia_prisery" ADD FOREIGN KEY ("monster_id") REFERENCES "prisera" ("id");

ALTER TABLE "inventar" ADD FOREIGN KEY ("postava_id") REFERENCES "postava" ("id");

ALTER TABLE "inventar" ADD FOREIGN KEY ("predmet_id") REFERENCES "predmet" ("id");

ALTER TABLE "postava" ADD FOREIGN KEY ("id") REFERENCES "pouzivatel" ("id");

ALTER TABLE "postava" ADD FOREIGN KEY ("hra_id") REFERENCES "hra" ("id");

ALTER TABLE "poschodie" ADD FOREIGN KEY ("hra_id") REFERENCES "hra" ("zacatie_hry");

ALTER TABLE "pozicia" ADD FOREIGN KEY ("poschodie_id") REFERENCES "poschodie" ("id");

ALTER TABLE "predmet" ADD FOREIGN KEY ("id") REFERENCES "pozicia" ("predmet_id");

ALTER TABLE "postava" ADD FOREIGN KEY ("id") REFERENCES "pozicia" ("postava_id");

ALTER TABLE "instancia_prisery" ADD FOREIGN KEY ("id") REFERENCES "pozicia" ("prisera_id");

ALTER TABLE "postava_uloha" ADD FOREIGN KEY ("uloha_id") REFERENCES "uloha" ("id");

ALTER TABLE "postava_uloha" ADD FOREIGN KEY ("id") REFERENCES "postava" ("id");

ALTER TABLE "uloha" ADD FOREIGN KEY ("prisera_id") REFERENCES "prisera" ("id");

ALTER TABLE "uloha" ADD FOREIGN KEY ("predmet_id") REFERENCES "predmet" ("id");

ALTER TABLE "ulohy_poschodia" ADD FOREIGN KEY ("uloha_id") REFERENCES "uloha" ("id");

ALTER TABLE "ulohy_poschodia" ADD FOREIGN KEY ("poschodie_id") REFERENCES "poschodie" ("id");

ALTER TABLE "podmienka_zobrazenia" ADD FOREIGN KEY ("prisera_id") REFERENCES "prisera" ("id");

ALTER TABLE "podmienka_zobrazenia" ADD FOREIGN KEY ("pozadovana_prisera_id") REFERENCES "prisera" ("id");

ALTER TABLE "podmienka_zobrazenia" ADD FOREIGN KEY ("pozadovana_uloha_id") REFERENCES "uloha" ("id");

ALTER TABLE "combat_log" ADD FOREIGN KEY ("postava_id") REFERENCES "postava" ("id");

ALTER TABLE "combat_log" ADD FOREIGN KEY ("prisera_id") REFERENCES "prisera" ("id");
