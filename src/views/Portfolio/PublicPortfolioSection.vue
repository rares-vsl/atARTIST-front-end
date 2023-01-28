<script setup>
import { onMounted, watch, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { usePortfoliosStore } from '@/stores/PortfolioStore'

import LoadingSpin from '@/components/LoadingSpin.vue'

import Gallery from '@/views/Portfolio/GalleryView.vue'
import AboutMe from '@/views/Portfolio/AboutMeView.vue'

const router = useRouter()
const store = usePortfoliosStore()

const { getPortfolio: portfolio } = storeToRefs(store)

const section = ref('')


const sectionCategory = ref('')

const content = computed(() => {
    if (section.value == 'main') {
        return portfolio.value.sections[0]
    }

    return portfolio.value.sections.find(
        (s) => s.slug === section.value)
})

watch(
    () => router.currentRoute.value.params.slug,
    newId => {
        setup()
    }
)

const isLoading = ref(true)

onMounted(() => {
    setup()
})


async function setup() {
    isLoading.value = true
    section.value = router.currentRoute.value.params.slug
    if (section.value != undefined) {
        document.title = section.value + ' | ' + portfolio.value.name
        var i = portfolio.value.sections.findIndex((s) => s.slug === section.value)

        if (i < 0)
            router.push({ name: 'not-found' })
        sectionCategory.value = portfolio.value.sections[i].category

        if (sectionCategory.value == 'gallery') {
            await getGallery(i).then(() => {
                isLoading.value = false
            })
        }
        else if (sectionCategory.value == 'about-me') {
            await getAboutMe(i).then(() => {
                isLoading.value = false
            })
        }
        else {
            router.push({ name: 'not-found' })
        }

    }
    else {
        section.value = 'main'
        sectionCategory.value = 'gallery'

        if (!portfolio.value.sections[0].hasOwnProperty('posts'))
            store.fetchHome().then(() => {
                isLoading.value = false
            })
        else isLoading.value = false
    }
}

async function getGallery(index) {
    if (!portfolio.value.sections[index].hasOwnProperty('posts'))
        await store.fetchGallery(index)
}

async function getAboutMe(index) {
    if (!portfolio.value.sections[index].hasOwnProperty('biography'))
        await store.fetchAboutMe(index)
}

</script>

<template>

    <div v-if="!isLoading"
         class="w-full">
        <Gallery v-if="sectionCategory == 'gallery'"
                 :content="content" />
        <AboutMe v-if="sectionCategory == 'about-me'"
                 :content="content" />
    </div>
    <div class="grow"
         v-else>
        <LoadingSpin />
    </div>
</template>