import Vue from 'vue';

export const eventBus = new Vue({
    data() {
        return {
            cart: [],
        };
    },
    created() {
        this.$on('addToCart', (product) => {
            localStorage.cartCounter ? localStorage.cartCounter++ : localStorage.cartCounter = 0;
            product.cartId = localStorage.cartCounter;
            if(localStorage.myCart) {
                this.cart = JSON.parse(localStorage.myCart);
            }
            this.cart.push(product);
            localStorage.myCart = JSON.stringify(this.cart);
            this.$emit('setCartCount');
        });
        this.$on('removeFromCart', (product) => {
            if(localStorage.myCart) {
                this.cart = JSON.parse(localStorage.myCart);
            }
            const index = this.cart.findIndex( item => {
                return item.cartId === product.cartId;
            });
            this.cart.splice(index, 1);
            localStorage.myCart = JSON.stringify(this.cart);
            this.$emit('setCartCount');
            this.$emit('updateCart');
        });
    }
});

export const PageHeader = Vue.component('page-header',{
    data: function() {
        return {
            searchIsActive: false,
            cartCount: 0,
        };
    },
    template: `
        <div class="page-header">
            <div class="container">
                <div class="flex">
                    <a href="/">
                        Hypebeast Store 69
                    </a>
                    <a href="/cart.html" class="u-ml-a">
                        <span v-if="cartCount">{{ cartCount }}</span>
                        <span class="icon icon--shopping-cart"></span>
                    </a>
                    <a href="#" class="u-ml-sml">
                        <span class="icon icon--search" @click="searchIsActive = !searchIsActive"></span>
                    </a>
                    <transition name="fade">
                        <searchbox v-show="searchIsActive" :searchIsActive="searchIsActive"></searchbox>
                    </transition>
                </div>
            </div>
        </div>
    `,
    methods: {
        getCartCount() {
            if(localStorage.myCart) {
                this.cartCount = JSON.parse(localStorage.myCart).length;
            }
        }
    },
    created() {
        this.getCartCount();
        eventBus.$on( 'setCartCount', () => { this.getCartCount(); } );
    }
});

export const PageFooter = Vue.component('page-footer',{
    template: `
        <div class="page-footer">
            <div class="container">
                Made with &hearts; by <a href="//www.statik.be/">Statik</a>
            </div>
        </div>
    `,
});

export const Search = Vue.component('searchbox',{
    props: ['searchIsActive'],
    template: `
        <div class="search">

            <transition name="search__overlay">
                <div
                    class="search__overlay"
                    v-show="searchIsActive"
                    @click="closeSearchBox"></div>
            </transition>

            <transition name="search__form">
                <form class="search__form" v-show="searchIsActive">
                    <input type="text" @keyup.escape="closeSearchBox">
                    <button>Search</button>
                    <button class="search__close" @click="closeSearchBox(e)"><span class="icon icon--clear"></span></button>
                </form>
            </transition>

        </div>
    `,
    methods: {
        closeSearchBox(e) {
            console.log();
            e.preventDefault();
            eventBus.$emit('closeSearchBox');
        }
    }
});

export const removeButton = Vue.component('remove-button',{
    props: ['product'],
    template: `
        <button @click="removeFromCart">
            <span class="icon icon--clear"></span>
        </button>
    `,
    methods: {
        removeFromCart() {
            eventBus.$emit('removeFromCart', this.product);
        }
    }
});
