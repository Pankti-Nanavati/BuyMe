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
    filterProductsBySubcategoryId: async (filters) => {
        try {
            let filter = 'WHERE ';
            const values = [];
            for (let key in filters) {
                if (filters[key].length != 0) {
                    if (filter === 'WHERE ') {
                        filter = filter.concat(` ${key} = ?`);
                    } else {
                        filter = filter.concat(` AND ${key} = ?`);
                    }
                    values.push(filters[key]);
                }
            }
            const queryString = `SELECT product_id, product_name, brand, colour, size, price from bm_auction_system.product ${filter}`;
            const [rows] = await db.execute(queryString, values);
            return rows;
        } catch (err) {
            throw err;
        }
    },
    selectProductByProductID: async (product_id) => {
        try {
            const queryString = 'SELECT product_id, product_name, brand, colour, size, price FROM bm_auction_system.product WHERE product_id=?;';
            const [rows] = await db.execute(queryString, [product_id]);
            return rows[0];
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
