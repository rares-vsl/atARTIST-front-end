import { defineStore } from 'pinia'

import axios from '@/axiosConfig.js'

export const useCMSStore = defineStore('cms', {
    state: () => ({
        portfolio: {},
        galleries: [],
        posts: [],
        deletedGalleries: [],
        aboutMe: {}
    }),
    getters: {
        getPortfolio(state) {
            return state.portfolio
        },
        getAboutMe(state) {
            return state.aboutMe
        },
        getGalleries(state) {
            return state.galleries
        },
        getDeletedGalleries(state) {
            return state.deletedGalleries
        },
        getGallery(state) {
            return (slug) => state.galleries.find((gallery) => gallery.slug === slug)
        },
        getGalleryPosts(state) {
            return (slug) => {
                {
                    var gallery = state.posts.find((gallery) => gallery.slug === slug)
                    return gallery ? gallery.posts : []
                }
            }
        }
    },
    actions: {
        async createPortfolio(portfolio) {
            const response = await axios.post('v1/cms/portfolios/', portfolio)
            this.portfolio = response.data.data.portfolio
            this.galleries = response.data.data.portfolio.sections.galleries
        },
        async restorePortfolio() {
            const url = 'v1/cms/portfolios/' + this.portfolio.name + '/delete'
            const response = await axios.patch(url)
            this.portfolio.active = 'true'
        },
        async updatePortfolio(newName) {
            const url = 'v1/cms/portfolios/' + this.portfolio.name
            const response = await axios.patch(url, {
                name: newName
            })
            this.portfolio.name = response.data.data.portfolio.name
            return response.data.data.message
        },
        async archivePortfolio() {
            const url = 'v1/cms/portfolios/' + this.portfolio.name +'/archive'
            const response = await axios.patch(url)
            this.portfolio.archived = response.data.data.portfolio.archived
            return response.data.data.message
        },
        async deletePortfolio() {
            const url = 'v1/cms/portfolios/' + this.portfolio.name
            const response = await axios.delete(url)

            this.portfolio = {}
            return response.data.data.message
        },
        async fetchPortfolio() {
            const url = 'v1/cms'
            const response = await axios.get(url)

            this.portfolio = response.data.data.portfolio
        },
        async fetchAboutMe() {

            const url = 'v1/cms/portfolios/' + this.portfolio.name + '/about-me'
            const response = await axios.get(url)

            this.aboutMe = response.data.data.about_me
        },
        async editAboutMe(aboutMe) {
            const url = 'v1/cms/portfolios/' + this.portfolio.name + '/about-me'
            const response = await axios.patch(url, {
                biography: aboutMe.biography,
                contact: aboutMe.contact
            })

            this.aboutMe = response.data.data.about_me

            return response
        },
        async fetchGalleries() {

            const url = 'v1/cms/portfolios/' + this.portfolio.name + '/galleries'
            const response = await axios.get(url)

            this.galleries = response.data.data.galleries
        },
        async fetchDeletedGalleries() {
            const url = 'v1/cms/portfolios/' + this.portfolio.name + '/galleries/deleted'
            const response = await axios.get(url)

            this.deletedGalleries = response.data.data.galleries
        },
        async fetchGallery(slug) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries/' + slug
            const response = await axios.get(url)

            return response.data.data.gallery
        },
        async createGallery(gallery) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries'
            const response = await axios.post(url, gallery)

            var newGallery = response.data.data.gallery

            if (this.galleries.length > 0) {
                var index = this.galleries.findIndex(
                    (g) => newGallery.index < g.index
                )
                if (index > -1)
                    this.galleries.splice(index, 0, newGallery)
                else
                    this.galleries.push(newGallery)
            }
            this.portfolio.galleries_count++
            return newGallery
        },
        async editGallery(gallery) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries/' + gallery.slug

            const response = await axios.patch(url, gallery)

            var updatedGallery = response.data.data.gallery

            if (this.galleries.length > 0) {
                var index = this.galleries.findIndex(
                    (g) => g.slug === gallery.slug
                )

                this.galleries[index] = updatedGallery
            }

            return response
        },
        async editGalleryIndex(gallery) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries/' + gallery.slug + '/index'

            const response = await axios.patch(url, { index: gallery.index })

            if (this.galleries.length > 0) {
                this.galleries = response.data.data.galleries
            }

            return response
        },
        async editGalleryArchiveStatus(gallery) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries/' + gallery.slug + '/archive'

            const response = await axios.patch(url)

            if (gallery.archived)
                this.portfolio.galleries_count++
            else
                this.portfolio.galleries_count--

            this.galleries = response.data.data.galleries
        },
        async deleteGallery(gallery) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries/' + gallery.slug

            const response = await axios.delete(url)

            if (this.deletedGalleries.length > 0) {
                this.deletedGalleries.push(gallery)
            }

            this.portfolio.galleries_count--
            this.galleries = response.data.data.galleries
        },
        async restoreGallery(gallery) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries/' + gallery.slug + '/delete'

            const response = await axios.patch(url)

            if (this.galleries.length > 0) {
                this.galleries.push(response.data.data.gallery)
            }

            this.portfolio.galleries_count++

            this.removeFromDeleteGalleries(gallery)
        },
        async confirmDeletionGallery(gallery) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries/' + gallery.slug + '/delete'

            const response = await axios.delete(url)

            this.removeFromDeleteGalleries(gallery)

            return response
        },
        removeFromDeleteGalleries(gallery) {
            this.deletedGalleries = this.deletedGalleries.filter(
                (g) => g.slug != gallery.slug
            )
        },
        async fetchPosts(gallery) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries/' + gallery.slug + '/posts'

            const response = await axios.get(url)
            this.posts.push({
                slug: gallery.slug,
                posts: response.data.data.posts
            })

            return response.data.data.posts
        },
        async fetchPost(gallery, slug) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries/' + gallery.slug + '/posts/' + slug

            const response = await axios.get(url)

            return response.data.data.post
        },
        async createPost(gallery, post) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries/' + gallery.slug + '/posts'

            const response = await axios.post(url, post, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            var newPost = response.data.data.post

            if (this.posts.length > 0) {
                this.posts.find((g) => gallery.slug === g.slug).posts.unshift(newPost)
            }
        },
        async editPost(gallery, post) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries/' + gallery.slug + '/posts/' + post.slug

            const response = await axios.post(url, post, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        },
        async deletePost(gallery, post) {
            const url =
                'v1/cms/portfolios/' +
                this.portfolio.name +
                '/galleries/' + gallery.slug + '/posts/' + post.slug

            await axios.delete(url)

            var i = this.posts.findIndex((g) => gallery.slug === g.slug)

            this.posts[i].posts = this.posts[i].posts.filter((p) => post.slug != p.slug)

        }

    },
})  