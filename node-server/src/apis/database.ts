import { Api } from '../api.js';
import { User, Offer, Category } from '../records.js';
import mysql from 'mysql2/promise.js';
import { RowDataPacket } from 'mysql2/promise.js';
import { Config } from '../config.js';
import * as fs from 'fs';
import * as path from 'path';
import { PassThrough } from 'stream';
import { off } from 'process';

/**
 * Könnyítés képpen...
 * 
 * CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
)

 * 
CREATE TABLE `offers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `price` float NOT NULL,
  `description` varchar(1000) NOT NULL,
  `pictures` varchar(1000) NOT NULL,
  `category_id` int(11) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `buyer_id` int(11) DEFAULT NULL,
  `buyer_rating` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_offers_buyer_id` (`buyer_id`),
  CONSTRAINT `FK_offers_buyer_id` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_offers_category_id` FOREIGN KEY (`id`) REFERENCES `categories` (`id`)
)

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `profile_pic` varchar(1000) NOT NULL,
  `bio` varchar(1000) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `average_rating` float NOT NULL,
  PRIMARY KEY (`id`)
)
 */


interface DBConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

/**
  Az adatbázisban tárolja az adatokat.
**/
export class DatabaseApi extends Api {
  isMediaUriUsed(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  
  private db!: mysql.Connection;

  constructor(config: Config) {
    super(config);
    this.connectToDb();
  }

  private async connectToDb() {
    this.db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'wanted',
      port: 3305
    });
  }

  override async yieldUserIds(nameRegex: RegExp | undefined): Promise<number[]> {
    const query = `SELECT id, name FROM users;`;

    const [rows] = await this.db.execute(query);

    let userIds: number[] = [];

    for(const user of rows as {id: number, name: string}[]) {
      if(!nameRegex || nameRegex.test(user.name)) {
        userIds.push(user.id);
      }
    }

    return userIds;

  }
  override async fetchUser(id: number): Promise<User | undefined> {
    const query = `SELECT * FROM users WHERE id = ?;`;

    const [rows] = await this.db.execute<RowDataPacket[]>(query, [id]);

    if(rows.length === 0) {
      return undefined;
    }

    const user = rows[0] as {
      id: number;
      name: string;
      profile_pic: string;
      bio: string;
      email: string;
      password: string;
      average_rating: number;
    }
    const finalUser: User = new User(user.id, {
      id: user.id,
      name: user.name,
      password: user.password,
      email: user.email,
      averageStars: user.average_rating,
      bio: user.bio,
      pictureUri: user.profile_pic
    });

    return finalUser;
  }
  override async commitUser(val: User): Promise<void> {
    const query = `
    INSERT INTO users (id, name, profile_pic, bio, email, password, average_rating)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      profile_pic = VALUES(profile_pic),
      bio = VALUES(bio),
      email = VALUES(email),
      password = VALUES(password),
      average_rating = VALUES(average_rating)
  `;

  const params = [
    val.id,
    val.name,
    val.profilePicUri,
    val.bio,
    val.email,
    val.password,
    val.averageRating
  ];

  await this.db.execute(query, params);
}
  override async dropUser(id: number): Promise<void> {
    const query = `DELETE 
                   FROM users
                   WHERE id = ${id}`;

    const result = await this.db.execute(query);

  }
  override async yieldOfferIds(titleRegex: RegExp | undefined, categoryFilter: number | undefined, minPrice: number | undefined, maxPrice: number | undefined, orderBy: 'id' | 'price' | 'random', descending: boolean): Promise<number[]> {
    let query = 'SELECT id FROM offers WHERE 1=1';
    const params: (string | number)[] = [];
  
    if (titleRegex) {
      query += ` AND title REGEXP ?`;
      params.push(titleRegex.source);
    }
  
    if (categoryFilter !== undefined) {
      query += ` AND category_id = ?`;
      params.push(categoryFilter);
    }
  
    if (minPrice !== undefined) {
      query += ` AND price >= ?`;
      params.push(minPrice);
    }
  
    if (maxPrice !== undefined) {
      query += ` AND price <= ?`;
      params.push(maxPrice);
    }
  
    switch (orderBy) {
      case 'id':
        query += ` ORDER BY id`;
        break;
      case 'price':
        query += ` ORDER BY price`;
        break;
      case 'random':
        query += ` ORDER BY RAND()`;
        break;
    }

    const rows = await this.db.execute(query, params);

    let offers: number[] = []

    for(const offer of rows[0] as {id: number}[]) {
      offers.push(offer.id);
    }

    return offers;
    
  }
  override async fetchOffer(id: number): Promise<Offer | undefined> {
    const query = `SELECT * FROM offers
                   WHERE id = ${id}`;

    const rows = await this.db.execute<RowDataPacket[]>(query);

    if(rows[0].length === 0) {
      return undefined;
    }

    const offer = rows[0][0] as {
      id: number;
      title: string;
      price: number;
      description: string;
      pictures: string;
      category_id: number;
      seller_id: number;
      buyer_id: number | null;
      created: number;
      sold_at: number | null;
      rating: number | null;
    };
  
    const sellerId = offer.seller_id;
    const buyerId = offer.buyer_id;
    const categoryId = offer.category_id;

    return new Offer(id, {
      created: offer.created,
      seller: await this.fetchUser(sellerId),
      title: offer.title,
      category: await this.fetchCategory(categoryId),
      description: offer.description,
      price: offer.price,
      pictureUris: offer.pictures,
      buyer: offer.buyer_id ? await this.fetchUser(buyerId!) : null,
      sold: offer.sold_at,
      buyerRating: offer.rating
    });
  }
  override async commitOffer(val: Offer): Promise<void> {
    console.log("HELOOO");
    let query = ``;
    let params: any[] = [];

    const createdDate = new Date(val.createdTimestamp);

    const formatDate = (date: Date) => {
      const pad = (n: number) => (n < 10 ? '0' + n : n);
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };
  
    const createdDatetime = formatDate(createdDate);
  
    if(val.buyer == null || val.buyer == undefined) {
      query = `
        INSERT INTO offers (created, seller_id, title, category_id, description, price, pictures)
          VALUES (?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            created = VALUES(created),
            seller_id = VALUES(seller_id),
            title = VALUES(title),
            category_id = VALUES(category_id),
            description = VALUES(description),
            price = VALUES(price),
            pictures = VALUES(pictures)
      `;

      params = [
        createdDatetime,
        val.seller.id,
        val.title,
        val.category.id,
        val.description,
        val.price,
        JSON.stringify(val.pictureUris)
      ];
    }
    else {
      query = `
        UPDATE offers
        SET buyer_id = ?, sold_at = ?
        WHERE id = ?`;

        params = [
          val.buyer.id,
          formatDate(new Date()),
          val.id
        ];
    }

    console.log("TESTING");
    console.log(params);
  
    await this.db.execute(query, params);
  }
  override async dropOffer(id: number): Promise<void> {
    const query = `DELETE FROM offers WHERE id = ${id}`;
    const result = await this.db.execute(query);
  }
  override async yieldCategoryIds(nameRegex: RegExp | undefined): Promise<number[]> {
    const query = `SELECT id, category_name FROM categories;`;

    const rows = await this.db.execute<RowDataPacket[]>(query);

          //meow
    const cats: number[] = []

              //meow
    for(const cat of rows[0] as {id: number, category_name: string}[]) {
      if(!nameRegex || nameRegex.test(cat.category_name)) {
        cats.push(cat.id);
      }
    }

    return cats;
  }
  override async fetchCategory(id: number): Promise<Category | undefined> {
    const query = `SELECT * FROM categories WHERE id = ${id};`;

    const [rows] = await this.db.execute<RowDataPacket[]>(query);

    if(rows[0].length === 0) {
      return undefined;
    }

    const cat = rows[0] as {
      id: number;
      category_name: string;
    }
    const newCat: Category = new Category(cat.id, {
      name: cat.category_name
    })

    return newCat;
    
  }
  override async commitCategory(val: Category): Promise<void> {
    const query = `
      INSERT INTO categories (id, name)
      VALUES (${val.id}, 
              ${val.name})
      ON DUPLICATE KEY UPDATE
        name = VALUES(name)
    `;


    const resultPromise = await this.db.execute(query);
  }
  override async dropCategory(id: number): Promise<void> {
    const query = 'DELETE FROM categories WHERE id = ' + id;
    const resultPromise = await this.db.execute(query);
  }
  yieldUnusedMediaUrls(): Promise<string[]> {
    throw new Error('Too fancy...');
  }


}
