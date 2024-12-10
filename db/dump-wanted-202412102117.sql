-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: wanted
-- ------------------------------------------------------
-- Server version	11.4.4-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'tech'),(2,'books'),(3,'board_games'),(4,'clothes');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  `created` datetime DEFAULT current_timestamp(),
  `sold_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_offers_buyer_id` (`buyer_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `FK_offers_buyer_id` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES (10,'iPhone 37 Pro Max Ultra',3999.99,'A legújabb iPhone','[{../wanted/public/img/usercontent/img1.jpg}, {../wanted/public/img/usercontent/img2.jpg}]',1,1,NULL,NULL,'2024-12-09 19:14:15',NULL),(11,'Harry Potter and the Half-Blood Prince',11.95,'egy könyv','[{../wanted/public/img/usercontent/img3.jpg}, {../wanted/public/img/usercontent/img4.jpg}]',2,2,NULL,NULL,'2024-12-09 19:14:15',NULL),(12,'Újszerű kék farmer',30,'alig használt nadrág','[{../wanted/public/img/usercontent/img5.jpg}]',4,3,NULL,NULL,'2024-12-09 19:14:15',NULL);
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `profile_pic` varchar(1000) DEFAULT NULL,
  `bio` varchar(1000) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `average_rating` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Példa Béla','../wanted/public/img/pfp1.jpg','','peldabela@gmail.com','jelszo123',NULL),(2,'Kovács János','../wanted/public/img/pfp2.jpg','Kovács János vagyok és szeretem a pénzt.','kovacsjani@gmail.com','ILoveApples',NULL),(3,'John Doe','../wanted/public/img/pfp3.jpg','John Doe John Doe John Doe John Doe','johndoe@example.com','johndoe4life',NULL),(4,'Minta_123','','','minta123@example.com','a4ac981fb822152730ccb0399b640ee1c645b3a63c73b911661843760d35702b',0),(5,'Karcsi','','','karcsi@gmail.com','bd38f68904fb1b7b99f8dcc7a933e9dd5ef5ccc8cd8c2d648438b02c3d031066',0),(6,'Karcsi','','','karcsi@gmail.com','ae1e37b151e518602c4e1831c131712aff6a2d8ffc769c3cb7c18894ddeeb37a',0),(7,'fhjsdkg','','','minta123@example.com','e46fa87c08cb71f9496d3021b2519d53deb0139e70340138aeb0058f10a4b035',0),(8,'valaki','','','help@now.com','dbda649b45dd18a25736a08102bd6a1d2a6aa2220f3371859aa253cb282870a7',0),(9,'valaki','','','help@now.com','19a312a840d43c6f020da7a6c5dfcafb2627146f22b4f920f903783ef3c5af8b',0),(10,'valaki2','','','valaki@help.me','c7c60808e2fcf8170b3a49434c3bbcca94f5f4ad13c6a158b419e2b22b270b66',0),(11,'valaki3','','','valaki3@gmail.com','dab1398269db2015509335773e167b4aa2c55b09d20d230a3d1b99a6ea3ed6ee',0),(12,'lol','','','lol@gmail.com','ead84295c73e9ba2c59159d2d4b5029e3f3fa630ab5355d7fe2e91832aecf7aa',0),(13,'valaki4','','','valaki4@gmail.com','52224edb487cc69233318b0bbca7e9d6f07cff3aa4f82630ae2539d000bf10dd',0),(14,'János','','','janos@gmail.com','36b796cef0b8037e5a3f4c64cb1c6b5fd9e9338c6a31faac7e5cf2b9db22b221',0),(15,'asd','','','asd@gmail.com','d1305323f010e8ba7c658870b76f5e4f34409e3d1a7938253c98319cffe123ea',0),(16,'teszt','','','teszt@gmail.com','1e7bcae65c1c731c347733480d1cfa2c2bbdc591c006ad6518f7bb983ccf29cb',0),(17,'teszt2','','','teszt2@gmail.com','e1e5cd57d196a8593499157d9046fec85e216d4dd67823b214286f5f126183b0',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'wanted'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-10 21:17:10
