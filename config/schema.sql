DROP DATABASE IF EXISTS bm_auction_system;
CREATE DATABASE bm_auction_system;

CREATE TABLE `user` (
  `email_id` varchar(45) NOT NULL,
  `password` varchar(65) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `user_name` varchar(50) DEFAULT NULL,
  `phone_number` tinytext,
  `address` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`email_id`)
);


INSERT INTO `bm_auction_system`.`user`
(`email_id`,
`password`,
`name`,
`user_name`,
`phone_number`,
`address`) VALUES
('vamsi.bulusu@rutgers.edu',
'vamsi123',
'Vamsi Krishna',
'vamsi99',
'9087206242',
'285 George ST');

CREATE TABLE `category` (
  `category_id` int(2) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(25) NOT NULL,
  PRIMARY KEY (`category_id`)
);

CREATE TABLE `subcategory` (
  `subcategory_id` int(2) NOT NULL AUTO_INCREMENT,
  `subcategory_name` varchar(25) NOT NULL,
  `category_id` int(2) NOT NULL,
  PRIMARY KEY (`subcategory_id`),
  FOREIGN KEY (`category_id`) REFERENCES category
);

CREATE TABLE `product` (
  `product_id` int(2) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(25) NOT NULL,
  `brand` varchar(25),
  `colour` varchar(25),
  `size` varchar(25),
  `price` float(10) NOT NULL,
  `subcategory_id` NOT NULL,
  PRIMARY KEY (`product_id`),
  FOREIGN KEY (`subcategory_id`) REFERENCES subcategory
);

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
  FOREIGN KEy (`email_id`) REFERENCES user,
  FOREIGN KEY (`product_id`) REFERENCES product
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










