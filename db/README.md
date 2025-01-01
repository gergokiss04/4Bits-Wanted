# Adatbázis létrehozása és csatlakozás

## Szükséges eszközök:
    - MariaDB server
    - Valamilyen SQL adatbázis kezelő alkalmazás, amely támogatja a MariaDB-t (DBeaver ajánlott, ez volt használatban fejlesztéskor is)

## Telepítés menete:
    1. MariaDB server telepítésekor:
        - root jelszava: password
        - port: 3305

    2. DBeaverben való importálás (más alkalmazás is hasonló lehet):
        1. Új adatbázis kapcsolat létrehozása
            - port: 3305
            - Database: maradjon üresen!
            - root jelszó: password
            Minden más alapértelmezett
        2. Új adatbázis létrehozása
            - név: wanted
            Minden más alapértelmezett
        3. SQL dump importálása
            - Jobb klikk az adatbázisra -> Tools -> Restore database
            - megfelelő .sql fájl kiválasztása (dump-wanted-DátumIdőpont.sql a neve)
            - Start