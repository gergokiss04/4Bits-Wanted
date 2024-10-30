# Funkcionális specifikáció
## 1. Jelenlegi helyzet leírása
Az adott marketplace weboldalt azért szeretnénk megvalósítani, hogy a környezetvédelmet és a fenntarthatóságot elősegítsük. Az új termékek vásárlásával ellentétben a használt termékek adásvétele csökkenti a hulladék mennyiségét és hozzájárul az erőforrások fenntarthatóbb felhasználásához. Spórolás: A vásárlók számára a használt termékek olcsóbb alternatívát kínálnak az új termékekkel szemben. Ezen kívül az eladóknak is lehetőséget biztosít, hogy visszakapjanak valamennyit a korábban megvásárolt termékek árából, így kevésbé jelent anyagi veszteséget egy-egy tárgy. Hozzáférhetőség és választék bővítése: Egy ilyen platform lehetőséget kínál arra, hogy ritkán elérhető, egyedi termékekhez is hozzá lehessen jutni. Régebbi, vagy limitált kiadású tárgyak gyakran csak használtan kaphatók, és egy használt termékekkel foglalkozó weboldal megkönnyíti ezek megtalálását. Nem utolsó sorban az egyszerűség és kényelem: Az online platformok egy helyen gyűjtik össze a használt termékeket, egyszerűvé és gyorssá téve a keresést, a kommunikációt, és az adásvételt. 

## 2. Vágyálomrendszer leírása
A weboldalunk célja egy olyan felületet létrehozni,ami egy marketplace-t valósít meg.Manapság igen népszerű az ilyen és ehhez hasonló platformok ahol megunt vagy nem használt termékeinket árulni tudjuk vagy megvásárolni. Ezzel olcsóbban tudunk hozzájutni régóta vágyott tárgyakhoz.Az oldalon termék típusok szerint lehet majd szűrni,hogy éppen elektronikai eszköz,ruhadarabok,könyvek vagy társasjátékok közül válogathatunk.Vásárlás lebonyolítása utánvéttel csomagküldő szolgáltatással biztosítjuk,hogy mindenki számára biztonságos legyen az adás-vétel.Ezután értékelhetjük az eladót,hogy mennyire voltunk megelégedve a termék pontos leírásával, csomagolással, kommunikációval.

## 3. Jelenlegi üzleti folyamatok modellje
A mostani marketplace weboldalak túlnyomó része nem valós profilból létrehozott hirdetéseket tartalmaz,ami feltételezheti,hogy nem tudjuk megvásárolni a terméket vagy csalás áldozatai is lehetünk.A weboldalunk emiatt csak az utánvételes vásárlás lehetséges,így a vásárló akkor fizet amikor a kezében tartja a levelet/csomagot.Illetve az eladó értékeléseiből tudunk következtetni,hogy biztonságos-e tőle vásárolni vagy sem.

## 4. Igényelt üzleti folyamatok modellje

## 5. Követelménylista

| Id | Modul | Név | Leírás |
| :---: | --- | --- | --- |
| K1 | Felület | Főoldal | Weboldal megnyitásakor ez fogadja a felhasználót |
| K2 | Felület | Termékek | Meghirdetett termékek listája egy legördülő menüben |
| K3 | Felület | Profil | Regisztrált profil megtekintése |
| K4 | Felület | Hirdetés feladása | Szükséges adatok megadása,hogy érvényes legyen a hirdetés megjelenítése a weboldalon |
| K5 | Felület | Bejelentkezés/Regisztráció | Felhaszáló készítése illetve bejelentkezés |

## 6. Használati esetek

```
                                                          .#            .#  
                                                          #.            #.  
                                                                            
###### ###### #      #    #   ##     ###: ###### ##   #   ##   #        ##  
#      #      #      #    #   ##   #   .#        ##.  #   ##   #      :#  #:
#      #      #      #    #  :##:  #         :#  #:   #  :##:  #      #.  .#
#      #      #      #    #   ::   # .       #:  # #  #   ::   #      #    #
###### ###### #      ######  #..#    ##          #    #  #..#  #      #    #
#      #      #      #    #  #  #       #  :#    #  # #  #  #  #      #    #
#      #      #      #    # :####:      #  #:    #   :# :####: #      #.  .#
#      #      #      #    #  :  :  #.   # #      #  .##  :  :  #      :#  #:
#      ###### ###### #    # #.  .# :####. ###### #   ## #.  .# ######   ##  
```
A felhasználó felhasználhatja az alkalmazást. Létrehozhat apróhirdetést, ilyenkor ELADÓi szerepkört tölt be, vagy kereshet és találhat és megvásárolhat, ilyenkor VÁSÁRLÓi szerepkörű.


```
                              .#  
                              #.  
                                  
###### #        ##   ####:    ##  
#      #        ##   #  :#. :#  #:
#      #       :##:  #   :# #.  .#
#      #        ::   #    # #    #
###### #       #..#  #    # #    #
#      #       #  #  #    # #    #
#      #      :####: #   :# #.  .#
#      #       :  :  #  :#. :#  #:
###### ###### #.  .# ####:    ##  
```
Az eladó eltávolíthatja a hirdetését, amíg az nem kelt el. Pénzt kap, ha megveszik a hirdetését.

```
         .#            .#                   .#  
         #.            #.                   #.  
                                                
#.  .#   ##     ###:   ##   #####  #        ##  
 :  :    ##   #   .#   ##   #    # #      :#  #:
:#  #:  :##:  #       :##:  #    # #      #.  .#
 #  #    ::   # .      ::   #   :# #      #    #
 #..#   #..#    ##    #..#  #####  #      #    #
  ::    #  #       #  #  #  #  .#: #      #    #
 :##:  :####:      # :####: #   .# #      #.  .#
  ##    :  :  #.   #  :  :  #    # #      :#  #:
  ##   #.  .# :####. #.  .# #    : ######   ##  
```
A vásárlónak alapvető jogában áll a saját pénzének elköltése.

## 7. Megfeleltetés, hogyan fedik le a használati eseteket a követelményeket

A felhasználó lefedi az első három követelményt, az eladó a negyediket, az 5-6-7-et pedig a vásárló fedi le.

## 8. Képernyőtervek

![képnév](gitlink ahol a kép van)

## 9. Forgatókönyvek

4 szereplő van: A felhasználó, a web app, a backend szerver, és az adatbázis.

- Felhasználó: Ő dönti el, mit akar csinálni.
- Web app: Ez a porcelán a backend API-ja fölé, ahol tud kattintgatni a felhasználó.
- Backend szerver: Feldolgozza a kéréseket.
- Adatbázis: Túlbonyolított csv fájlként működve eltárolja a backend számára az adatokat.

## 10. Funkció - követelmény megfeleltetése

| Id | Követelmény | Funkció |
| :---: | --- | --- |
| K4 | ... | ... |

## 11 Fogalomszótár
