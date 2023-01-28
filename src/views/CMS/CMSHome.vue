<script setup>
import { onMounted, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCMSStore } from '@/stores/CMSStore'

import { HomeIcon, PhotoIcon, PencilSquareIcon }
    from '@heroicons/vue/24/outline'
import Button from '@/components/Button.vue'
import Item from '@/components/CMSItem.vue'
import LoadingSpin from '@/components/LoadingSpin.vue'

const store = useCMSStore()
const router = useRouter()

const { getGalleries: galleries } = storeToRefs(store)

const isLoading = ref(true)

const publicGalleries = computed(() => {
    return galleries.value.filter(function (g) {
        return !(g.archived)
    })
})


const numberOfArchivedGalleries = computed(() => {
    return (galleries.value.length - publicGalleries.value.length)
})

onMounted(() => {
    if (galleries.value.length == 0) {
        store.fetchGalleries().then(() => {
            isLoading.value  = false
        }).catch(()=>isLoading.value  = false)
    } else isLoading.value  = false
})

</script>

<template>
    <div class="md:w-[72rem] bg-white mx-auto mt-6 p-6 rounded-lg drop-shadow-md shadow-black space-y-5 h-fit">
        <div class="space-y-4">
            <div class="flex justify-between">
                <h1 class="text-3xl font-semibold text-blue-700"> Portfolio sections</h1>
                <Button action="create" @click="router.push({ name: 'galleries-add' })">Add gallery</Button>
            </div>
            <div v-if="numberOfArchivedGalleries">
                <p class="text-lg">
                    You currently have
                    <span class="text-gray-700 font-bold">{{ numberOfArchivedGalleries }}</span>
                    archived galleries
                </p>
            </div>
        </div>
        <div class="flex flex-col"
             v-if="!isLoading">
            <Item v-for="(item, index) in publicGalleries"
                  :name="item.name"
                  :slug="item.slug"
                  :posts_count="item.posts_count"
                  type="galleries">
                <HomeIcon v-if="index == 0" />
                <PhotoIcon v-else />
            </Item>
            <Item name="About me"
                  type="about-me"
                  slug="about-me">
                <PencilSquareIcon />
            </Item>
        </div>
        <div v-if="isLoading">
            <LoadingSpin />
        </div>
    </div>
</template>

