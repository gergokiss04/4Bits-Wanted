# Rendszerterv
## 1. A rendszer célja
A rendszer célja egy online apróhirdetési platform létrehozása, ahol a felhasználók különböző árucikkeket vásárolhatnak és adhatnak el. Az alkalmazás lehetővé teszi bárki számára a hirdetések böngészését, de hirdetések feladásához vagy termékek megvásárlásához regisztrálni kell egy fiókot. Minden vásárlást követően a vevők értékelhetik az eladót 1–5 csillagig. A felhasználói profilok tartalmazzák a felhasználó nevét, profilképét, egy rövid leírást róluk, az elérhető hirdetéseiket illetve a kapott csillagok átlagát, amely megmutatja az eladó megbízhatóságát. A hirdetéseknek egyedi címet, árat, részletes leírást és kategorizáló címkéket lehet megadni, valamint képeket csatolni. A keresési funkció lehetőséget ad arra, hogy cím, címkék és ártartomány szerint szűrjünk a termékekre. Az eladók a saját hirdetéseiket szabadon szerkeszthetik és törölhetik, addig amíg az adott hirdetést nem vásárolták meg.
## 2. Projektterv

### 2.1 Projektszerepkörök, felelőségek:
   * Scrum masters: Kiss Gergő Zsolt, Müller Krisztián, Fidrus Bence, Rácz Levente
   * Product owner: Kiss Gergő Zsolt, Müller Krisztián, Fidrus Bence, Rácz Levente****
   * Üzleti szereplő: Kiss Gergő Zsolt, Müller Krisztián, Fidrus Bence, Rácz Levente
     
### 2.2 Projektmunkások és felelőségek:
   * Frontend: Kiss Gergő Zsolt, Rácz Levente
     * Feladatuk a weboldal felhasználói felületének fejlesztése és kialakítása, React keretrendszer alkalmazásával, illetve
      a JSON-alapú REST API fejlesztése, amely a frontend és a backend közötti kommunikációt biztosítja.
   * Backend: Müller Krisztián, Fidrus Bence
     * Feladatuk a backend fejlesztése Node.js-ben, amely a szerveroldali működésért felelős, illetve az SQL alapú adatbázis     létrehozása és kezelése, amely a rendszer adatainak tárolását végzi. 
   * Tesztelés: A tesztelés során ellenőrizzük, hogy a felhasználói felület megfelelően működik különböző eszközökön, a REST API kommunikációja stabil, és az adatbázisban helyesen tárolódnak az adatok.
     
### 2.3 Ütemterv:

|Funkció                  | Feladat                                | Prioritás | Becslés (nap) | Aktuális becslés (nap) | Eltelt idő (nap) | Becsült idő (nap) |
|-------------------------|----------------------------------------|-----------|---------------|------------------------|------------------|---------------------|
|Követelmény specifikáció |Megírás                                 |         1 |             1 |                      1 |                1 |                   1 |             
|Funkcionális specifikáció|Megírás                                 |         1 |             1 |                      1 |                1 |                   1 |
|Rendszerterv             |Megírás                                 |         1 |             1 |                      1 |                1 |                   1 |
|Program                  |Képernyőtervek elkészítése              |         2 |             1 |                      1 |                1 |                   1 |
|Program                  |Prototípus elkészítése                  |         3 |             8 |                      8 |                8 |                   8 |
|Program                  |Alapfunkciók elkészítése                |         3 |             8 |                      8 |                8 |                   8 |
|Program                  |Tesztelés                               |         4 |             2 |                      2 |                2 |                   2 |

### 2.4 Mérföldkövek:
   * Prototípus átadása

## 3. Üzleti folyamatok modellje

### 3.1 Üzleti szereplők

### 3.2 Üzleti folyamatok

## 4. Követelmények

### Funkcionális követelmények

| ID | Megnevezés | Leírás |
| K1 | Böngészés regisztráció nélkül | A felhasználók regisztráció nélkül is böngészhetik az apróhirdetéseket, kereshetnek és szűrhetnek a hirdetések között. |
| K2 | Regisztráció és Bejelentkezés | A felhasználók fiókot hozhatnak létre és bejelentkezhetnek, ami szükséges a hirdetések feladásához vagy vásárlásához |
| K3 | hirdetés létrehozása	| A regisztrált felhasználók új hirdetéseket hozhatnak létre címmel, árral, leírással, képekkel és címkékkel. |
| K4 | Vásárlás és eladó értékelése | A felhasználók vásárolhatnak termékeket és vásárlás után értékelhetik az eladót 1-5 csillagig |
| K5 | Hirdetések keresése | A felhasználók kereshetnek hirdetéseket cím, címke és ártartomány alapján. |
| K6 | Felhasználói profil | A regisztrált felhasználók megnézhetik a profilukat, ahol megtalálható a nevük, profilképük, profilleírásuk, értékeléseik átlaga és aktív hirdetéseik. |
| K7 | Hirdetés törlése	| Az eladó eltávolíthatja a saját hirdetését, amíg az nem került megvásárlásra. |

### Nemfunkcionális követelmények

| ID | Megnevezés | Leírás |
| K1 | Rendszer stabilitás | A rendszernek stabilnak kell lennie, hogy a felhasználók zavartalanul használhassák a weboldalt |
| K2 | Teljesítmény | A weboldalnak gyors válaszidőt kell biztosítania |
| K3 | Adatbiztonság | A felhasználók adatait biztonságosan kell kezelni, GDPR-nak meg kell felelni |

### Támogatott eszközök

## 5. Funkcionális terv

### 5.1 Rendszerszereplők

### 5.2 Menühierarchiák

## 6. Fizikai környezet

### Vásárolt softwarekomponensek és külső rendszerek
Nincsenek vásárolt softwarekomponensek és külső rendszerek.

### Hardver topológia
Bármilyen böngészőben fut a web app.
A backend bármilyen NodeJS-sel rendelkező rendszeren fut.
Az adatbázis minden olyan rendszeren fut, amely támogatja azt.

### Fejlesztő eszközök
- VS Code
- MariaDB GUI
- NVim

## 8. Architekturális terv

### Webszerver
A webszerver NodeJS-sel működik, JSON objektumokkal kommunikál a böngészőben futó klienssel.

### Adatbázis rendszer
A rendszerhez szükség van egy adatbázis szerverre, ebben az esetben
MariaDB-t használunk. A kliens oldali programokat egy Node-os API
szolgálja ki, ez csatlakozik az adatbázis szerverhez.

### A program elérése, kezelése
A web alkalmazás React JS keretrendszer használatával készül el. Az API-hoz a user belépését követően egyedi kúlcs segítségével lehet
hozzáférni, ez biztosítja, hogy illetéktelen felhasználók ne csinálhassanak olyanokat, amiket nem lenne nekik szabad.

## 9. Adatbázis terv
Az adatbázis két táblával rendelkezik:
   - User (felhasználó adatai)
      - id (PK)
         - NN
         - Unique
      - name
         - NN
      - profile_pic
      - bio
      - email
         - NN
      - password
         - NN
   - Ad (apróhirdetés adatai)
      - id (PK)
         - NN
      - title
         - NN
      - price
         - NN
      - description
      - pics []
      - tags []
      - buyer_id ?
      - stars ?

## 10. Implementációs terv

- Web: Valamilyen okból kifolyólag React-et használunk, mert jó kihívást láttunk benne, modern frontend fejlesztői keretrendszernek hittük, mely jó kihívást nyújt mindannyiunk számára.
- Backend: NodeJS-t használunk. TypeScript-et használunk, hogy nehezebb legyen magunkat lábon lőni a JavaScript gonosz, nonszensz quirkjeivel.
- Adatbázis: MariaDB-t használunk, mert szabad (*ingyenes*) szoftver, és a már jól ismert és közkedvelt SQL-t használja.


## 11. Tesztterv

A tesztelések célja a rendszer és komponensei funkcionalitásának teljes vizsgálata,
ellenőrzése a rendszer által megvalósított üzleti szolgáltatások verifikálása.
A teszteléseket a fejlesztői csapat minden tagja elvégzi.
Egy teszt eredményeit a tagok dokumentálják külön fájlokba.

### Tesztesetek

 | Teszteset | Elvárt eredmény | 
 |-----------|-----------------| 
 | ... | ... |

### A tesztelési jegyzőkönyv kitöltésére egy sablon:

**Tesztelő:** Vezetéknév Keresztnév

**Tesztelés dátuma:** Év.Hónap.Nap

Tesztszám | Rövid leírás | Várt eredmény | Eredmény | Megjegyzés
----------|--------------|---------------|----------|-----------
például. Teszt #01 | Regisztráció | A felhasználó az adatok megadásával sikeresen regisztrálni tud  | A felhasználó sikeresen regisztrált | Nem találtam problémát.
... | ... | ... | ... | ...

## 12. Telepítési terv

Fizikai telepítési terv: 

Szoftver telepítési terv: 
A szoftver webes felületen működik, ehhez csak egy ajánlott böngésző telepítése szükséges 
(Google Chrome, Safari, Opera), külön szoftver nem kell hozzá.
A webszerverre közvetlenül az internetről kapcsolódnak a kliensek.

## 13. Karbantartási terv
Fontos a felhasználók által visszajelzett problémákat,hibákat,észrevételeket megfogadni és kijavítani,hogy javítsuk a felhasználói élményt és az esetleges támadásokat kivédeni,hogy ne legyen sérülékeny a weboldalunk.Érdemes követni a programnyelvek aktuális verziószámait,hogy naprakész legyen.
