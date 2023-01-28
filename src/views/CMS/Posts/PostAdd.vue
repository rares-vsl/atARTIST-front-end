
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

const post = reactive({
    title: 'test',
    description: 'questo e  un test',
    media: ''
})

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

    Object.assign(gallery, store.getGallery(slug.value))

    if (!Object.keys(gallery).length) {
        store.fetchGallery(slug.value)
            .then((responseGallery) => {
                Object.assign(gallery, responseGallery)
                isLoading.value = false
            }).catch((error) => {
                router.push({ name: 'not-found' })
            })
    } else isLoading.value = false
})

function createPost() {
    store.createPost(gallery, post).then(() => {
        router.push({ name: 'galleries-view', params: { slug: gallery.slug } })
    })
}

</script>

<template>
    <div class="flex flex-col grow "
         v-if="!isLoading">
        <div
             class="w-1/2 flex flex-col bg-white mx-auto mt-6 p-6 rounded-lg drop-shadow-md shadow-black h-fit justify-between gap-6">
            <BreadCrumbs :previous="previous"
                         current="new post" />
            <h1 class="text-gray-800 font-bold text-2xl">
                New Post
            </h1>
            <form @submit.prevent="createPost"
                  class="flex flex-col gap-6">
                <div class="w-1/2 m-auto flex flex-col h-fit">
                    <span class="inline-block mb-2 text-gray-500 text-center w-full">Upload
                        Image(jpg,png,svg,jpeg)</span>
                    <div class="flex w-full justify-center">
                        <label class="flex flex-col w-full h-48 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300 cursor-pointer"
                               for="file-input"
                               v-if="!postMediaUploaded">

                            <div class="flex flex-col items-center justify-center h-full">
                                <PhotoIcon class="w-14 h-14 text-gray-400 " />
                                <p class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                    Select a photo</p>
                            </div>

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
                               required
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
                    <Submit :submitStatus="isDisabled"
                            :loading="loading">Create post</Submit>
                </div>
            </form>
        </div>
    </div>
    <div class="grow"
         v-else>
        <LoadingSpin />
    </div>
</template>
