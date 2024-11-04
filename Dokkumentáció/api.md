Ez nem kötelező *dokk*umentáció, csak szerintem hasznos, ha pontosan lejegyezzük a webalkalmazás és webszerver közti "REST" APIt.

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

Ha rosszak az adatok, akkor `401 Unauthorized`.


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
  "pictureUrl": "/content/zi35th3hgq93hg945tt45whfasdfasdf.jpg" // A profilkép URL-je
}
```


## PUT /users/ID/password

Frissíti a felhasználó jelszavát. Csak akkor használható, ha jelenleg be vagyunk jelentkezve ezen felhasználóként.

```
{
  password: "körte" // Legalább 1 karakter
}
```


## GET /tags

Hasonló, mint a `GET /users`. Ábécérendben van.

- page
  - Ugyan úgy működik, mint a felhasználóknál.
- filter
  - Címke címe alapján szűr.

```
[
  "anyós",
  "aranyér",
  "automata",
  "cipő",
  "hagymás",
  "hagyományos",
  "kabát",
  "lengőteke",
  "lőfegyver",
  "mosópor",
  "nem lopott",
  "robotgép",
  "teke",
  "tekegolyó"
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
- filterTags
  - Címkék alapján szűr. Több címkét pontosvesszővel elválasztva lehet megadni.
- minPrice, maxPrice
  - Legalacsonyabb, legmagasabb megengedett ár. Nemnegatív egész számok.


## GET /offers/ID

```
{
  "id": 149,
  "title": "Hagyományos mosópor kedvező Áron",
  "sellerId": 36, // A létrehozó felhasználó idje
  "buyerId": 1, // Csak akkor van jelen, ha már elkelt
  "price": 1000, // Nemnegatív egész szám
  "description": "Természetes okokból elhunyt anyósomtól örökölt, kiváló állapotú, alig használt mosópor.\n\nPlz vegye már meg vki",
  "tags": [ // 0 vagy több címke
    "anyós",
    "hagymás",
    "hagyományos",
    "mosópor"
  ]
}
```
