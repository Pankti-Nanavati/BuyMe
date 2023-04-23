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
  getSalesReport: async (date1, date2) => {
    const queryString1 = 'Select SUM(amount) from sales WHERE sale_timestamp <= ? and sale_timestamp >= ?;';
    const queryString2 = 'Select TOP 5 p.product_name, SUM(s.amount) as product_earnings from sales s join product p on product_id WHERE s.sale_timestamp <= ? and s.sale_timestamp >= ? group by p.product_name Sort by product_earnings DESC;';
    const queryString3 = 'Select TOP 5 buyer_email_id, SUM(amount) as user_earnings from sales WHERE sale_timestamp <= ? and sale_timestamp >= ? group by p.buyer_email_id Sort by user_earnings DESC;';
    try{
      const [result1] = await db.execute(queryString1, [date2, date1]);
      const [result2] = await db.execute(queryString2, [date2, date1]);
      const [result3] = await db.execute(queryString3, [date2, date1]);
      const result = {}
      result['total_earnings'] = result1;
      result['Top_products'] = result2;
      result['Top_buyers'] = result3;
      return result
    } catch (err) {
      console.error(err);
      throw new Error('Failed to fetch sales belonging to the given range');
    }
  }
};

module.exports = Admin;
