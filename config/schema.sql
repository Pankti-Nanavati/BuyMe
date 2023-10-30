drop database bm_auction_system;

create database bm_auction_system;

use bm_auction_system;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `email_id` varchar(45) NOT NULL,
  `password` varchar(65) DEFAULT NULL,
  PRIMARY KEY (`email_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `email_id` varchar(45) NOT NULL,
  `password` varchar(65) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `phone_number` tinytext,
  `address` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`email_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notif_id` int NOT NULL AUTO_INCREMENT,
  `email_id` varchar(45) NOT NULL,
  `message` varchar(700) DEFAULT NULL,
  `seen` boolean DEFAULT 0,
  PRIMARY KEY (`notif_id`),
  KEY `email_id` (`email_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`email_id`) REFERENCES `user` (`email_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `customer_rep`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_rep` (
  `email_id` varchar(45) NOT NULL,
  `password` varchar(65) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `phone_number` tinytext,
  PRIMARY KEY (`email_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(25) NOT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategory` (
  `subcategory_id` int NOT NULL AUTO_INCREMENT,
  `subcategory_name` varchar(25) NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`subcategory_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(25) NOT NULL,
  `brand` varchar(25) DEFAULT NULL,
  `colour` varchar(25) DEFAULT NULL,
  `size` varchar(25) DEFAULT NULL,
  `price` float NOT NULL,
  `subcategory_id` int NOT NULL,
  `img` varchar(100) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  KEY `subcategory_id` (`subcategory_id`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory` (`subcategory_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `queries_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `queries_answers` (
  `query_id` int NOT NULL AUTO_INCREMENT,
  `user_email_id` varchar(45) NOT NULL,
  `custRep_email_id` varchar(45) NOT NULL,
  `question` varchar(70) DEFAULT NULL,
  `answer` varchar(70) DEFAULT NULL,
  `q_timestamp` timestamp NULL DEFAULT NULL,
  `a_timestamp` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`query_id`),
  KEY `user_email_id` (`user_email_id`),
  KEY `custRep_email_id` (`custRep_email_id`),
  CONSTRAINT `queries_answers_ibfk_1` FOREIGN KEY (`user_email_id`) REFERENCES `user` (`email_id`),
  CONSTRAINT `queries_answers_ibfk_2` FOREIGN KEY (`custRep_email_id`) REFERENCES `customer_rep` (`email_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `user_queries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_queries` (
  `query_id` int NOT NULL AUTO_INCREMENT,
  `user_email_id` varchar(45) NOT NULL,
  `custRep_email_id` varchar(45) NOT NULL,
  `query_type` enum('Reset Password','Delete a Bid','Delete an Auction') DEFAULT NULL,
  `value` varchar(70) DEFAULT NULL,
  `resolved_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`query_id`),
  KEY `user_email_id` (`user_email_id`),
  KEY `custRep_email_id` (`custRep_email_id`),
  CONSTRAINT `user_queries_ibfk_1` FOREIGN KEY (`user_email_id`) REFERENCES `user` (`email_id`),
  CONSTRAINT `user_queries_ibfk_2` FOREIGN KEY (`custRep_email_id`) REFERENCES `customer_rep` (`email_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `auction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auction` (
  `auction_id` int NOT NULL AUTO_INCREMENT,
  `email_id` varchar(45) NOT NULL,
  `product_id` int NOT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `increment_amount` float DEFAULT NULL,
  `minimum_price` float DEFAULT NULL,
  `initial_price` float DEFAULT NULL,
  `has_winner` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`auction_id`),
  KEY `email_id` (`email_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `auction_ibfk_1` FOREIGN KEY (`email_id`) REFERENCES `user` (`email_id`),
  CONSTRAINT `auction_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `autobid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `autobid` (
  `autobid_id` int NOT NULL AUTO_INCREMENT,
  `email_id` varchar(45) NOT NULL,
  `auction_id` int NOT NULL,
  `increment` int NOT NULL,
  `upper_limit` int NOT NULL,
  PRIMARY KEY (`autobid_id`),
  KEY `email_id` (`email_id`),
  KEY `auction_id` (`auction_id`),
  CONSTRAINT `autobid_ibfk_1` FOREIGN KEY (`email_id`) REFERENCES `user` (`email_id`),
  CONSTRAINT `autobid_ibfk_2` FOREIGN KEY (`auction_id`) REFERENCES `auction` (`auction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `bid`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bid` (
  `bid_id` int NOT NULL AUTO_INCREMENT,
  `email_id` varchar(45) NOT NULL,
  `auction_id` int NOT NULL,
  `bidding_timestamp` timestamp NULL DEFAULT NULL,
  `amount` float DEFAULT NULL,
  PRIMARY KEY (`bid_id`),
  KEY `email_id` (`email_id`),
  KEY `auction_id` (`auction_id`),
  CONSTRAINT `bid_ibfk_1` FOREIGN KEY (`email_id`) REFERENCES `user` (`email_id`),
  CONSTRAINT `bid_ibfk_2` FOREIGN KEY (`auction_id`) REFERENCES `auction` (`auction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `alert`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alert` (
  `alert_id` int NOT NULL AUTO_INCREMENT,
  `colour` varchar(25) DEFAULT NULL,
  `size` varchar(25) DEFAULT NULL,
  `email_id` varchar(45) NOT NULL,
  `send_notification_flag` tinyint(1) DEFAULT '0',
  `product_name` varchar(25) NOT NULL,
  PRIMARY KEY (`alert_id`),
  KEY `email_id` (`email_id`),
  CONSTRAINT `alert_ibfk_1` FOREIGN KEY (`email_id`) REFERENCES `user` (`email_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/* Password for admin, user, customerRep is test@123*/
-- Admin password is 'test@123'
INSERT INTO `admin` VALUES ('admin@rutgers.edu','$2b$10$C6RNlN7vrW7H1kMQAUvTCeZvuytftdqbBIEnKJiUJfoTSnLMLWnb6');

INSERT INTO `category` VALUES (1,'shoes');

INSERT INTO `subcategory` VALUES (1,'sports shoes',1),(2,'sandals',1),(3,'heels',1);





