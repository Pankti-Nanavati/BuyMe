const Auction = require('../models/Auction');

const auctionController = {

  sell: async(req, res) => {
    const data = {user_name: req.session.passport.user.user_name}
    return res.render('../views/static/sell', data);
  },

  bidHistory: async (req, res) => {
    try {
      const userId = req.session.passport.user.id;
      const result = await Auction.getAllBidsByUserId(userId);
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  auctionHistory: async (req, res) => {
    try {
      const userId = req.session.passport.user.id;
      const result = await Auction.getAllAuctionsByUserId(userId);
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  auctions: async (req, res) => {
    try {
      const result = await Auction.getActiveAuctions();
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  createAuction: async (req, res) => {
    try {
      const email_id = req.session.passport.user.id;
      const {product_name, brand, colour, size, price, subcategoryId, end_time, increment_amount, minimum_price, initial_price } = req.body;
      const result = await Auction.createAuction(email_id, product_name, brand, colour, size, price, subcategoryId, end_time, increment_amount, minimum_price, initial_price);
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  placeBid: async (req, res) => {
    try {
      const productId = req.params.productId;
      const { bidderId, amount } = req.body;
      const result = await Auction.placeBid(productId, bidderId, amount);
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = auctionController;
