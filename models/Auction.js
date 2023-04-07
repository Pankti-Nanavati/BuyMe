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
  getAllAuctionsByUserId: async (Id) => {
    try {
      const queryString = 'SELECT * from bm_auction_system.auction WHERE email_id=?;';
      const [rows] = await db.execute(queryString, [Id]);
      return rows;
    } catch (err) {
      throw err;
    }
  },
  getAllBidsByUserId: async (Id) => {
    try {
      const queryString = 'SELECT * from bm_auction_system.bid WHERE email_id=?;';
      const [rows] = await db.execute(queryString, [Id]);
      return rows;
    } catch (err) {
      throw err;
    }
  },
  createAuction: async (product_name, brand, colour, size, price, subcategoryId, end_time, increment_amount, minimum_price, initial_price) => {
    try {
      const queryString1 = 'INSERT INTO bm_auction_system.product (product_name, brand, colour, size, price, subcategory_id) VALUES (?,?,?,?,?,?);';
      const [result1] = await db.execute(queryString1, [product_name, brand, colour, size, price, subcategoryId]);
      productId= result1.insertId;
      const queryString2 = 'INSERT INTO bm_auction_system.auction (email_id, product_id, end_time, start_time, increment_amount, minimum_price, initial_price) VALUES (?,?,?, CURRENT_TIMESTAMP,?,?,?);';
      const [result2] = await db.execute(queryString2, [Id, productId, end_time, increment_amount, minimum_price, initial_price]);
      return result2.insertId;
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
      return { currentBid: amount, endTime };
    } catch (err) {
      throw err;
    }
  },
};

module.exports = Auction;
