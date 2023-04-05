DROP DATABASE IF EXISTS bm_auction_system;
CREATE DATABASE bm_auction_system;

CREATE TABLE `user` (
  `email_id` varchar(45) NOT NULL,
  `password` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `user_name` varchar(20) DEFAULT NULL,
  `phone_number` tinytext,
  `address` varchar(45) DEFAULT NULL,
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








