const Product = require('../models/Product');

const searchController = {

    productView: async(req, res) => {

        const product = await Product.selectProductByProductID(req.query.productId);
        const data = {
          product: product,
          user_name: req.session.passport.user.user_name,
        };
        return res.render("../views/static/product", data);
    },

    categories: async (req, res) => {
        try {
          const result = await Product.selectAllcategories();
          return res.json(result);
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
    },

    subCategories: async(req, res) => {
        try {
          const categoryId = req.params.categoryId;
          const result = await Product.selectAllSubcategoriesByCategoryId(categoryId);
          return res.json(result);
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
      },
      
      productsByCategoryId: async(req, res) => {
        try {
          const categoryId = req.params.categoryId;
          const offset = req.query.offset;
          const limit = req.query.limit;
          const result = await Product.selectAllProductsBySubcategoryId(categoryId, offset, limit);
          return res.json(result);
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
      },
      
      productsByFilter: async(req, res) => {
        try {
          const filter = req.body.filter;
          const offset = req.query.offset;
          const limit = req.query.limit;
          const result = await Product.filterProductsBySubcategoryId(filter, offset, limit);
          return res.json(result);
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
      },
      
      products: async(req, res) => {
        try {
          const offset = req.query.offset;
          const limit = req.query.limit;
          const result = await Product.selectAllProducts(offset, limit);
          return res.json(result);
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
      },
      
      productById: async(req, res) => {
        try {
          const productId = req.params.productId;
          const result = await Product.selectProductByProductID(productId);

          return res.json(result);
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Internal server error' });
        }
      },
};

module.exports = searchController;
