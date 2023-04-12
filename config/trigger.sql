DROP TRIGGER IF EXISTS bm_auction_system.autobid_trigger;
delimiter //
create trigger bm_auction_system.autobid_trigger 
after UPDATE on 
bm_auction_system.bid
for each row BEGIN
    DECLARE cur_auction_id INT;
    DECLARE cur_amount FLOAT;

    SET cur_auction_id = NEW.auction_id;
    SET cur_amount = NEW.amount;
    -- Call stored procedure to make a bid
    call bm_auction_system.sp_make_autobid(cur_auction_id, cur_amount);
END;
//

DROP TRIGGER IF EXISTS bm_auction_system.product_trigger;
delimiter //
create trigger bm_auction_system.product_trigger 
after INSERT on 
bm_auction_system.product
for each row BEGIN
    DECLARE cur_size varchar(25);
    DECLARE cur_colour varchar(25);
    DECLARE cur_product_name varchar(50);

    SET cur_product_name = NEW.product_name;
    SET cur_size = NEW.size;
    SET cur_colour = NEW.colour;
    -- Call stored procedure to make a bid
    call bm_auction_system.sp_notification(cur_product_name, cur_colour,cur_size);
END;
//