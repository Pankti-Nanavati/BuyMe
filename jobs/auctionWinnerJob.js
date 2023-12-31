const cron = require('node-cron');
const db = require('../config/db');

const runAuctionWinnerJob = async () => {
    try {
        console.log("calling function assignAuctionWinner");
        //fetching auctions that have ended and their winners have not been assigned
        const endedAuctionsQuery = 'Select A.auction_id, A.minimum_price, A.email_id, A.product_id, P.product_name from `bm_auction_system`.`auction` A inner join `bm_auction_system`.`product` P on A.product_id = P.product_id where A.end_time < NOW() and A.has_winner = 0;';
        const [endedAuctions] = await db.execute(endedAuctionsQuery);
        console.log('Ended auctions', endedAuctions);
        if(endedAuctions.length != 0){
            for(let i = 0; i < endedAuctions.length; i++){
                const highestBidQuery = 'Select amount, email_id, bidding_timestamp from `bm_auction_system`.`bid` where auction_id = ? order by amount DESC limit 1;';
                const [highestBid] = await db.execute(highestBidQuery, [endedAuctions[i].auction_id]);
                console.log('highestbid', highestBid);
                console.log(highestBid.length > 0 && endedAuctions[i].minimum_price <= highestBid[0].amount);
                if(highestBid.length != 0){
                    console.log('inside if');
                    if (highestBid.length > 0 && endedAuctions[i].minimum_price <= highestBid[0].amount){
                        console.log('inside second if');
                        const salesEntry = 'Insert into `bm_auction_system`.`sales` (buyer_email_id, seller_email_id, auction_id, product_id, amount, sale_timestamp) VALUES (?,?,?,?,?,?);';
                        const [salesEntryRes] = await db.execute(salesEntry, [highestBid[0].email_id, endedAuctions[i].email_id, endedAuctions[i].auction_id, endedAuctions[i].product_id, highestBid[0].amount, highestBid[0].bidding_timestamp]);
                        console.log('sales entry', salesEntryRes);
                        var message = "";
                        message = message.concat("Congratulations! You won the auction, the product ", endedAuctions[i].product_name, "is for you to buy!");
                        const prevMessageQuery = 'Select message from `bm_auction_system`.`notifications` where email_id = ? and seen = 0;';
                        const [prevMessages] = await db.execute(prevMessageQuery, [highestBid[0].email_id]);
                        var message_flag = 1
                        if (prevMessages.length != 0){
                            for(let m = 0; m < prevMessages.length; m++){
                                if(message === prevMessages[m].message){
                                    message_flag = 0;
                                }
                            }
                        }
                        if(message_flag){
                            const notifQuery = 'Insert into `bm_auction_system`.`notifications` (email_id, message) VALUES (?,?);';
                            const [notifs] = await db.execute(notifQuery, [highestBid[0].email_id, message]);
                            console.log('notifs', notifs);
                        }
                    }
                    const updateAuction = 'Update `bm_auction_system`.`auction` set has_winner = 1 where auction_id = ?;';
                    const [updateAuctionRes] = await db.execute(updateAuction, [endedAuctions[i].auction_id]);
                    console.log('auction update query', updateAuctionRes);
                }  
            } 
        }   
    }
    catch(err){
        console.log(err);
    }    
};


cron.schedule('*/5 * * * *', () => {
    // call job
    runAuctionWinnerJob();      
    console.log('Running the job every 5 minutes');
    // Add your code to be executed every 5 minutes here
});

