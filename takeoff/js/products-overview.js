'use strict';

import $ from 'jquery';
import Vue from 'vue';

$.when(
    getBrands(),
    getCategories(),
    getProducts()
).done(function (brandData, categoryData, productData) {
    
    new Vue({
        el: '#vue-products-overview',
        data: {
            brands: brandData[0],
            categories: categoryData[0],
            products: productData[0]
        },
        methods: {
            getBrand(id) {
                return this.brands.find(brand => brand.id === id);
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
