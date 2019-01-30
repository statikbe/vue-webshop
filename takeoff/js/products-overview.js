'use strict';

import $ from 'jquery';
import Vue from 'vue';
import {
    PageHeader,
    PageFooter
} from './components';

$.when(
    getBrands(),
    getCategories(),
    getProducts()
).done(function (brandData, categoryData, productData) {

    const app = new Vue({
        el: '#app',
        data: {
            brands: brandData[0],
            categories: categoryData[0],
            products: productData[0],
            filterCategories: [],
            filterBrands: [],
        },
        computed: {
            filteredProducts() {
                return this.products
                .filter(product => this.filterCategories.length ? this.filterCategories.includes(product.category) : this.products)
                .filter(product => this.filterBrands.length     ? this.filterBrands.includes(product.brand)        : this.products);
            }
        },
        methods: {
            getBrand(id) {
                return brandData[0].find(brand => brand.id == id);
            },
            getCategory(id) {
                return categoryData[0].find(category => category.id == id);
            }
        },
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
