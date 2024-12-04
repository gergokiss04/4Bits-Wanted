# Tesztjegyzőkönyv

Teszteléseket végezte: *Müller Krisztián Norbert*

Operációs rendszer: Linux (Arch-alapú)

## Alfa teszt

| Vizsgálat | Tesztelés időpontja | Elvárás | Eredmény | Hibák |
| :---: | --- | --- | --- | --- |
| Node-server stabilitása | 2024.10.15. | A program elindul, és nem dob hibát | Megfelelően működik |  |
| Megfelelő erőforráskezelés | 2024.10.16 | Mindig becsukja a file handle-eket használatot követően | A GC szólt, hogy nem így van | Nem tudtam, hogy a close is awaitelendő |
| Konfiguráció beolvasása | 2024.10.16 | A program induláskor beolvassa és értelmezi a konfigurációs fájlt | Így is lett | |
| Statikus állományok kiszolgálása | 2024.10.18 | A statikus állományok elérhetők a megfelelő URL-eken | A nagyobb fájloknak csak egy része jön át | Nem várt, ha tele lett a stream
| Hibakódok | 2024.10.20 | A rossz kérésekre megfelelő státuszkóddal reagál | Így van | |

Az Alfa tesztelés során a vizsgált elemek között volt ami nem megfelelően működött, ez a későbbiek során javításra szorul.

## Béta teszt

| Vizsgálat | Tesztelés időpontja | Elvárás | Eredmény | Hibák |
| :---: | --- | --- | --- | --- |
| Kérés URL bontása | 2024.11.05. | Megfelelően részekre tagolja | Megfelelően részekre tagolta |  |
| API hívás | 2024.11.07. | Az API prefix alatt található kérések az API-hoz mennek, és elérik a megfelelő endpointot | Igen |  |
| Bejelentkezés | 2024.11.08. | Bejelentkezéskor kapunk session cookie-t | Kaptunk | A böngésző dev toolsjából küldtem a kérést, ezért a cookie nem tárolódott el |
| Felhasználók listázása | 2024.11.12. | A /users működik | Megfelelően működik |  |
| Regisztráció | 2024.11.20. | A /register-re való POSTolás után létrejön egy új felhasználó, akibe bele lehet jelentkezni | Bizony |  |

A Béta teszt során akadtan hibák, mely(ek) javításra szorulnak.

## Végleges teszt
| Vizsgálat | Tesztelés időpontja | Elvárás | Eredmény | Hibák |
| :---: | --- | --- | --- | --- |
| A Mediastager Teszt | 2024.12.04. | A mediastagert lehet CRUDozni | Lehet |  |
| Média endpoint | 2024.12.04. | A /media megfelelően kiszolgálja az állományokat | Igen, megfelelően szolgálja ki |  |
| Fájlfeltöltés | 2024.12.04. | Form által feltöltött fájlokat eltárol a szerver | El |  |
| Profilképátállítás | 2024.12.04. | Profilkép POSTolása esetén hozzárendelődik a felhasználónkhoz | Igen, megfelelően hozzárendelődik |  |
| Jogosultságok | 2024.12.04. | Csak ahhoz férhetünk hozzá, amihez jogosultak vagyunk | Megfelelően korlátozza hozzáférésünket |  |
| METHOD\_NOT\_ALLOWED | 2024.12.04. | Ha rossz fajta metódussal próbálkozunk, akkor az említett hibával jön vissza | Igen |  |
| Le lehet állítani a szervert | 2024.12.04. | Ha Ctrl+C-t nyomunk, megáll | Így van |  |
| A node\_modules szerepel a gitignoreban | 2024.12.04. | Nem kerül fel | Nem került fel |  |

A Végleges teszt lezajlott és minden funkció rendesen működik, esztétikailag mondhatni megfelelő a program.

Átadásra készen áll a megrendelőnek.

Tesztelést végezte és írta: *Müller Krisztián Norbert*

Befejezve: 2024.12.04.
