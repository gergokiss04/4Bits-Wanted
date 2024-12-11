# Tesztjegyzőkönyv

Teszteléseket végezte: Fidrus Bence

Operációs rendszer: Windows 11

## Alfa teszt

| Vizsgálat | Tesztelés időpontja | Elvárás | Eredmény | Hibák |
| :---: | --- | --- | --- | --- |
| Az adatbázis szerkezete | 2024.12.11 | A táblák adatstruktúrája a forráskódban lévőeknek megfelelő | Kisebb változtatások és egyeztetések után így van | - |
| Mock adatok | 2024.12.11. | A minta adatok megfelelően beilleszthetők az adatbázisba | Sikerült | - |

Az Alfa tesztelés során a vizsgált elemek mind hibátlanul működtek mindenféle fennakadások nélkül.

Következő tesztelésnél a többi funkció kerül vizsgálatra illetve elemzésre.
## Béta teszt

| Vizsgálat | Tesztelés időpontja | Elvárás | Eredmény | Hibák |
| :---: | --- | --- | --- | --- |
| Adatbázis adatai kódban | 2024.12.11. | Csatlakozás lehetséges az adatbázishoz | Sikeres | - |
| Api-ból származó lekérdezések | 2024.12.11. | A lekérdezések sikeresen lefutnak az adatbázissal kapcsolatban | Sikeres | - |
| Visszatérési értékek | 2024.12.11. | A lekérdezések eredményei jó formában kerülnek átadásra az api-nak | Sikeres | - |

A Béta teszt sikeresen zajlott.

A végleges tesztelés során az összes fent felsorolt vizsgálati elem újra ellenőrzésre kerül. Ezzel együtt az új funkciók is tesztelésre kerültek.

## Végleges teszt
| Vizsgálat | Tesztelés időpontja | Elvárás | Eredmény | Hibák |
| :---: | --- | --- | --- | --- |
| Bejelentkezés | 2024.12.11. | A bejelentkezést követően a user elmentődik, a header változik | Sikeres | - |
| Regisztráció | 2024.12.11. | A regisztrált user bekerül az adatbázisba, helyesen szerepelnek az adatok | Sikeres | - |
| Új hirdetés | 2024.12.11. | Új hirdetés feladásakor az bekerül az adatbázisba | Nem sikerül | A struktúrák nem matchelnek(?) |

A Végleges teszt során hibák akadtak, javításra szorul.


Tesztelést végezte és írta: Fidrus Bence

Befejezve: 2024.12.11.