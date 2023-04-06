const Product = require('../models/Product');

const search = {
    categories: async() => {
        Product.selectAllcategories((result) => {
            return result;
        });
    },

    subCategories: async(id) => {
        Product.selectAllSubcategoriesByCategoryId(id, (result) => {
            return result;
        })
    },

    productsByCategoryId: async(id, offset, limit) => {
        Product.selectAllProductsBySubcategoryId(id, (result) => {
            return result;
        })
    },

    productsByFilter: async(filter, offset, limit) => {
        Product.filterProductsBySubcategoryId(filter, (result) => {
            return result;
        })
        
    },

    products: async(offset, limit) => {
        
    },

    productById: async(id) => {
        Product.productById(id, (result) => {
            return result;
        });
    },
};


module.exports = search;
