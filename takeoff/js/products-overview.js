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
               <div class="grid__item product" v-for="product in filteredProducts" @click="setComponent(product)">
                   <div>
                       <h3>{{ getBrand(product.brand).name }} {{ product.name }}</h3>
                       <img :src="product.colorways[0].images[0]" alt="">
                       <addToCart></addToCart>
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

    Vue.component('toOverview', {
        template: `
            <button @click="setOverview">Back to overview</button>
        `,
        methods: {
            setOverview() {
                app.$emit('setOverview')
            }
        }
    })

    Vue.component('detail', {
        props: ['product-detail'],
        template: `
        <div>
            <h1>{{ productDetail.name }} - €{{ productDetail.price }}</h1>
            <toOverview></toOverview>
            <addToCart></addToCart>
            <p>This hoodie is awesome, trust me.</p>
            <h3>Colors:</h3>
            <ul>
                <li v-for="(color, index) in productDetail.colorways" @click="viewColor(color.name)">
                    {{ color.name }}
                </li>
            </ul>
            <div class="gallery">
                <div class="large">
                    <img :src="productDetail.colorways[0].images[0]" alt="">
                </div>
                <div class="thumbnails">
                    <div class="thumbnails__item" v-for="image in colorImages"></div>
                </div>
            </div>
            <addToCart></addToCart>
        </div>
        `,
        methods: {
            setOverview() {
                app.$emit('setOverview');
            },
            viewColor() {

            }
        }
    });

    Vue.component('addToCart', {
        template: `
            <button @click="addToCart">Add to cart</button>
        `,
        methods: {
            addToCart() {
                app.$emit('addToCart', 'item');
            }
        }
    });

    Vue.component('cart', {
        props: ['cart'],
        template: `
            <div>
                <h1>Cart</h1>
                <toOverview></toOverview>
                <ul v-if="cart.length">
                    <li v-for="item in cart">
                        {{ item }}
                        <button @click="removeFromCart">Remove from cart</button>
                    </li>
                </ul>
                <p v-else>Buy something! Now!</p>
            </div>
        `,
        methods: {
            removeFromCart(e) {
                console.log(e);
                app.$emit('removeFromCart', 'data');
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
            cart: [],
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
        methods: {
            viewCart() {
                this.currentView = "cart";
            }
        },
        created() {
            this.$on('setComponent', component => {
                this.currentView = component.name;
                // history.pushState( {page: component.product.name}, '', '/'+component.product.name.replace(/ /gi, "-").toLowerCase() );
                this.productDetail = component.product;
            });
            this.$on('setOverview', () => {
                // history.pushState( {page: 'overview'}, '', '/overview' );
                this.currentView = 'overview';
            });
            this.$on('addToCart', data => {
                this.cart.push(data);
            });
            this.$on('removeFromCart', (index) => {
                this.cart.splice(index, 1); // Needs to be checked!!!!!!!!!!
            })

            // Get cart info from local storage
            // Change cart info in local storage
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
