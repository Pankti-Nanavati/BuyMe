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
    res.redirect('login');
  },
  
  login: async(req, res) => {
    if (req.session.passport.user.type === 'customer'){
      return res.redirect('homepage');
    } else {
      return res.redirect('login');
    }
  },
  
  queries: async(req, res) => {
    try {
      const email_id = req.session.passport.user.id;
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
      const value = req.body.value;
      if (queryType == 'Reset Password'){
        await CustomerRep.changePasswordById(email_id, value);
      }
      else if (queryType == 'Delete a Bid'){
        await CustomerRep.deleteBidById(value);
      } else {
        await CustomerRep.deleteAuctionById(value);
      }
      const result = await CustomerRep.resolveQuery(queryId);
      return res.json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  fetchQuestions: async(req, res) => {
    try{
      console.log(req.session);
      const email_id = req.session.passport.user.id;
      
      console.log(email_id);
      const result = await CustomerRep.fetchQuestions(email_id);
      return res.json(result);
    }
    catch(err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  
  
  answerQuestion: async(req, res) => {
    try{
      const query_id = res.body.queryId;
      const answer = res.body.answer;
      const result = await CustomerRep.answerQuestion(query_id, answer);
      return res.json(result);
    }
    catch(err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
  
};

module.exports = customerRepController;


