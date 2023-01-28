<script setup>
import { onMounted, reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useCMSStore } from '@/stores/CMSStore'

import LoadingSpin from '@/components/LoadingSpin.vue'
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import Table from '@/components/Table.vue'
import TableRow from '@/components/TableRow.vue'
import TableData from '@/components/TableData.vue'
import Button from '@/components/Button.vue'
import { PencilIcon, TrashIcon }
    from '@heroicons/vue/24/outline'


const store = useCMSStore()
const router = useRouter()

const slug = ref('')

const gallery = reactive({})

const isLoading = ref(true)

const previous = computed(() => {
    return [
        {
            path: 'Galleries',
            url: '/portfolio/galleries'
        }
    ]
})

onMounted(() => {
    slug.value = router.currentRoute.value.params.slug
    getPosts()
})

async function getPosts() {
    Object.assign(gallery, store.getGallery(slug.value))

    if (!Object.keys(gallery).length) {
        await store.fetchGallery(slug.value)
            .then((responseGallery) => {
                Object.assign(gallery, responseGallery)
            }).catch(() => {
                router.push({ name: 'not-found' })
            })
    }

    gallery.posts = store.getGalleryPosts(slug.value)
    if (!gallery.posts.length) {
        await store.fetchPosts(gallery)
            .then((responsePosts) => {
                gallery.posts = responsePosts
            }).catch(() => { })
    }

    isLoading.value = false
}

function deletePost(post){
    store.deletePost(gallery, post)
    gallery.posts = store.getGalleryPosts(slug.value)
}

</script>

<template>
    <div class="flex flex-col grow"
         v-if="!isLoading">
        <div
             class="w-[72rem] flex flex-col bg-white mx-auto mt-6 p-6 rounded-lg drop-shadow-md shadow-black h-fit justify-between gap-6">
            <BreadCrumbs :previous="previous"
                         :current="gallery.name" />
            <div class="flex justify-between mb-5 ">
                <h1 class="text-3xl font-semibold text-blue-700"> {{ gallery.name }}</h1>
                <Button action="create"
                        @click="router.push({ name: 'galleries-post-add' })">Add new post</Button>
            </div>
            <p class="text-lg">
                <span class="font-bold">Description:</span>
                {{ gallery.description }}
            </p>
            <Table :headers="['slug', 'Title', 'Description', '', '']"
                   v-if="gallery.posts.length > 0">
                <TableRow v-for="post in gallery.posts">
                    <TableData class="w-1">
                        <div class="grow w-24">
                            <img :src="post.thumbnail"/>
                        </div>
                    </TableData>
                    <TableData class="w-1/12">
                        {{ post.title }}

                    </TableData>
                    <TableData class="w-1/2">
                        <div class="block  h-fit whitespace-pre-line">
                            
                             {{ post.description.substring(0, 120) }}
                        </div>
                    </TableData>
                    <TableData class="w-1">
                        <div class="cursor-pointer text-green-600"
                             @click="router.push({
                                 name: 'galleries-post-edit',
                                 params: { slug: gallery.slug, post: post.slug }
                             })">
                            <PencilIcon class="h-6 w-6" />
                        </div>
                    </TableData>
                    <TableData class="w-1">
                        <button @click="() => deletePost(post)"
                                class="cursor-pointer text-red-600 block">
                            <TrashIcon class="h-6 w-6" />
                        </button>
                    </TableData>
                </TableRow>
            </Table>
            <div v-else
                 class="text-xl text-center py-4">
                <p>This gallery is empty</p>
            </div>
        </div>
    </div>
    <div class="grow"
         v-else>
        <LoadingSpin />
    </div>
</template>
