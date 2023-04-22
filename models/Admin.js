const db = require('../config/db');

const Admin = {
  selectAll: async () => {
    try {
      const queryString =
        'SELECT email_id, password FROM bm_auction_system.admin;';
      const [rows] = await db.query(queryString);
      return rows;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve admins');
    }
  },
  selectOneById: async (id) => {
    const queryString =
      'SELECT password FROM bm_auction_system.admin WHERE email_id=?;';
    try {
      const [rows] = await db.execute(queryString, [id]);
      console.log('SelectOneById', rows);
      return rows && rows.length ? rows[0] : null;
    } catch (err) {
      console.error(err);
      throw new Error('Cannot query admin by ID');
    }
  },
  insertOneCR: async (vals) => {
    const queryString =
      'INSERT INTO `bm_auction_system`.`customer_rep`(`email_id`, `password`, `name`, `user_name`, `phone_number`) VALUES (?,?,?,?,?);';
    try {
      const [result] = await db.execute(queryString, vals);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to insert customer representative');
    }
  },
  deleteOneCR: async (id) => {
    const queryString = 'DELETE FROM customer_rep WHERE email_id=?;';
    try {
      const [result] = await db.execute(queryString, [id]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to delete user');
    }
  },
  updateOneCR: async (vals, id) => {
    vals.push(id);
    const queryString = 'UPDATE customer_rep SET user_name=?, password=? WHERE email_id=?;';
    try {
      const [result] = await db.execute(queryString, vals);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to update customer_rep');
    }
  },
  `sale_id` int(100) NOT NULL AUTO_INCREMENT,
  `buyer_email_id` varchar(45) NOT NULL,
  `seller_email_id` varchar(45) NOT NULL,
  `auction_id` int(5) NOT NULL,
  `product_id` int(2) NOT NULL,
  `amount` float(10),
  `sale_timestamp` TIMESTAMP,
  
  getSalesReport: async (date1, date2) => {
    const queryString = 'Select * from sales WHERE sale_timestamp <= ? and sale_timestamp >= ?;';
    try{
      const [result] = await db.execute(queryString, [date2, date1]);
      return result;
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch sales belonging to the given range');
    }
  }
};

module.exports = Admin;
