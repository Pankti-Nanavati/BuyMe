DROP DATABASE IF EXISTS bm_auction_system;
CREATE DATABASE bm_auction_system;
use bm_auction_system;
CREATE TABLE `user` (
  `email_id` varchar(45) NOT NULL,
  `password` varchar(65) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `phone_number` tinytext,
  `address` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`email_id`)
);
truncate user;
select * from user;

drop table user;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';

CREATE USER 'buyme-user'@'localhost' IDENTIFIED BY 'buyme';
GRANT ALL ON bm_auction_system.* TO 'buyme-user'@'localhost';

CREATE TABLE `category` (
  `category_id` int(2) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(25) NOT NULL,
  PRIMARY KEY (`category_id`)
);

INSERT INTO `bm_auction_system`.`category`
(`category_name`)
VALUES
("shoes");

CREATE TABLE `subcategory` (
  `subcategory_id` int(2) NOT NULL AUTO_INCREMENT,
  `subcategory_name` varchar(25) NOT NULL,
  `category_id` int(2) NOT NULL,
  PRIMARY KEY (`subcategory_id`),
  FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`)
);

INSERT INTO `bm_auction_system`.`subcategory`
(`subcategory_name`,
`category_id`)
VALUES
("sports shoes", 1);
INSERT INTO `bm_auction_system`.`subcategory`
(`subcategory_name`,
`category_id`)
VALUES
("sandals", 1);
INSERT INTO `bm_auction_system`.`subcategory`
(`subcategory_name`,
`category_id`)
VALUES
("heels", 1);

CREATE TABLE `product` (
  `product_id` int(2) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(25) NOT NULL,
  `brand` varchar(25),
  `colour` varchar(25),
  `size` varchar(25),
  `price` float(10) NOT NULL,
  `description` LONGTEXT,
  `subcategory_id` int(2) NOT NULL,
  PRIMARY KEY (`product_id`),
  FOREIGN KEY (`subcategory_id`) REFERENCES `subcategory`(`subcategory_id`)
);

INSERT INTO `bm_auction_system`.`product`
(`product_name`,
`brand`,
`colour`,
`size`,
`price`,
`subcategory_id`)
VALUES
("PUMA Smash V2 Sneakers", "PUMA", "white", 5, 50, 1);

INSERT INTO `bm_auction_system`.`product`
(`product_name`,
`brand`,
`colour`,
`size`,
`price`,
`subcategory_id`)
VALUES
("PUMA Smash V2 Sneakers", "PUMA", "white", 6, 50, 1);


INSERT INTO `bm_auction_system`.`product`
(`product_name`,
`brand`,
`colour`,
`size`,
`price`,
`subcategory_id`)
VALUES
("PUMA Smash V2 Sneakers", "PUMA", "white", 7, 50, 1);


CREATE TABLE `auction` (
  `auction_id` int(5) NOT NULL AUTO_INCREMENT,
  `email_id` varchar(45) NOT NULL,
  `product_id` int(2) NOT NULL,
  `end_time` TIMESTAMP, 
  `start_time` TIMESTAMP, 
  `increment_amount` float(10), 
  `minimum_price` float(10), 
  `initial_price` float(10), 
  PRIMARY KEY (`auction_id`),
  FOREIGN KEy (`email_id`) REFERENCES `user`(`email_id`),
  FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`)
);

Create Table `bid` (
  `bid_id` int(10) NOT NULL AUTO_INCREMENT, 
  `email_id` varchar(45) NOT NULL, 
  `auction_id` int(5) NOT NULL,
  `bidding_timestamp` TIMESTAMP, 
  `amount` float(10),
  PRIMARY KEY (`bid_id`), 
  FOREIGN KEY (`email_id`) REFERENCES user (`email_id`), 
  FOREIGN KEY (`auction_id`) REFERENCES `auction` (`auction_id`)
);


Create Table autobid (
  `autobid_id` int(10) NOT NULL AUTO_INCREMENT, 
  `email_id` varchar(45) NOT NULL, 
  `auction_id` int(5) NOT NULL,
  `increment` int(10) NOT NULL, 
  `upper_limit` int(10) NOT NULL,
  PRIMARY KEY (`autobid_id`), 
  FOREIGN KEY (`email_id`) REFERENCES user (`email_id`), 
  FOREIGN KEY (`auction_id`) REFERENCES `auction` (`auction_id`)
);

Create Table alert (
  `alert_id` int(10) NOT NULL AUTO_INCREMENT,
  `colour` varchar(25),
  `size` varchar(25),
  `email_id` varchar(45) NOT NULL,
  `send_notification_flag` Boolean DEFAULT 0,
  `product_name` varchar(25) NOT NULL, 
  PRIMARY KEY (`alert_id`), 
  FOREIGN KEY (`email_id`) REFERENCES user (`email_id`));

Create Table admin (
  `email_id` varchar(45) NOT NULL,
  `password` varchar(65) DEFAULT NULL,
  PRIMARY KEY (`email_id`)
);

CREATE TABLE `customer_rep` (
  `email_id` varchar(45) NOT NULL,
  `password` varchar(65) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `phone_number` tinytext,
  PRIMARY KEY (`email_id`)
);

create table `sales` (
  `sale_id` int(100) NOT NULL AUTO_INCREMENT,
  `buyer_email_id` varchar(45) NOT NULL,
  `seller_email_id` varchar(45) NOT NULL,
  `auction_id` int(5) NOT NULL,
  `product_id` int(2) NOT NULL,
  `amount` float(10),
  `sale_timestamp` TIMESTAMP,
  PRIMARY KEY (`sale_id`),
  FOREIGN KEY (`buyer_email_id`) REFERENCES user (`email_id`), 
  FOREIGN KEY (`seller_email_id`) REFERENCES user (`email_id`), 
  FOREIGN KEY (`auction_id`) REFERENCES `auction` (`auction_id`),
  FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`)
);

Create Table `user_queries` (
  `query_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_email_id` varchar(45) NOT NULL,
  `custRep_email_id` varchar(45) NOT NULL,
  `query` LONGTEXT,
  `query_type` ENUM('Reset Password', 'Delete a Bid', 'Delete an Auction'),
  `value` varchar(70);
  `resolved_flag` Boolean DEFAULT 0,
  PRIMARY KEY (`email_id`)
  FOREIGN KEY (`user_email_id`) REFERENCES user (`email_id`), 
  FOREIGN KEY (`custRep_email_id`) REFERENCES `customer_rep` (`email_id`)
);


