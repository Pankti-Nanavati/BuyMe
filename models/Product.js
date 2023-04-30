  const db = require('../config/db');

  const Product = {
      selectAllcategories: async () => {
          try {
              const queryString = 'SELECT * FROM bm_auction_system.category;';
              const [rows] = await db.query(queryString);
              return rows;
          } catch (err) {
              throw err;
          }
      },
      selectAllSubcategoriesByCategoryId: async (id) => {
          try {
              const queryString = 'SELECT * from bm_auction_system.subcategory WHERE category_id=?;';
              const [rows] = await db.execute(queryString, [id]);
              return rows;
          } catch (err) {
              throw err;
          }
      },
      selectAllProductsBySubcategoryId: async (id) => {
          try {
              const queryString = 'SELECT product_id, product_name, brand, colour, size, price from bm_auction_system.product WHERE subcategory_id=?;';
              const [rows] = await db.execute(queryString, [id]);
              return rows;
          } catch (err) {
              throw err;
          }
      },
      filterProductsBySubcategoryId: async (filters, id) => {
          try {
              let filter = 'WHERE ';
              for (let key in filters) {
                  if (filters[key].length != 0) {
                      if (filter == 'WHERE ') {
                        if (key = "max_price"){
                            filter = filter.concat("price < ", filters[key]);
                        }
                        else if (key = "min_price"){
                            filter = filter.concat("price > ", filters[key]);
                        }
                        else{
                            filter = filter.concat(key, " = '", filters[key], "'");
                        }
                      } else {
                        if (key = "max_price"){
                            filter = filter.concat(" AND price < ", filters[key]);
                        }
                        else if (key = "min_price"){
                            filter = filter.concat(" AND price > ", filters[key]);
                        }
                        else{
                            filter = filter.concat(" AND ", key, " = '", filters[key], "'");
                        }
                      }
                  }
              }
              filter = filter.concat(" AND subcategory_id = ", id, ";")
              const initial_queryString = `SELECT product_id, product_name, brand, colour, size, price from bm_auction_system.product `;
              const queryString = initial_queryString.concat(filter);
              const [rows] = await db.execute(queryString);
              return rows;
          } catch (err) {
              throw err;
          }
      },
      selectProductByProductID: async (product_id) => {
        try {
          const currentBidQuery=  'select amount from bm_auction_system.bid B inner join bm_auction_system.auction A on A.auction_id = B.auction_id inner join bm_auction_system.product P on P.product_id = A.product_id  where P.product_id = ? ORDER BY B.bidding_timestamp DESC limit 1;';
          const [bidRows] = await db.execute(currentBidQuery, [product_id]);
          const currentBid = (bidRows.length == 0 ? 0 : bidRows[0].amount);
            const queryString = 'SELECT P.product_id, P.product_name, P.brand, P.colour, P.size, P.price, A.auction_id, if(A.end_time < NOW(), 0, 1) as active_flag FROM bm_auction_system.product P inner join bm_auction_system.auction A on A.product_id = P.product_id WHERE P.product_id=?;';
            const [rows] = await db.execute(queryString, [product_id]);
            return {"result": rows[0] ,"currentBid": currentBid};
        } catch (err) {
            throw err;
        }
    },
      deleteOne: async (id) => {
          try {
              const queryString = 'DELETE FROM product WHERE product_id=?;';
              const [result] = await db.execute(queryString, [id]);
              return result;
          } catch (err) {
              throw err;
          }
      },
      insertOne: async (vals) => {
          try {
              const queryString = 'INSERT INTO `bm_auction_system`.`product`(`product_id`, `product_name`, `brand`, `colour`, `size`, `price`, `subcategory_id`) VALUES (?,?,?,?,?,?,?);';
              const [result] = await db.execute(queryString, vals);
              return result;
          } catch (err) {
              throw err;
          }
      }
  };

  module.exports = Product;
