# Tesztjegyzőkönyv

Teszteléseket végezte: Fidrus Bence

Operációs rendszer: Windows 11

## Alfa teszt

| Vizsgálat | Tesztelés időpontja | Elvárás | Eredmény | Hibák |
| :---: | --- | --- | --- | --- |
| Az adatbázis szerkezete | 2024.12.11 | A táblák adatstruktúrája a forráskódban lévőeknek megfelelő | Kisebb változtatások és egyeztetések után így van | - |
| Mock adatok | 2024.12.11. | A minta adatok megfelelően beilleszthetők az adatbázisba | Sikerült | - |
| Adatok megfelelő struktúrája | 2025.01.02. | Az adatbázisban lévő adatok felhasználhatók a kód által | Felhasználhatóak | - |

Az Alfa tesztelés során a vizsgált elemek mind hibátlanul működtek mindenféle fennakadások nélkül.

Következő tesztelésnél a többi funkció kerül vizsgálatra illetve elemzésre.
## Béta teszt

| Vizsgálat | Tesztelés időpontja | Elvárás | Eredmény | Hibák |
| :---: | --- | --- | --- | --- |
| Adatbázis adatai kódban | 2024.12.11. | Csatlakozás lehetséges az adatbázishoz | Sikeres | - |
| Api-ból származó lekérdezések | 2024.12.11. | A lekérdezések sikeresen lefutnak az adatbázissal kapcsolatban | Sikeres | - |
| Visszatérési értékek | 2024.12.11. | A lekérdezések eredményei jó formában kerülnek átadásra az api-nak | Sikeres | - |
| Adatbázisból megkapott adatok megfelelő formázása az API számára | 2025.01.02. | A kódbeli osztályokká átalakítás sikerül, helyesen kerül átadásra | Sikeres | - |
| Frontend és backend kommunikálása | 2025.01.02 | A két vég tud kommunikálni egymással, a frontend eléri és kéréseket tud küldeni a backend felé | Sikeres | - |
| Backend és adatbázis kommunikálása | 2025.01.02. | A backend akadálymentesen csatlakozik, kommunikál, és adatokat küld/kap az adatbázissal kapcsolatban | Sikeres | - |
| Kategória választó | 2025.01.02. | A kategóriák váltása működik, átdob a megfelelő oldalra | Sikeres | - |
| Hirdetés feladása gomb | 2025.01.02. | Átvisz a megfelelő oldalra | Sikeres | - |
| Carousel gombok | 2025.01.02. | A jobb és bal oldali gombok váltanak a képek között | Sikeres | - |
| Logóra kattintás | 2025.01.02. | A logóra kattintva mindenhonnan a főoldalra dob | Sikeres | - |

A Béta teszt sikeresen zajlott.

## Végleges teszt
| Vizsgálat | Tesztelés időpontja | Elvárás | Eredmény | Hibák |
| :---: | --- | --- | --- | --- |
| Regisztráció | 2025.01.02. | Regisztráció során az adatok sikeresen mentésre kerülnek | Sikeres | - |
| Bejelentkezés | 2025.01.02. | Bejelentkezés során a helyes adatok megadásával a helyes profilba bejelentkezünk | Sikeres | - |
| Kiemelt termékek | 2025.01.02. | Random módon megjelenik 3 hirdetés | Sikeres | - |
| Reszponzivitás | 2025.01.02. | Az oldalon elhelyezett elemek mérete az ablak méretétől függően változnak | Sikeres | - |
| Eladott termékek elrejtése | 2025.01.02. | A már eladott termékek nem jelennek meg az egyes kategóriák között | Sikeres | - |
| Kijelentkezés | 2025.01.02. | Kijelentkezés működése | sikeres | - |
| Hirdetés adatok | 2025.01.02. | Adatok fogadása és továbbítása | Sikeres | - |
| Hirdetés képének eltárolása, kódolása | 2025.01.02. | A megadott kép helyesen eltárolódik a backenden | Sikeres | - |
| Hirdetések képének helyes megjelenése a terméklistában | 2025.01.02. | Megfelelő képek, megfelelő formában | Sikeres | - |
| Profil menü | 2025.01.02. | Menü megjelenése | Sikeres | - |
| Kosárba helyezés | 2025.01.02. | Termékek kosárba helyezhetők | Sikeres | - |
| Megvásárlás | 2025.01.02. | Megvásárlás menete megfelelően lezajlik, a termék megvásároltként lesz megjelölve | Sikeres | - |

A Végleges tesztelés során a vizsgált elemek mind hibátlanul működtek mindenféle fennakadások nélkül.


Tesztelést végezte és írta: Fidrus Bence

Befejezve: 2025. 01. 02.