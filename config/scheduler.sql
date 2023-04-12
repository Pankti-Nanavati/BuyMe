CREATE EVENT check_auction_end
ON SCHEDULE
    EVERY 5 MINUTE
DO
    call bm_auction_system.sp_salesEntry();