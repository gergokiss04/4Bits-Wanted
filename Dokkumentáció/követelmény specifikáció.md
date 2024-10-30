# Követelmény specifikáció

## 1. Áttekintés

Az alkalmazás egy weboldal, ahol a felhasználók apróhirdetéseket tehetnek közzé, melyeket mások megvásárolhatnak. Böngészni bárki tud, de apróhirdetés létrehozásához/megvásárlásához már fiók szükséges. Amikor megvásárolnak egy terméket, jár hozzá egy lehetőség értékelni az eladót 1-5 csillaggal. A felhasználóknak van saját profil oldaluk, ahol megjelenik a nevük, profilképük, profilleírásuk, kapott csillagaik átlaga, illetve az általuk futtatott apróhirdetések. Az apróhirdetések bármilyen önálló árucikket árulhatnak. Meg lehet adni nekik címet, árat, leírást, képeket (az első megjelenik amikor böngészünk a sok termék közt), illetve címkéket, melyek a hasonló termékeket azonosítják, pl.: "porszívó", "használt", "kék". Keresni lehet cím, címkék, és/vagy ártartomány alapján. Az eladó eltávolíthatja a saját apróhirdetéseit egész addig, míg az nincs megvásárolva.

## 2. A jelenlegi helyzet leírása
A felgyorsult világban előtérbe került az online vásárlásokkal foglalkozó weboldalak. Mi egy olyan marketplace weboldalt szeretnénk fejleszteni ami a piaci igényt és trendeket követi. Napjainkban egyre többen keresnek költséghatékony és fenntartható alternatívákat a vásárláshoz. A vásárlók egy része kifejezetten szeretne használt, jó állapotú termékeket vásárolni, hogy környezettudatosabban élhessen, vagy pénzt takarítson meg.Felhasználóbarát kezelést biztosít az oldalunk, kialakítása során kiemelt figyelmet fordítottunk a könnyű használhatóságra és a gyors navigációra. Felhasználóbarát keresési funkcióink, részletes kategorizálás, illetve az átlátható profilok lehetővé teszik, hogy az érdeklődők gyorsan megtalálják az igényeiknek megfelelő termékeket, illetve könnyen kapcsolatba léphessenek az eladókkal.Az online vásárlás esetében sokan aggódnak a csalások miatt. Weboldalunk fejlett értékelési rendszert kínál, amely lehetőséget biztosít az eladók értékelésére, így minden felhasználó megbízhatóbb információkhoz juthat más felhasználókról.

## 3. Vágyálomrendszer

Az alkalmazás célja egy weboldal, ahol a felhasználók apróhirdetéseket tehetnek közzé, melyeket mások megvásárolhatnak. A rendszer elérhető több platformon, weben, telefonon, is. Böngészni, bárki tud, de apróhirdetés létrehozásához/megvásárlásához már fiók szükséges. Amikor megvásárolnak egy terméket, jár hozzá egy lehetőség értékelni az eladót 1-5 csillaggal. A felhasználóknak van saját profil oldaluk, ahol megjelenik a nevük, profilképük, profilleírásuk, kapott csillagaik átlaga illetve, a általuk futtatott apróhirdetések. Az apróhirdetések bármilyen önálló árucikket árulhatnak. Meg lehet adni nekik címet, árat, leírást, képeket (az első megjelenik amikor böngészünk a sok termék közt), illetve címkéket, melyek a hasonló termékeket azonosítják, pl.: "porszívó", "használt", "kék". Keresni lehet cím, címkék, és/vagy ártartomány alapján. Az eladó eltávolíthatja a saját apróhirdetéseit egész addig, míg az nincs megvásárolva.

## 4. Jelenlegi üzleti folyamatok modellje

A mai kereskedelemre, eladásra/vásárlásra szolgáló weboldalak és szolgáltatások nagyrésze mind óriásvállalatok kreációi, sokszor a saját, általuk közvetített termékek megvételére van csak lehetőség. Az ilyen oldalak sokszor a már meglévő cég valamely más szolgáltatásával áll kapcsolatban, és azon a platformon való regisztráció szükséges.
Ezzel szemben megrendelőnk kérésére egy olyan weboldalt fejlesztünk, amely teljesen független minden más szolgáltatástól, csupán erre a platformra való regisztráció szükséges a termékek árusításához. Egy központi rendszer helyett minden felhasználó a saját termékeit hirdetheti, amelyeket szintén egyéb felhasználók vásárolhatnak meg.

## 5. Igényelt üzleti folyamatok modellje

A weboldal felkeresését követően betöltődik a főoldal, ahol a már meglévő hirdetéseket láthatjuk. Ezeket bárki láthatja, aki ellátogat az oldalra, viszont nem vásárolhatja meg azokat, és újabb hirdetéseket sem hozhat létre. Mindehhez regisztráció szükséges, amely egy felhasználónév, email cím és jelszó megadása után lehetséges, továbbá hozzáadhat egy profilképet és egy profilleírást.
A regisztrációt követően a felhasználónak lehetősége lesz a hirdetések böngészése közben megvásárolni a termékeket. Vásárlást követően értékelheti az eladót, azonban ez opcionális. 
Apróhirdetés létrehozásakor a felhasználó megadhatja a termék nevét, egy rövid leírást, illetve képeket tölthet fel hozzájuk, amelyek közül az első kép jelenik meg a főoldalon való böngészés során. Továbbá lehetőség van különböző címkék hozzáadásához, amelyekkel a hasonló termékek keresésekor megjelenhet az ő hirdetése, így a kategorizálás könnyebb lesz. Ezt a hirdetést az eladó szerkesztheti, törölheti, mindaddig, amíg azt nem vásárolja meg valaki.
A cél az, hogy az oldal egyszerű, intuitív és modern legyen, hogy vetélkedhessen más hasonló termékekkel, mint az eBay vagy a Facebook Marketplace.
## 6. Követelménylista

| Id | Modul | Név | Leírás |
| :---: | --- | --- | --- |
| K1 | ... | ... | ... |

## 7. Fogalomtár

| Bonyolult fogalom | Magyarázat |
| ártartomány | Valós számokból álló formális kettes, mely az ár aktuális értékét inkluzív minimum- és maximum közé limitálja. |
| csillag | Öt ágú, hegyes alakzat, valahogy így néz ki: ⭐. |
| apróhirdetés | Kis méretű hirdetés. |

