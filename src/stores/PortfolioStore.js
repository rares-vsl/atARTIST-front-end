import { defineStore } from 'pinia'

import axios from '@/axiosConfig.js'

export const usePortfoliosStore = defineStore('publicPortfolios', {
    state: () => ({
        portfolio: {

        },
        sections: []
    }),

    getters: {
        getPortfolio(state) {
            return state.portfolio
        }
    },
    actions: {
        async fetchPortfolio(slug) {
            const url = 'v1/portfolios/' + slug
            const response = await axios.get(url)

            this.portfolio = response.data.data.portfolio
        },
        async fetchHome() {
            const url = 'v1/portfolios/' + this.portfolio.name + '/home'
            const response = await axios.get(url)

            this.portfolio.sections[0] = response.data.data.section
        },
        async fetchGallery(index) {
            var slug = this.portfolio.sections[index].slug
            const url = 'v1/portfolios/' + this.portfolio.name + '/galleries/' + slug 
            const response = await axios.get(url)

            this.portfolio.sections[index] = response.data.data.section
        },
        async fetchAboutMe(index) {
            const url = 'v1/portfolios/' + this.portfolio.name + '/about-me'
            const response = await axios.get(url)

            this.portfolio.sections[index] = response.data.data.section
        }
    },
})  