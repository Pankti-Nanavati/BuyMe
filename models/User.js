const db = require('../config/db');

const User = {
  selectAll: async () => {
    try {
      const queryString =
        'SELECT user.email_id, user.password, user.name, user.user_name, user.phone_number, user.address FROM bm_auction_system.user;';
      const [rows] = await db.query(queryString);
      return rows;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve users');
    }
  },
  selectOneById: async (id) => {
    const queryString =
      'SELECT user.email_id, user.password, user.name, user.user_name, user.phone_number, user.address FROM bm_auction_system.user WHERE email_id=?;';
    try {
      const [rows] = await db.execute(queryString, [id]);
      return rows && rows.length ? rows[0] : null;
    } catch (err) {
      console.error(err);
      throw new Error('Cannot query user by ID');
    }
  },
  selectOneByUsername: async (username) => {
    const queryString =
      'SELECT user.email_id, user.password, user.name, user.user_name, user.phone_number, user.address FROM bm_auction_system.user WHERE user_name=?;';
    try {
      const [rows] = await db.execute(queryString, [username]);
      return rows;
    } catch (err) {
      console.error(err);
      throw new Error('Cannot query user by username');
    }
  },
  setAlertForProductName: async (product_id, colour, size, email_id) => {
    try {
      const fetchProductName = "SELECT `product`.`product_name`FROM `bm_auction_system`.`product` where product_id = ?;"
      const [productrows] = await db.execute(fetchProductName, [product_id]);
      const productName = productrows[0].product_name;
      const queryString = 'Insert into `bm_auction_system`.`alert` (`product_name`, `colour`, `size`, `email_id`) Values (?,?,?,?);'
      const [result] = await db.execute(queryString, [productName, colour,size, email_id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to set alert');
    }
  },
  fetchAlertForUser: async (email_id) => {
    const queryString = 'Select product_name, colour, size from bm_auction_system.alert where email_id=?;'
    try {
      const [result] = await db.execute(queryString, [email_id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch alerts');
    }
  },
  fetchAuctionForUser: async (email_id) => {
    const queryString = 'Select P.product_name, A.end_time, A.initial_price from bm_auction_system.auction A inner Join bm_auction_system.product P on P.product_id = A.product_id where email_id = ?;'
    try {
      const [result] = await db.execute(queryString, [email_id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch users auctions');
    }
  },
  deleteOne: async (id) => {
    const queryString = 'DELETE FROM users WHERE email_id=?;';
    try {
      const [result] = await db.execute(queryString, [id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to delete user');
    }
  },
  insertOne: async (vals) => {
    const queryString =
      'INSERT INTO `bm_auction_system`.`user`(`email_id`, `password`, `name`, `user_name`, `phone_number`,`address`) VALUES (?,?,?,?,?,?);';
    try {
      const [result] = await db.execute(queryString, vals);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to insert user');
    }
  },
  updateOne: async (vals, id) => {
    vals.push(id);
    const queryString = 'UPDATE users SET user_name=?, password=? WHERE email_id=?;';
    try {
      const [result] = await db.execute(queryString, vals);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to update user');
    }
  },
  raiseQuery: async (email_id, query_type, val) => {
    try {
      const getCustomerReps = 'Select email_id from `bm_auction_system`.`customer_rep`;'
      const [custReps] = await db.execute(getCustomerReps);
      const n = custReps.length;
      const index = Math.floor(Math.random() * n);
      const custRep_email = custReps[index].email_id;
      const queryString = 
    'Insert into `bm_auction_system`.`user_queries` (user_email_id, custRep_email_id, query_type, value) Values (?,?,?,?);'
      const [result] = await db.execute(queryString, [email_id, custRep_email, query_type, val]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to raise query');
    }
  },
  askQuestion: async (email_id, question) => {
    try {
      const getCustomerReps = 'Select email_id from `bm_auction_system`.`customer_rep`;'
      const [custReps] = await db.execute(getCustomerReps);
      const n = custReps.length;
      const index = Math.floor(Math.random() * n);
      const custRep_email = custReps[index].email_id;
      const queryString = 
      'Insert into `bm_auction_system`.`queries_answers` (user_email_id, custRep_email_id, question, q_timestamp) Values (?,?,?, NOW());'
      const [result] = await db.execute(queryString, [email_id, custRep_email, question]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to ask question');
    }
  },
  fetchQuestionsForUser: async (email_id) => {
    try {
      const queryString = 'Select question, q_timestamp, answer, a_timestamp where email_id = ?;'
      const [result] = await db.execute(queryString, [email_id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch questions-answers');
    }
  },
  fetchHistoryBidsForUser: async (email_id) => {
    try {
      const queryString = 
    'Select P.product_name, B.bidding_timestamp, B.amount, B.bid_id from `bm_auction_system`.`bid` B inner Join `bm_auction_system`.`auction` A on A.`auction_id` = B.`auction_id` inner Join `bm_auction_system`.`product` P on A.`product_id` = P.`product_id` where B.email_id = ?;'
      const [result] = await db.execute(queryString, [email_id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch bid history');
    }
  },
  fetchHistoryAuctionsForUser: async (email_id) => {
    try {
      const queryString = 
    'Select P.product_name, P.brand, P.colour, P.size, A.initial_price, A.end_time, A.auction_id from `bm_auction_system`.`auction` A inner Join `bm_auction_system`.`product` P on A.`product_id` = P.`product_id` where A.email_id = ?;'
      const [result] = await db.execute(queryString, [email_id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch auction history');
    }
  },
  fetchNotificationsForUser: async (email_id) => {
    try {
      const queryString = 'Select message from `bm_auction_system`.`notifications` where email_id = ?;'
      const [result] = await db.execute(queryString, [email_id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch notifications');
    }
  },
  fetchSalesForUser: async (email_id) => {
    const queryString = 'Select P.product_name, P.colour, P.size S.amount from bm_auction_system.sales S inner join bm_auction_system.product P on S.product_id = P.product_id where email_id = ? ;'
    try {
      const [result] = await db.execute(queryString, [email_id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch sales');
    }
  }
};

module.exports = User;
