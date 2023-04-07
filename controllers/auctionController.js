const Auction = require('../models/Auction');

const auctionController = {
  bidHistory: async (req, res) => {
    try {
      const userId = req.query.userId;
      const result = await Auction.getAllBidsByUserId(userId);
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  auctionHistory: async (req, res) => {
    try {
      const userId = req.query.userId;
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
      const { productId, sellerId, startingBid } = req.body;
      const result = await Auction.createAuction(productId, sellerId, startingBid);
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
