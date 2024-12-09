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
    const query = `SELECT id FROM users;`;

    const [rows] = await this.db.execute(query);

    console.log(rows);
    let userIds: number[] = [];
    for(const user of rows as {id: number, name:string}[]) {
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

    return new User(user.id, {
      id: user.id,
      name: user.name,
      password: user.password,
      email: user.email,
      averageStars: user.average_rating,
      bio: user.bio,
      pictureUri: user.profile_pic
    });
  }
  override async commitUser(val: User): Promise<void> {
    const query = `
      INSERT INTO users (id, name, profile_pic, bio, email, password, average_rating)
      VALUES (${val.id}, 
              ${val.name}, 
              ${val.profilePicUri}, 
              ${val.bio},
              ${val.email}, 
              ${val.password}, 
              ${val.averageRating}
      )
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        profile_pic = VALUES(profile_pic),
        bio = VALUES(bio),
        email = VALUES(email),
        password = VALUES(password),
        average_rating = VALUES(average_rating)
    `;

    const result = await this.db.execute(query);

  }
  override async dropUser(id: number): Promise<void> {
    const query = `DELETE 
                   FROM users
                   WHERE id = ${id}`;

    const result = await this.db.execute(query);

  }
  override async yieldOfferIds(titleRegex: RegExp | undefined, categoryFilter: number | undefined, minPrice: number | undefined, maxPrice: number | undefined, orderBy: 'id' | 'price' | 'random', descending: boolean): Promise<number[]> {
    let query = 'SELECT id FROM offers WHERE 1=1';


    if (titleRegex) {
      query += ` AND title REGEXP ${titleRegex.source}`;
      
    }

    if (categoryFilter !== undefined) {
      query += ` AND category_id = ${categoryFilter}`;

    }

    if (minPrice !== undefined) {
      query += ` AND price >= ${minPrice}`;

    }

    if (maxPrice !== undefined) {
      query += ` AND price <= ${maxPrice}`;

    }

    if (orderBy === "price") {
      query += ' ORDER BY price';
    } else if (orderBy === "random") {
      query += ' ORDER BY RAND()';
    } else {
      query += ' ORDER BY id';
    }

    if (descending) {
      query += ' DESC';
    }

    const rows = await this.db.execute(query);

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

    const offer = (rows[0] as any[])[0] as {
      id: number;
      title: string;
      price: number;
      description: string;
      pictures: string[];
      category: number;
      seller_id: number;
      buyer_id: number | null;
      created: number;
      sold: number;
      rating: number;
    }

    return new Offer(id, {
      created: offer.created,
      sellerId: offer.seller_id,
      title: offer.title,
      categoryId: offer.category,
      description: offer.description,
      price: offer.price,
      pictureUris: offer.pictures,
      buyer: offer.buyer_id,
      sold: offer.sold,
      buyerRating: offer.rating
    });
  }
  override async commitOffer(val: Offer): Promise<void> {
    const query = `
    INSERT INTO offers (id, title, price, description, pictures, category_id, seller_id, buyer_id, buyer_rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      price = VALUES(price),
      description = VALUES(description),
      pictures = VALUES(pictures),
      category_id = VALUES(category_id),
      seller_id = VALUES(seller_id),
      buyer_id = VALUES(buyer_id),
      buyer_rating = VALUES(buyer_rating)
  `;

  const params = [
    val.id,
    val.title,
    val.price,
    val.description,
    JSON.stringify(val.pictureUris),
    val.category.id,
    val.buyer ? val.buyer.id : null,
    val.seller.id,
    val.soldTimestamp,
    val.buyerRating
  ];

  await this.db.execute(query, params);
  }
  override async dropOffer(id: number): Promise<void> {
    const query = `DELETE FROM offers WHERE id = ${id}`;
    const result = await this.db.execute(query);
  }
  override async yieldCategoryIds(nameRegex: RegExp | undefined): Promise<number[]> {
    const query = `SELECT id FROM categories;`;

    const rows = await this.db.execute<RowDataPacket[]>(query);

          //meow
    const cats: number[] = []

              //meow
    for(const cat of rows[0] as {id: number, category_name: string}[]) {
      if(!nameRegex || nameRegex.test(cat.category_name)) {
        //meowmeow
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
      name: string;
    }

    return new Category(cat.id, {
      name: cat.name
    })
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
