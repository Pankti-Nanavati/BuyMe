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
      console.log('SelectOneById', rows);
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
};

module.exports = User;
