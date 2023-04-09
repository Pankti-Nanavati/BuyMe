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