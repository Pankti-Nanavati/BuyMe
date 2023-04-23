const CustomerRep = require('../models/CustomerRep');

const customerRepController = {
  loginView: async (req, res) => {
    res.render('../views/static/customerRep.ejs');
  },
  
  homepageView: async(req, res) => {
    res.render('../views/static/customerRepHomepage.ejs');
  },

  logout: async(req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect('/customer');
  },
  
  login: async(req, res) => {
    if (req.user.type === 'customer'){
      return res.redirect('customerRepHomepage');
    } else {
      return res.redirect('login');
    }
  },
  
  queries: async(req, res) => {
    try {
      const email_id = req.body.email_id;
      const offset = req.query.offset;
      const limit = req.query.limit;
      const result = await CustomerRep.fetchQueries(email_id);
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  resolveQueries: async(req, res) => {
    try {

      const queryId = req.body.queryId;
      const queryType = req.body.queryType;
      const email_id = req.body.email_id;

      if (queryType == 'Reset Password'){
        await CustomerRep.changePasswordById(email_id, req.body.value);
      }
      else if (queryType == 'Delete a Bid'){
        await CustomerRep.deleteBidById(email_id);
      } else {
        await CustomerRep.deleteAuctionById(email_id);
      }
      const result = await CustomerRep.resolveQuery(queryId);
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = customerRepController;


