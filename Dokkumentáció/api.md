Ez nem kötelező *dokk*umentáció, csak szerintem hasznos, ha pontosan lejegyezzük a webalkalmazás és webszerver közti REST APIt.

Minden API útvonal a `/api`-hoz képest van, tehát a `/minta` a `http://webhely.example/api/minta` cím alatt érhető el. Természetesen mi nem áldozunk pénzt domain névre, tehát a gyakorlatban a `webhely.example` helyett valószínűleg `127.0.0.1` lesz.

**A webszerver még nincs implementálva, tehát ez még csak ötletelés**

# Egyedek

User:
- felhasználónév -> szöveg
- jelszó (titkos) -> szöveg
- pénz -> valós
- átlagos csillag (számított mező) -> valós
- profilleírás -> hosszú szöveg
- profilkép -> uri

Offer:
- eladó -> &User
- cím -> szöveg
- címkék -> szöveg[]
- hosszas leírás -> hosszú szöveg
- ár -> valós
- képek -> uri[]
- vásárló (null, ha még nem kelt el) -> &User?
- vásárló értékelése (null, ha a vásárló még nem értékelte) -> valós?


## /auth

### POST

Megpróbál bejelentkezni

Minta kérés:
```
{
  "login": "Minta_123",
  "pass": "alma"
}
```

Ha a bejelentkezési adatok jók, akkor lesz egy Set-Cookie header a válaszban, ami beállítja a `session_token`t:
`Set-Cookie: session_token=asdfghjl123; HttpOnly;`

Ha rosszak az adatok, akkor `401 Unauthorized`.


## /logout

### POST

Erre az endpointra bármit posztolva megszűnik a session.

Minta kérés:
```
{}
```

A szerver megszűnteti az ő oldalán a sessiont, és valami érvénytelen cookiet küld vissza:
`Set-Cookie: session_token=deleted;`


## /users

### GET

Visszaadja legfeljebb 100 felhasználó egyedi id-jét.

Query paraméterek:
- page
  - A 0. page az első 100 user, az 1. a második 100, és így tovább. Ha már nincs több user, akkor üres array jön vissza.
- search
  - Csak az olyan felhasználókra szűkíti a választ, akik nevében benne van ennek az értéke. Pl. ha `?search=Minta`, akkor valószínűleg csak a 36-os usert adná vissza, mert ő `Minta_123`.

```
[
  1,
  36,
  75,
  74,
  11
]
```


## /users/ID

### GET
```
{
  "id": 36, // Pozitív egész, megegyezik a kért ID-vel
  "name": "Minta_123", // Alfanumerikus, kis- és nagybetű, kötőjel, alávonás
  "averageStars": 4.5333334, // Valós szám 0-tól 5-ig (inkluzív)
  "bio": "Profilleírás, hosszú szöveg,\nújsorokkal, <b>bármilyen szöveggel! Ez nem szabad, hogy félkövéren jelenjen meg!</b>", // Profilleírás, max. 4000 byte (UTF8-ként)
}
```
