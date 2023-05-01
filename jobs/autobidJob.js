const cron = require('node-cron');
const db = require('../config/db');

const runAutoBid = async () => {
    try {
        console.log("Calling the place_autoBid function")
        //fetching all active auctions
        const queryString = 'SELECT auction_id FROM bm_auction_system.auction where end_time > NOW();';
        const [rows] = await db.query(queryString);
        for (let a = 0; a < rows.length; a++){
            //fetching the highest bid
            const currentBidQuery=  'select email_id, amount from bm_auction_system.bid where bidding_timestamp IN (select MAX(bidding_timestamp) from bid where auction_id = ?);'
            const [bidRows] = await db.execute(currentBidQuery, [rows[a].auction_id]);
            var currentBid = bidRows[0].amount;
            const currentWinner = bidRows[0].email_id;
            //fetching autobid users
            const checkAutoBid = 'SELECT `email_id`, `increment`, `upper_limit` FROM `bm_auction_system`.`autobid` where auction_id = ?;';
            const [autobids] = await db.execute(checkAutoBid, [rows[a].auction_id]);
            for (let i = 0; i < autobids.length; i++) {
                if(autobids[i].email_id != currentWinner){
                    var new_bid = autobids[i].amount;
                    new_bid = currentBid + autobids[i].increment;
                    if (new_bid <= autobids[i].upper_limit){
                        const query = 'INSERT INTO `bm_auction_system`.`bid` (`email_id`, `auction_id`, `bidding_timestamp`, `amount`) VALUES (?,?, NOW(), ?);';
                        const [newbid] = await db.execute(query, [autobids[i].email_id, rows[a].auction_id, new_bid]);
                        console.log("Autobid made a new bid", newbid);
                        currentBid = new_bid;
                    }
                    else{
                        //implement notification for upper limit here
                        console.log("User's upper limit has reached");
                        message = "The upper limit you have set has been reached, the system can not bid further";
                        const notifQuery = 'Insert into `bm_auction_system`.`notifications` (email_id, message) VALUES (?,?);';
                        const [notifs] = await db.execute(notifQuery, [autobids[i].email_id, message]);
                        console.log(notifs)
                    }
                }
            }
            //fetching manual bidders
            const checkManualBid = 'Select B.email_id from `bm_auction_system`.`autobid` A inner join `bm_auction_system`.`bid` B on A.email_id != B.email_id;';
            const [manualbids] = await db.execute(checkManualBid, [rows[a].auction_id]);
            for(let j = 0; j < manualbids.length; j++){
                const currentUserBidQuery=  'select amount from bm_auction_system.bid where bidding_timestamp IN (select MAX(bidding_timestamp) from bid where email_id = ? and auction_id = ?);'
                const [userBidRows] = await db.execute(currentUserBidQuery, [manualbids[j].email_id, rows[a].auction_id]);
                const currentUserBid = userBidRows[0].amount;
                if (currentUserBid < currentBid){
                    const prevMessageQuery = 'Select message from `bm_auction_system`.`notifications` where email_id = ? and seen =0;';
                    const [prevMessages] = await db.execute(prevMessageQuery, [manualbids[j].email_id]);
                    var message_flag = 1
                    message = "Someone exceeded your bid, the highest bid is now: $";
                    message = message.concat(currentBid);
                    if (prevMessages.length != 0){
                        for(let m=0; m< prevMessages.length; m++){
                            if(message === prevMessages[m].message){
                                message_flag = 0;
                            }
                        }
                    }
                    if(message_flag){
                        const notifQuery = 'Insert into `bm_auction_system`.`notifications` (email_id, message) VALUES (?,?);';
                        const [notifs] = await db.execute(notifQuery, [manualbids[j].email_id, message]);
                        console.log(notifs)
                    }
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
  runAutoBid();      
  console.log('Running the job every 5 minutes');
  // Add your code to be executed every 5 minutes here
});

