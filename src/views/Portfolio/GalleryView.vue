<script setup>
import { ref } from 'vue'

const selectedPost = ref('')

function selectPost(slug) {
    selectedPost.value = slug
}

defineProps(['content'])

</script>

<template>
    <div class="mt-4 py-4 px-8 bg-gray-100 rounded-lg w-full">
        {{ content.description }}
    </div>

    <section class="overflow-hidden text-gray-700 w-full bg-gray-100 mt-8 rounded-lg 
        p-8">
        <div class="flex flex-wrap -m-1 md:-m-2">
            <div v-for="post in content.posts" v-if="content.posts.length > 0"
                 :class="{
                     'flex flex-wrap  p-2 items-stretch gap-4 content-start': true,
                     'w-full': post.slug == selectedPost,
                     'w-1/3': post.slug != selectedPost
                 }"
                 @click="() => selectPost(post.slug)">
                <div class="w-full justify-center flex"
                     v-if="post.slug == selectedPost">
                    <img alt="gallery"
                         class="h-96"
                         :src="post.media">
                </div>
                <div class="w-fit h-fit"
                     v-else>
                    <img alt="gallery"
                         class="w-full h-full"
                         :src="post.thumbnail">
                </div>
                <div class="bg-white py-2 px-4 w-full h-fit text-xl"
                     v-if="post.slug == selectedPost">
                    <h1 class="font-bold">{{ post.title }}</h1>
                    <span>{{ post.description }}</span>
                </div>
            </div>
            <div v-else class="grow">
                <h1
                class="text-lg text-center w-full">This gallery is still empty, come back later!</h1>
            </div>
        </div>
    </section>
</template>