'use strict';

import $ from 'jquery';
import Vue from 'vue';

$.when(
    getBrands(),
    getCategories(),
    getProducts()
).done(function (brandData, categoryData, productData) {

    Vue.component('overview', {
        props: ['filtered-products', 'brands'],
        template: `
           <div class="grid grid--3-col@med">
               <div class="grid__item" v-for="product in filteredProducts" @click="setComponent(product)">
                   <div>
                       <h3>{{ getBrand(product.brand).name }} {{ product.name }}</h3>
                       <img :src="product.colorways[0].images[0]" alt="">
                   </div>
               </div>
           </div>
        `,
        methods: {
            getBrand(id) {
                return this.brands.find(brand => brand.id === id);
            },
            setComponent(product) {
                app.$emit('setComponent', {name: 'detail', product});
            }
        }
    });

    Vue.component('detail', {
        props: ['product-detail'],
        template: `
        <div>
            <button @click="setOverview">Back to overview</button>
            <h1>{{ productDetail.name }}</h1>
            <p>This hoodie is awesome, trust me.</p>
            <img :src="productDetail.colorways[0].images[0]" alt="">
        </div>
        `,
        methods: {
            setOverview() {
                app.$emit('setOverview');
            }
        }
    });

    const app = new Vue({
        el: '#vue-products-overview',
        data: {
            brands: brandData[0],
            categories: categoryData[0],
            products: productData[0],
            checkedFilters: [],
            checkedCategories: [],
            checkedBrands: [],
            noResults: false,
            currentView: "overview",
            productDetail: {},
        },
        computed: {
            // Using single array for all filters -> needs more specific values! e.g. not 'brand: 1', but 'brand: "adidas"'
            //
            // filteredProducts: function(){
            //     if(!this.checkedFilters.length) {
            //         return this.products.filter( product =>  {
            //             return this.checkedFilters.every( checkedFilter => {
            //                 if( product.category === checkedFilter ) {
            //                     return product.category === checkedFilter;
            //                 }
            //                 if( product.brand === checkedFilter ) {
            //                     return product.brand === checkedFilter;
            //                 }
            //             });
            //         }
            //     )} else {
            //         return this.products;
            //     }
            // }

            // Using multiple arrays: one for categories, one for brand, etc.

            filteredProducts() {
                return this.products
                .filter( product => this.checkedCategories.length ? this.checkedCategories.includes(product.category) : this.products )
                .filter( product => this.checkedBrands.length     ? this.checkedBrands.includes(product.brand)        : this.products );
            }
        },
        watch: {
            filteredProducts() {}
        },
        created() {
            this.$on('setComponent', component => {
                this.currentView = component.name;
                history.pushState( {page: component.product.name}, '', '/'+component.product.name.replace(/ /gi, "-").toLowerCase() );
                this.productDetail = component.product;
            });
            this.$on('setOverview', () => {
                history.pushState( {page: 'overview'}, '', '/overview' );
                this.currentView = 'overview';
            });
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
