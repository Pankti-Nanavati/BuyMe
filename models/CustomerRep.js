const db = require('../config/db');

const CR = {
  selectAll: async () => {
    try {
      const queryString =
        'SELECT email_id, password, name, user_name, phone_number FROM bm_auction_system.customer_rep;';
      const [rows] = await db.query(queryString);
      return rows;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve users');
    }
  },
  selectOneById: async (id) => {
    const queryString =
      'SELECT email_id, password, name, user_name, phone_number FROM bm_auction_system.customer_rep WHERE email_id=?;';
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
      'SELECT email_id, password, name, username, phone_number, address FROM bm_auction_system.customer_rep WHERE user_name=?;';
    try {
      const [rows] = await db.execute(queryString, [username]);
      return rows;
    } catch (err) {
      console.error(err);
      throw new Error('Cannot query customer representative by username');
    }
  },
  fetchQueries: async (customerRep_email) => {
    const queryString = 
    'SELECT user_email_id, query_type, value, query_id FROM bm_auction_system.user_queries where custRep_email_id = ? and resolved_flag = 0;'
    try {
      const [rows] = await db.execute(queryString, [customerRep_email]);
      return rows;
  } catch (err) {
      console.error(err);
      throw new Error('Unable to fetch queries for particular customer representative');
  }
  },
  fetchQuestions: async (email_id) => {
    try {
      const queryString = 'Select query_id, user_email_id, question, q_timestamp from `bm_auction_system`.`queries_answers` where custRep_email_id = ? and answer is null;'
      const [result] = await db.execute(queryString, [email_id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch questions-answers');
    }
  },
  deleteBidById: async (Id) => {
    const queryString = 'Delete from bm_auction_system.bid where bid_id = ?;';
    try {
        const [rows] = await db.execute(queryString, [Id]);
        return rows;
    } catch (err) {
        console.error(err);
        throw new Error('Unable to delete customer representative by bid_id');
    }
  },
  deleteAuctionById: async (Id) => {
    const queryString = 'Delete from bm_auction_system.auction where auction_id = ?;';
    try {
        const [rows] = await db.execute(queryString, [Id]);
        return rows;
    } catch (err) {
        console.error(err);
        throw new Error('Unable to delete auction by auction_id');
    }
  },
  changePasswordById: async (email, new_password) => {
    const queryString = 'Update bm_auction_system.user Set password = ? where email_id = ?;';
    try {
        const [rows] = await db.execute(queryString, [new_password, email]);
        return rows;
    } catch (err) {
        console.error(err);
        throw new Error('Unable to change user password');
    }
  },
  resolveQuery: async (query_id) => {
    const queryString = 'Update bm_auction_system.user_queries Set resolved_flag = 1 where query_id = ?;';
    try {
        const [rows] = await db.execute(queryString, [query_id]);
        return rows;
    } catch (err) {
        console.error(err);
        throw new Error('Unable to resolve query');
    }
  },
  answerQuestion: async (query_id, answer) => {
    const queryString = 'Update bm_auction_system.queries_answers Set answer = ?, a_timestamp = NOW() where query_id = ?;';
    try {
        const [rows] = await db.execute(queryString, [query_id]);
        return rows;
    } catch (err) {
        console.error(err);
        throw new Error('Unable to answer question');
    }
  }
};

module.exports = CR;
