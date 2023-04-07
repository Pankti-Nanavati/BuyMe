const db = require('../config/db');

const UserPassport = {
  getUserByUsernameWithPassword: async (username, done) => {
    try {
      const queryString = 'SELECT user.email_id, user.password, user.name, user.user_name, user.phone_number, user.address FROM bm_auction_system.user WHERE user_name=?;';
      const [rows] = await db.execute(queryString, [username]);
      console.log('Inside model', rows);

      return done(null, rows[0]);
    } catch (error) {
      return done(error, null);
    }
  },

  getUserById: async (id, done) => {
    try {
      const queryString = 'SELECT user.email_id, user.password, user.name, user.user_name, user.phone_number, user.address FROM bm_auction_system.user WHERE email_id=?;';
      const [rows] = await db.execute(queryString, [id]);
      console.log('Inside model', rows);

      return done(null, rows[0]);
    } catch (error) {
      return done(error, null);
    }
  },
};

module.exports = UserPassport;
