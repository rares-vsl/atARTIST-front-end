
<script setup>

import { onMounted, reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useCMSStore } from '@/stores/CMSStore'
import BreadCrumbs from '@/components/BreadCrumbs.vue'

import { PhotoIcon }
    from '@heroicons/vue/24/solid'

import Input from '@/components/FormInput.vue'
import TextArea from '@/components/FormTextArea.vue'
import Submit from '@/components/FormSubmit.vue'


import LoadingSpin from '@/components/LoadingSpin.vue'

const store = useCMSStore()
const router = useRouter()

const slug = ref('')
const postSlug = ref('')

const post = reactive({})

const msg = reactive({
    title: [],
    description: [],
    media: []
})
const isLoading = ref(true)


const gallery = reactive({})

const previous = computed(() => {
    return [
        {
            path: 'Galleries',
            url: '/portfolio/galleries'
        },
        {
            path: gallery.name,
            url: '/portfolio/galleries/' + gallery.slug
        }
    ]
})

const postMedia = ref('')
const postMediaUploaded = ref(false)

function previewPost(e) {
    const file = e.target.files[0]
    post.media = file
    postMedia.value = URL.createObjectURL(file)
    postMediaUploaded.value = true
}

onMounted(() => {
    slug.value = router.currentRoute.value.params.slug
    postSlug.value = router.currentRoute.value.params.post

    getPost()
})

async function getPost() {
    Object.assign(gallery, store.getGallery(slug.value))

    if (!Object.keys(gallery).length) {
        await store.fetchGallery(slug.value)
            .then((responseGallery) => {
                Object.assign(gallery, responseGallery)
            }).catch(() => {
                router.push({ name: 'not-found' })
            })
    }


    Object.assign(post, store.getGalleryPosts(slug.value).find((p) => p.slug === postSlug.value))

    if (!Object.keys(post).length) {
        await store.fetchPost(gallery, postSlug.value)
            .then((responsePost) => {
                Object.assign(post, responsePost)
            }).catch(() => { })
    }

    isLoading.value = false
}

function editPost() {
    var data = {
        title: post.title,
        description: post.description,
        slug: post.slug,
    }

    if (post.media instanceof File)
        data['media'] = post.media
    
    store.editPost(gallery, data)
}

</script>

<template>
    <div class="flex flex-col grow "
         v-if="!isLoading">
        <div
             class="w-1/2 flex flex-col bg-white mx-auto mt-6 p-6 rounded-lg drop-shadow-md shadow-black h-fit justify-between gap-6">
            <BreadCrumbs :previous="previous"
                         :current="'edit post: + post.slug'" />
            <h1 class="text-gray-800 font-bold text-2xl">
                Edit Post
            </h1>
            <form @submit.prevent="editPost"
                  class="flex flex-col gap-6">
                <div class="w-1/2 m-auto flex flex-col h-fit">
                    <span class="inline-block mb-2 text-gray-500 text-center w-full">Upload
                        Image(jpg,png,svg,jpeg)</span>
                    <div class="flex w-full justify-center">

                        <label v-if="!postMediaUploaded"
                               for="file-input"
                               class="flex h-64 justify-center cursor-pointer">
                            <img :src="post.media"
                                 class="h-64"
                                 alt="" />
                        </label>
                        <label v-else
                               for="file-input"
                               class="flex h-60 justify-center cursor-pointer">
                            <img :src="postMedia"
                                 class="h-60"
                                 alt="" />
                        </label>

                        <input type="file"
                               id="file-input"
                               @change="previewPost"
                               accept="image/png, image/jpeg"
                               class="hidden" />
                    </div>
                </div>
                <Input v-model="post.title"
                       :blur="clearInputOnBlur"
                       :type="'text'"
                       :name="'title'"
                       :id="'title'"
                       :placeholder="'Post title'"
                       :title="'Enter the post\'s title'"
                       :required="true"
                       :msg="msg.title" />

                <TextArea v-model="post.description"
                          :blur="clearInputOnBlur"
                          :name="'description'"
                          :id="'description'"
                          :placeholder="'Post description'"
                          :title="'Enter the post\'s description'"
                          :required="true"
                          :msg="msg.description" />
                <div>
                    <Submit :submitStatus="false"
                            :loading="false">Edit post</Submit>
                </div>
            </form>
        </div>
    </div>
    <div class="grow"
         v-else>
        <LoadingSpin />
    </div>
</template>
