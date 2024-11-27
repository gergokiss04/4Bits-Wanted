import { Api } from '../api.js';
import { User, Offer, Category } from '../records.js';
import mysql from 'mysql2/promise.js';
import deasync from 'deasync';


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
  `category` varchar(100) NOT NULL,
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

/**
  Az adatbázisban tárolja az adatokat.
**/
export class DatabaseApi extends Api {
  private db!: mysql.Connection;

  constructor() {
    super();
    this.connectToDb();
  }

  private async connectToDb() {
    this.db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'Wanted'
    })
  }

  override *yieldUserIds(
    nameRegex: RegExp | undefined = undefined
  ): Generator<number> {
    const query = `SELECT id
                   FROM users`;
    const rowsPromise = this.db.execute(query);

    const rows = deasync(rowsPromise)

    for (const user of rows[0] as { id: number, name: string }[]) {
      if (!nameRegex || nameRegex.test(user.name)) {
        yield user.id;
      }
    }
  }

  override fetchUser(id: number): User | undefined {
    const query = 'SELECT * FROM users WHERE id = ?';
    const rowsPromise = this.db.execute(query, [id]);

    const rows = deasync(rowsPromise);

    if ((rows[0] as any[]).length === 0) {
      return undefined;
    }

    const user = (rows[0] as any[])[0] as {
      id: number;
      name: string;
      profile_pic: string;
      bio: string;
      email: string;
      password: string;
      average_rating: number;
    };

    return new User(user.id, {
      id: user.id,
      name: user.name,
      password: user.password,
      averageStars: user.average_rating,
      bio: user.bio,
      pictureUri: user.profile_pic
    });
  }

  override commitUser(val: User): void {
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
      val.password,
      val.averageRating
    ];

    const result = this.db.execute(query, params);
  }

  override dropUser(id: number): void {
    const query = `DELETE 
                   FROM users
                   WHERE id = ?`;

    const queryId = id;
    const result = this.db.execute(query, queryId);

  }


  override *yieldOfferIds(
    titleRegex: RegExp | undefined = undefined,
    categoryFilter: number | undefined,
    minPrice: number | undefined,
    maxPrice: number | undefined,
    orderBy: "id" | "price" | "random",
    descending: boolean
  ): Generator<number> {
    let query = 'SELECT id FROM offers WHERE 1=1';
    const params: any[] = [];

    if (titleRegex) {
      query += ' AND title REGEXP ?';
      params.push(titleRegex.source);
    }

    if (categoryFilter !== undefined) {
      query += ' AND category_id = ?';
      params.push(categoryFilter);
    }

    if (minPrice !== undefined) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }

    if (maxPrice !== undefined) {
      query += ' AND price <= ?';
      params.push(maxPrice);
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

    const rowsPromise = this.db.execute(query, params);
    const rows = deasync(rowsPromise);

    for (const offer of rows[0] as { id: number }[]) {
      yield offer.id;
    }
  }

  private resolveUser(id: number): User {
    const user = this.fetchUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  private resolveCategory(id: number): Category {
    const category = this.fetchCategory(id);
    if (!category) {
      throw new Error(`Category with id ${id} not found`);
    }
    return category;
  }

  override fetchOffer(id: number): Offer | undefined {
    const query = `SELECT *
                   FROM offers
                   WHERE id = ?`;
    const rowsPromise = this.db.execute(query, id);

    const rows = deasync(rowsPromise);

    if ((rows[0] as any[]).length === 0) {
      return undefined;
    }

    const offer = (rows[0] as any[])[0] as {
      id: number;
      title: string;
      price: number;
      description: string;
      pictures: string;
      category: string;
      seller_id: number;
      buyer_id: number | null;
    };

    return new Offer(offer.id, {
      title: offer.title,
      price: offer.price,
      description: offer.description,
      pictures: offer.pictures,
      category: offer.category,
      sellerId: offer.seller_id,
      buyerId: offer.buyer_id
    }, this.resolveUser.bind(this), this.resolveCategory.bind(this));
  }

  override commitOffer(val: Offer): void {
    const query = `
      INSERT INTO offers (id, title, price, description, pics, category, buyer_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        id = VALUES(id),
        title = VALUES(title),
        price = VALUES(price),
        description = VALUES(description),
        pics = VALUES(pics),
        category = VALUES(category),
        buyer_id = VALUES(buyer_id)
    
    `;


    const params = [
      val.id,
      val.title,
      val.price,
      val.description,
      val.pictureUris.join(','),
      val.category,
      val.buyer
    ];

    const resultPromise = this.db.execute(query, params);
    deasync(resultPromise);

  }

  override dropOffer(id: number): void {
    const query = 'DELETE FROM offers WHERE id = ?';
    const resultPromise = this.db.execute(query, [id]);
    deasync(resultPromise);
  }


  override *yieldCategoryIds(
    nameRegex: RegExp | undefined = undefined
  ): Generator<number> {
    const query = 'SELECT id FROM categories';
    
    const resultPromise = this.db.execute(query);
    const rows = deasync(resultPromise);

    for (const cat of rows[0] as { id: number, name: string }[]) {
      if (!nameRegex || nameRegex.test(cat.name)) {
        yield cat.id;
      }
    }
  }

  override fetchCategory(id: number): Category | undefined {
    const query = 'SELECT * FROM categories WHERE id = ?';
    const rowsPromise = this.db.execute(query, [id]);

    const rows = deasync(rowsPromise);

    if ((rows[0] as any[]).length === 0) {
      return undefined;
    }

    const category = (rows[0] as any[])[0] as {
      id: number;
      name: string;
    };

    return new Category(category.id, {
      name: category.name
    });
  }

  override commitCategory(val: Category): void {
    const query = `
      INSERT INTO categories (id, name)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name)
    `;
    const params = [
      val.id,
      val.name
    ];

    const resultPromise = this.db.execute(query, params);
    deasync(resultPromise);
  }

  override dropCategory(id: number): void {
    const query = 'DELETE FROM categories WHERE id = ?';
    const resultPromise = this.db.execute(query, [id]);
    deasync(resultPromise);
  }


  override *yieldUnusedMediaUrls(): Generator<string> {
    throw new Error('Not implemented.') // TODO
  }

}
