'use strict';

import $ from 'jquery';
import Vue from 'vue';
import {
    PageHeader,
    PageFooter,
    Search,
    removeButton
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
            filter: { categories: [], brands: []},
        },
        computed: {
            filteredProducts() {
                const categories = this.filter.categories;
                const brands = this.filter.brands;
                return this.products.filter(product => (categories.includes(product.category) || categories.length === 0) && (brands.includes(product.brand) || brands.length === 0) );
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
