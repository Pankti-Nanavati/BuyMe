const CustomerRep = require('../models/CustomerRep');

const customerRepController = {
  loginView: async (req, res) => {
    res.render('../views/static/customerRep.ejs');
  },
  
  logout: async(req, res) => {
    req.session.destroy();
    req.logout();
    res.redirect('/customer');
  },
  
  login: async(req, res) => {
    if (req.user.type === 'customer'){
      return res.redirect('adminHomepage');
    } else {
      return res.redirect('customerRepHomepage');
    }
  },
  
  queries: async(req, res) => {
    try {
      const categoryId = req.params.categoryId;
      const offset = req.query.offset;
      const limit = req.query.limit;
      const result = await CustomerRep.selectAllProductsBySubcategoryId(categoryId, offset, limit);
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  resolveQueries: async(req, res) => {
    try {
      const filter = req.body.filter;
      const offset = req.query.offset;
      const limit = req.query.limit;
      const result = await CustomerRep.filterProductsBySubcategoryId(filter, offset, limit);
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = customerRepController;


