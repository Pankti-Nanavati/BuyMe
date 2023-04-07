const db = require('../config/db');

const Auction = {
  getActiveAuctions: async () => {
    try {
      const queryString = 'SELECT * FROM bm_auction_system.auction WHERE end_time > NOW();';
      const [rows] = await db.query(queryString);
      return rows;
    } catch (err) {
      throw err;
    }
  },
  getAllAuctionsByUserId: async (userId) => {
    try {
      const queryString = 'SELECT * from bm_auction_system.auction WHERE seller_id=? OR winner_id=?;';
      const [rows] = await db.execute(queryString, [userId, userId]);
      return rows;
    } catch (err) {
      throw err;
    }
  },
  getAllBidsByUserId: async (userId) => {
    try {
      const queryString = 'SELECT * from bm_auction_system.bid WHERE bidder_id=?;';
      const [rows] = await db.execute(queryString, [userId]);
      return rows;
    } catch (err) {
      throw err;
    }
  },
  createAuction: async (productId, sellerId, startingBid) => {
    try {
      const queryString = 'INSERT INTO `bm_auction_system`.`auction`(`product_id`, `seller_id`, `starting_bid`, `current_bid`, `end_time`, `winner_id`) VALUES (?, ?, ?, ?, NOW() + INTERVAL 1 WEEK, NULL);';
      const [result] = await db.execute(queryString, [productId, sellerId, startingBid, startingBid]);
      return result.insertId;
    } catch (err) {
      throw err;
    }
  },
  placeBid: async (productId, bidderId, amount) => {
    try {
      const auctionQueryString = 'SELECT current_bid, end_time FROM bm_auction_system.auction WHERE product_id=? AND end_time > NOW()';
      const [auctionRows] = await db.execute(auctionQueryString, [productId]);

      if (auctionRows.length === 0) {
        throw new Error('Auction not found or has ended');
      }

      const currentBid = auctionRows[0].current_bid;
      const endTime = auctionRows[0].end_time;

      if (amount <= currentBid) {
        throw new Error('Bid amount must be greater than current bid');
      }

      const queryString = 'INSERT INTO `bm_auction_system`.`bid`(`product_id`, `bidder_id`, `amount`) VALUES (?, ?, ?);';
      const [result] = await db.execute(queryString, [productId, bidderId, amount]);

      if (result.affectedRows === 0) {
        throw new Error('Failed to place bid');
      }

      const updateQueryString = 'UPDATE bm_auction_system.auction SET current_bid=?, winner_id=? WHERE product_id=? AND end_time > NOW();';
      const [updateResult] = await db.execute(updateQueryString, [amount, bidderId, productId]);

      if (updateResult.affectedRows === 0) {
        throw new Error('Failed to update auction');
      }

      return { currentBid: amount, endTime };
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Auction;
