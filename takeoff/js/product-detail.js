'use strict';

import $ from 'jquery';
import Vue from 'vue';
import queryString from 'query-string';

$.when(
    getBrands(),
    getCategories(),
    getProducts()
).done(function (brandData, categoryData, productData) {

    const productId = queryString.parse(location.search).id;
    
    console.log(productId);
    
    new Vue({
        el: '#vue-product-detail',
        data: {
            product: productData[0].find(product => product.id == productId)
        },
        methods: {
            getBrand(id) {
                return brandData[0].find(brand => brand.id == id);
            },
            getCategory(id) {
                return categoryData[0].find(category => category.id == id);
            }
        }
    });
});

function getBrands() {
    return $.get('/data/brands.json');
}

function getCategories() {
    return $.get('/data/categories.json');
}

function getProducts() {
    return $.get('/data/products.json');
}
