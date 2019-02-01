'use strict';

import $ from 'jquery';
import Vue from 'vue';
import queryString from 'query-string';
import {
    eventBus,
    PageHeader,
    PageFooter,
    Search
} from './components';

$.when(
    getBrands(),
    getCategories(),
    getProducts()
).done(function (brandData, categoryData, productData) {

    const productId = queryString.parse(location.search).id;

    new Vue({
        el: '#app-detail',
        data: {
            product: productData[0].find(product => product.id == productId),
            detail: {
                imageUrl: '',
                alt: ''
            },
            color: '',
        },
        methods: {
            getBrand(id) {
                return brandData[0].find(brand => brand.id == id);
            },
            getCategory(id) {
                return categoryData[0].find(category => category.id == id);
            },
            addToCart() {
                eventBus.$emit('addToCart', this.product);
            },
            setImage() {
                this.detail.imageUrl = this.product.colorways[0].images[0];
                this.detail.alt = this.product.colorways[0].name;
            }
        },
        created() {
            this.setImage();
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
