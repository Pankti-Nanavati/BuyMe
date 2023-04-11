DROP TRIGGER IF EXISTS bm_auction_system.autobid_trigger;
delimiter //
create trigger bm_auction_system.autobid_trigger 
after UPDATE on 
bm_auction_system.bid
for each row BEGIN
    DECLARE cur_auction_id INT;
    DECLARE cur_amount FLOAT;
    DECLARE curBuying_email_id varchar;
    DECLARE curSeller_email_id varchar;
    DECLARE cur_product_id INT;

    SET cur_auction_id = NEW.auction_id;
    SET cur_amount = NEW.amount;
    SET curBuying_email_id = NEW.email_id;

    select email_id, product_id INTO seller_email_id,cur_product_id from bm_auction_system.auction where auction_id=NEW.auction_id;
    -- Call stored procedure to make a bid
    call bm_auction_system.sp_make_autobid(cur_auction_id, cur_amount);
    call bm_auction_system.sp_sale(curBuying_email_id, curSeller_email_id, cur_product_id, cur_auction_id, cur_amount);
END;
//