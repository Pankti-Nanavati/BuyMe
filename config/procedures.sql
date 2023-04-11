-- autobid procedure
DROP PROCEDURE IF EXISTS `bm_auction_system.sp_make_autobid`;
DELIMITER $$
CREATE PROCEDURE `bm_auction_system.sp_make_autobid`(IN `cur_auction_id` INT, IN `amount` FLOAT)
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

    CLOSE cur;
END $$
DELIMITER ;

-- entry into sales table, finding winner procedure
DROP PROCEDURE IF EXISTS `bm_auction_system.sp_sale`;
DELIMITER $$
CREATE PROCEDURE `bm_auction_system.sp_sale`(IN `buyer_email_id` varchar, IN `seller_email_id` varchar, IN `cur_product_id` INT, IN `amount` FLOAT)
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

    CLOSE cur;
END $$
DELIMITER ;