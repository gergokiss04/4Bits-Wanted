-- parancsok mock adatok beillesztésére az adatbázisba

insert into categories (category_name)
values
    ((tech), (books), (board_games), (clothes));

insert into users (name, profile_pic, bio, email, password)
values 
    ("Példa Béla", "../wanted/public/img/profile_pics/pfp1.jpg", "", "peldabela@gmail.com", "jelszo123"),
    ("Kovács János", "../wanted/public/img/profile_pics/pfp2.jpg", "Kovács János vagyok és szeretem a pénzt.", "kovacsjani@gmail.com", "ILoveApples"),
    ("John Doe", "../wanted/public/img/profile_pics/pfp3.jpg", "John Doe John Doe John Doe John Doe", "johndoe@example.com", "johndoe4life");


insert into offers (title, price, description, pictures, category_id, seller_id)
values
    ("iPhone 37 Pro Max Ultra", 3999.99, "A legújabb iPhone", "[{../wanted/public/img/usercontent/img1.jpg}, {../wanted/public/img/usercontent/img2.jpg}]", 1, 1),
    ("Harry Potter and the Half-Blood Prince", 11.95, "egy könyv", "[{../wanted/public/img/usercontent/img3.jpg}, {../wanted/public/img/usercontent/img4.jpg}]", 2, 2),
    ("Újszerű kék farmer", 30.00, "alig használt nadrág", "[{../wanted/public/img/usercontent/img5.jpg}]", 4, 3);

    