import Vue from 'vue';

const eventBus = new Vue();

export const PageHeader = Vue.component('page-header',{
    data: function() {
        return {
            searchIsActive: false,
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
    created() {
        eventBus.$on('closeSearchBox', () => {
            this.searchIsActive = !this.searchIsActive;
        })
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
                    <button class="search__close" @click="closeSearchBox">X</button>
                </form>
            </transition>

        </div>
    `,
    methods: {
        closeSearchBox() {
            eventBus.$emit('closeSearchBox');
        }
    }
});
