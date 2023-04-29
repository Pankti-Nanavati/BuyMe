-- autobid procedure
DROP PROCEDURE IF EXISTS `bm_auction_system.sp_make_autobid`;
DELIMITER $$
CREATE PROCEDURE `bm_auction_system.sp_make_autobid`(IN `cur_auction_id` INT, IN `amount` FLOAT, OUT `@total_amount` FLOAT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE `email` VARCHAR(255);
    DECLARE `increment` INT;
    DECLARE `upper_limit` INT;
    DECLARE `total_amount` FLOAT;
    DECLARE cur CURSOR FOR
        SELECT `email_id`, `increment`, `upper_limit`
        FROM `bm_auction_system.autobid`
        WHERE `auction_id` = `auction_id`;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    bid_loop: LOOP
        FETCH cur INTO `email`, `increment`, `upper_limit`;
        
        IF done THEN
            LEAVE bid_loop;
        END IF;
        
        SET `total_amount` = `amount` + `increment`;

        IF `total_amount` <= `upper_limit` THEN
            INSERT INTO `bm_auction_system.bid` (`email_id`, `auction_id`, `bidding_timestamp`, `amount`)
            VALUES (`cur_auction_id`, `email`, CURRENT_TIMESTAMP, `total_amount`);
        END IF;
    END LOOP;
    select @total_amount;
    CLOSE cur;
END $$
DELIMITER ;

--insert into sales table
DROP PROCEDURE IF EXISTS `bm_auction_system.sp_salesEntry`;
DELIMITER $$
CREATE PROCEDURE `bm_auction_system.sp_salesEntry`()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur_auction_id INT;
    DECLARE curBuying_email_id varchar(70);
    DECLARE curSeller_email_id varchar(70);
    DECLARE cur_product_id INT;
    DECLARE check_end_time TIMESTAMP;
    DECLARE sale_time TIMESTAMP;
    DECLARE winner_amount FLOAT;
    DECLARE cur CURSOR FOR SELECT auction_id FROM bm_auction_system.auction;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    bid_loop: LOOP
        FETCH cur INTO cur_auction_id;
        
        IF done THEN
            LEAVE bid_loop;
        END IF;
        
        select email_id, product_id, end_time INTO curSeller_email_id,cur_product_id, check_end_time from bm_auction_system.auction where auction_id=cur_auction_id;

        IF check_end_time > NOW() THEN
			select MAX(amount) INTO winner_amount from bm_auction_system.bid where auction_id=cur_auction_id;
            select email_id,bidding_timestamp  INTO curBuying_email_id, sale_time from bm_auction_system.bid where amount = winner_amount and auction_id=cur_auction_id;
			INSERT INTO bm_auction_system.sales (buyer_email_id, seller_email_id, auction_id, product_id, winner_amount,sale_timestamp) VALUES (curBuying_email_id, curSeller_email_id, cur_auction_id, cur_product_id, winner_amount, sale_time);
		END IF;
    END LOOP;

    CLOSE cur;
END $$
DELIMITER ;

--modify notification flag
DROP PROCEDURE IF EXISTS `bm_auction_system.sp_notification`;
DELIMITER $$
CREATE PROCEDURE `bm_auction_system.sp_notification`(IN cur_product_name varchar(25), IN cur_size varchar(25), IN cur_colour varchar(25))
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE u_email_id varchar(70);
    DECLARE u_product_name varchar(25);
    DECLARE u_colour varchar(25);
    DECLARE u_size varchar(25);
    DECLARE cur CURSOR FOR SELECT email_id, product_name, colour, size FROM bm_auction_system.alert;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    bid_loop: LOOP
        FETCH cur INTO u_email_id, u_product_name, u_colour, u_size;
        
        IF done THEN
            LEAVE bid_loop;
        END IF;

        IF u_product_name = cur_product_name and u_colour = cur_colour and u_size = cur_size THEN
			UPDATE bm_auction_system.alert SET send_notification_flag = 1 where email_id = u_email_id;
		END IF;
    END LOOP;

    CLOSE cur;
END $$
DELIMITER ;
