Ez nem kötelező *dokk*umentáció, csak szerintem hasznos, ha pontosan lejegyezzük a webalkalmazás és webszerver közti "REST" APIt.

Minden API útvonal a `/api`-hoz képest van, tehát a `/minta` a `http://webhely.example/api/minta` cím alatt érhető el. Természetesen mi nem áldozunk pénzt domain névre, tehát a gyakorlatban a `webhely.example` helyett valószínűleg `127.0.0.1` lesz.

A "hanyadik" **indexek 0-tól kezdődnek**, tehát az `["Egyéb", "Műszaki cikkek"]` 1. eleme a `"Műszaki cikkek"`!

**A webszerver még nincs implementálva, de az API már kb. végleges**

# Egyedek

| Jel | magyarázat |
| --- | --- |
| típus? | lehet null |
| &típus | hivatkozás |
| típus[] | több lehet |

User:
- id -> egész
- name -> szöveg
- password (titkos) -> szöveg
- pénz -> valós
- average_rating (számított mező) -> valós
- bio -> hosszú szöveg
- profile_pic -> uri

Offer:
- id -> egész
- seller_id -> &User
- title -> szöveg
- category -> &Kategória
- description -> hosszú szöveg
- price -> valós
- pictures -> uri[]
- buyer_id (null, ha még nem kelt el) -> &User?
- buyer_rating (null, ha a vásárló még nem értékelte) -> valós?

Kategória:
- id -> egész
- category_name -> szöveg


# Gyakori hibák

- `400 Bad Request`: Ha rossz a kérés. Lehet, hogy jár hozzá egy `text/plain` body
- `401 Unauthorized`: Ha bejelentkezés szükséges, és a nem vagy bejelentkezve.
- `403 Forbidden`: Ha másnak a dolgát akarjuk piszkálni.

Ha nem `200 OK`, akkor lehet, hogy van `text/plain` hibaüzenet a válaszban. Ez fejleszési célú, ne írjuk ki közvetlenül a felhasználónak!


## POST /register

Új fiókot regisztrál. Csak kijelentkezve működik. Ha már van ilyen nevű felhasználó, akkor `400 Bad Request`, tehát előtte érdemes egy `GET /users/filter=Minta_123`-mal ellenőrizni, hogy létezik-e már.

Minta kérés:
```
{
  "email": "minta123@example.com",
  "login": "Minta_123",
  "pass": "alma"
}
```


## POST /auth

Megpróbál bejelentkezni, vagy meghosszabbítja a meglévő sessiont.

Minta kérés kijelentkezve:
```
{
  "login": "Minta_123",
  "pass": "alma"
}
```

Ha a bejelentkezési adatok jók, akkor lesz egy Set-Cookie header a válaszban, ami beállítja a `session_token`t:
`Set-Cookie: session_token=asdfghjl123; HttpOnly;`

Ha rosszak az adatok, akkor `403 Forbidden`.


Minta kérés bejelentkezve:
```
{}
```

Ilyenkor meghosszabbítja a jelenlegi session érvényességét, ha az még érvényes. Viszont ha már lejárt, akkor ez is `401 Unauthorized` lesz, ilyenkor újra be kell jelentkezni.


## POST /logout

Erre az endpointra bármit posztolva megszűnik a session.

Minta kérés:
```
{}
```

A szerver megszűnteti az ő oldalán a sessiont, és valami érvénytelen cookiet küld vissza:
`Set-Cookie: session_token=deleted;`


## GET /users

Visszaadja legfeljebb 100 felhasználó egyedi id-jét.

Query paraméterek:
- page
  - A 0. page az első 100 user, az 1. a második 100, és így tovább. Ha már nincs több user, akkor üres array jön vissza.
- filter
  - Csak az olyan felhasználókra szűkíti a választ, akik nevében benne van ennek az értéke. Pl. ha `?search=mint`, akkor a 36-ot adná vissza, mert ő `Minta_123`, meg minden másik olyan felhasználót, akinek benne van a nevében, hogy "mint".

```
[
  1,
  36,
  75,
  74,
  11
]
```


## GET /users/ID

```
{
  "id": 36, // Pozitív egész, megegyezik a kért ID-vel
  "name": "Minta_123", // Alfanumerikus, kis- és nagybetű, kötőjel, alávonás
  "averageStars": 4.5333334, // Valós szám 0-tól 5-ig (inkluzív)
  "bio": "Profilleírás, hosszú szöveg,\nújsorokkal, <b>bármilyen szöveggel! Ez nem szabad, hogy félkövéren jelenjen meg!</b>", // Profilleírás, max. 4000 byte (UTF8-ként)
  "pictureUri": "/content/zi35th3hgq93hg945tt45whfasdfasdf.jpg" // A profilkép URI-je. Ezzel már jobbak vagyunk, mint a kanban.
}
```

## PUT /users/ID/bio

Frissíthetjük saját profilleírásunkat. Vigyázz! Ez **nem `application/json`**, hanem `text/plain`!

```
Profilleírás, hosszú szöveg,
újsorokkal, <b>bármilyen szöveggel! Ez nem szabad, hogy félkövéren jelenjen meg!</b>
```

## POST /users/ID/picture

Frissíthetjük saját profilképünket. Ez azért nem PUT, mert nem idempotens. (minden kérés után változik a `pictureUri`-nk, még akkor is, ha ugyan azt a képet töltjük fel)

```
(a request body egy kép)
```

## PUT /users/ID/password

Frissíti a felhasználó jelszavát. Csak akkor használható, ha jelenleg be vagyunk jelentkezve ezen felhasználóként.

```
{
  password: "körte" // Legalább 1 karakter
}
```

## DELETE /users/ID

Magunkat törölhetjük ezzel, persze csak ha be vagyunk jelentkezve.


## GET /categories

```
[
  "Egyéb",
  "Műszaki cikkek"
]
```


## GET /offers

Olyan, mint a `GET /users`.

Query paraméterek:
- page
  - Ugyan úgy működik, mint a felhasználóknál.
- includeSold
  - Megjelenjenek-e a már elkelt ajánlatok. Alapból false.
- filterTitle
  - Cím alapján szűr.
- filterCategory
  - Kategória sorszáma alapján szűr.
- minPrice, maxPrice
  - Legalacsonyabb, legmagasabb megengedett ár. Nemnegatív egész számok.

## GET /offers/random

Visszaadja néhány random offer ID-jét.

Query paraméterek:
- count
    - Legfeljebb ennyit ad vissza. Alapértelmezett: 10.

`GET /offers/random?count=5`
```
[1, 54, 149]
```

Nem biztos, hogy tényleg létezik annyi offer, amennyit kérsz!


## GET /offers/ID

```
{
  "id": 149,
  "created": 1730810798, // UTC Unix időbélyeg, ekkor jött létre
  "title": "Hagyományos mosópor kedvező Áron",
  "sellerId": 36, // A létrehozó felhasználó idje
  "buyerId": 1, // Csak akkor van jelen, ha már elkelt
  "sold": 1730810798, // UTC Unix időbélyeg, ekkor kelt el. Csak akkor van jelen, ha már elkelt
  "price": 1000, // Nemnegatív egész szám
  "description": "Természetes okokból elhunyt anyósomtól örökölt, kiváló állapotú, alig használt mosópor.\n\nPlz vegye már meg vki",
  "categoryId": 1, // Hanyadik kategória a /categories-ből
  "pictureUris": [ // 0 vagy több uri
    "/media/q394ghq39ztq3t4q3t5.jpg",
    "/media/77385fz8732z68732z634t8.png",
    "/media/w3v896z3948v9zv9vt.webp"
  ]
}
```

## POST /offers

Új offert hoz létre. A képek a médiaelőkészítőből jönnek, mely egyben ki is ürül az offer létrejöttének hatására.

**FONTOS**: A képeket először bele kell rakni a médiaelőkészítőbe! (lásd `/mediastager` lentebb)

```
{
  "title": "Hagyományos mosópor kedvező Áron",
  "price": 1000, // Nemnegatív egész szám
  "description": "Természetes okokból elhunyt anyósomtól örökölt, kiváló állapotú, alig használt mosópor.\n\nPlz vegye már meg vki",
  "categoryId": 1, // Hanyadik kategória a /categories-ből
}
```

## DELETE /offers/ID

Csak akkor használható, ha mi hoztuk létre az offert, és még nem kelt el.

## GET /offers/ID/rating

Csak akkor hozzáférhető, ha az offert megvásárolt felhaszálóként vagyunk bejelentkezve, és már értékeltük ezt az offert. Ha még nem értékeltük, akkor `404 Not Found`.

```
{
  "stars": 4 // 0, 1, 2, 3, 4, vagy 5
}
```

## POST /offers/ID/rating

Csak akkor hozható létre, hogyha az offert megvásárolt felhaszálóként vagyunk bejelentkezve, és még nem értékeltük ezt az offert. Nyílván csak egyszer lehet értékelni, mivel miután ide POSToltunk, már értékelve lesz. A formátum ugyan az, mint a GET.


## GET /mediastager

Megnézi, mik vannak az előkészítőben. Amikor új offert hozunk létre, akkor az összes médiaelőkészítőben tárolt kép kivevődik, és azok lesznek az offer képei.

```
{
  "imagesLeft": 7 // Még hány képet lehet hozzáadni, mielőtt megtelik.
  "uris": [
    "/media/q394ghq39ztq3t4q3t5.jpg",
    "/media/77385fz8732z68732z634t8.png",
    "/media/w3v896z3948v9zv9vt.webp"
  ]
}
```

## POST /mediastager

Beletesz egy képet a médiaelőkészítőbe. Ha már nincs hely (az imagesLeft 0), akkor `400 Bad Request`.

```
(a request body egy kép, amit hozzá szeretnénk adni az előkészítőhöz)
```

## DELETE /mediastager/INDEX

Kidobja az `INDEX`-edik médiát az előkészítőből. Ha nem létezőt próbálunk meg törölni, akkor `404 Not Found`.

## DELETE /mediastager

Kidob mindent az előkészítőből.
