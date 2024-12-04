# 4Bits Wanted - Node.js szerver
Ez az a része a projektnek, ami a klienstől érkező kéréseket kiszolgálja az adatbázis segítségével.

Minden parancs ennek a fájlnak a mappájában futtatandó, kivéve, ha kifejezetten oda van írva más.

## Szükséges előkészületek (checkoutonként)
- Telepítsd a szükséges programokat:
  - npm (a Node.js csomikezelője)
  - Node.js
- Futtasd az `npm install`-t, hogy letöltődjenek a helyileg checkoutolt mappádba a `node_modules` cuccok (a `node_modules`t légyszi ne committold a verziókövetőbe)

## Indítás
0. A frontendet (/wanted a repo gyökerébe) buildeld le a `npm run build` segítségével, hogy a statikus cuccok meglegyenek
1. `npx tsc` - A `src/` mappában lévő TypeScriptek átfordulnak JavaScripté a `build/`-be
2. `node build/main.js` - A Node elkezdi futtatni az átfordított kódot
(protip: `npx tsc && node build/main.js`)

## Config fájl
A `WANTED_CONFIG` környezeti változóval megadható, hogy máshol keresse. (légyszi ne committold ha magadnak átírsz valamit helyileg)

- Az `api` alatt a `driver` lehet `memory` vagy `db`. A memory driver nem csatlakozik az adatbázishoz, mindent asszociatív tömbökben tárol. Hasznos például ha vizsga előtt 5 perccel harakirizik az adatbázis.
