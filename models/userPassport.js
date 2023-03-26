const db = require('../config/db')

console.log('dbc', db.query);
const UserPassport = {
  getUserByUsernameWithPassword: (username, done) => {
    const queryString =
    'SELECT user.email_id, user.password, user.name, user.user_name, user.phone_number, user.address FROM bm_auction_system.user WHERE user_name=?;'
    db.execute(queryString, [username], (err, user) => {
    console.log('Inside model', user);  
      if (err) {
        return done(err, user)
      }

      return done(null, user[0])
    })
  },
  getUserById: (id, done) => {
    const queryString =
    'SELECT user.email_id, user.password, user.name, user.user_name, user.phone_number, user.address FROM bm_auction_system.user WHERE email_id=?;'
    db.execute(queryString, [id], (err, user) => {
    console.log('Inside model', user);  
      if (err) {
        return done(err, user)
      }
      return done(null, user[0])
    })
  }
}

module.exports = UserPassport