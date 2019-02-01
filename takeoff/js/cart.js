'use strict';

import $ from 'jquery';
import Vue from 'vue';
import {
    eventBus,
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

    new Vue({
        el: '#app-cart',
        data: {
            cart: []
        },
        methods: {
            updateCart() {
                if(localStorage.myCart) {
                    this.cart = JSON.parse(localStorage.myCart);
                }
            }
        },
        created() {
            this.updateCart();
            eventBus.$on('updateCart', () => { this.updateCart(); });
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
