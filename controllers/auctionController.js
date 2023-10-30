const Auction = require('../models/Auction');


const auctionController = {

  sell: async(req, res) => {

    const data = {user_name: req.session.passport.user.user_name}
    return res.render('../views/static/sell', data);
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
      const {product_name, brand, colour, size, price, description, subcategoryId, end_time, increment_amount, minimum_price, initial_price } = req.body;
      const path = req.file.filename;
      const result = await Auction.createAuction(email_id, product_name, brand, colour, size, price, description, path, subcategoryId, end_time, increment_amount, minimum_price, initial_price);
      return res.redirect('homepage');
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  placeAutoBid: async(req, res) => {
    try {
      const email_id = req.session.passport.user.id;
      const { auction_id, increment_amount, upper_limit } = req.body;
      const result = await Auction.createAutobid(email_id, auction_id, increment_amount, upper_limit);
      return res.json(result);
    } catch (err) {
      
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  placeBid: async (req, res) => {
    try {
      const email_id = req.session.passport.user.id;
      const { product_id, auction_id, amount } = req.body;
      const result = await Auction.placeBid(product_id, auction_id, email_id, amount);
      return res.json(result);
    } catch (err) {
      if (err.message == 'Bid amount must be greater than current bid') {
        return res.status(400).json(err.message);
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = auctionController;
