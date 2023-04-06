const db = require('../config/db');

const Product = {
    selectAllcategories: cb => {
      const queryString =
      'SELECT * FROM bm_auction_system.category;'
      db.query(queryString, (err, results) => {
        if (err) throw err
        cb(results)
      })
    },
    selectAllSubcategoriesByCategoryId: (id, cb) => {
      const queryString =
      'SELECT * from bm_auction_system.subcategory WHERE category_id=?;'
      db.execute(queryString, [id], (err, results) => {
        if (err) throw err
        cb(results)
      })
    },
    selectAllProductsBySubcategoryId: (id, cb) => {
        const queryString =
        'SELECT product_id, product_name, brand, colour, size, price from bm_auction_system.product WHERE subcategory_id=?;'
        db.execute(queryString, [id], (err, results) => {
          if (err) throw err
          cb(results)
        })
    },
    filterProductsBySubcategoryId: (filters, cb) => {
        const filter = "WHERE "
        for (let key in filters) {
            if (filters[key].length != 0) {
                if (filter == 'WHERE ') {
                    filter = filter.concat(" ", key, "= ", filters[key]);
                }
                else {
                    filter = filter.concat("AND ", key, "= ", filters[key]);
                }
            }
        }
        const queryString =
        'SELECT product_id, product_name, brand, colour, size, price from bm_auction_system.product ?'
        db.execute(queryString, [filter], (err, results) => {
        if (err) throw err
        cb(results)
        })
    },
    selectProductByProductID: (product_id, cb) => {
      const queryString =
        'SELECT product_id, product_name, brand, colour, size, price FROM bm_auction_system.product WHERE product_id=?;'
      db.execute(queryString, [product_id], (err, results) => {
        if (err) throw err
        cb(results)
      })
    },
    deleteOne: (id, cb) => {
      const queryString = 'DELETE FROM product WHERE product_id=?;'
      db.execute(queryString, [id], (err, result) => {
        if (err) throw err
        cb(result)
      })
    },
    insertOne: (vals, cb) => {
      const queryString =
        'INSERT INTO `bm_auction_system`.`product`(`product_id`, `product_name`, `brand`, `colour`, `size`, `price`, `subcategory_id`) VALUES (?,?,?,?,?,?,?);'
      db.execute(queryString, vals, (err, result) => {
        console.log('result', result);
        if (err) throw err
        cb(result)
      })
    }
  }

module.exports = Product
