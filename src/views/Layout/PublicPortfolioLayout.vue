<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { storeToRefs } from 'pinia'
import { usePortfoliosStore } from '@/stores/PortfolioStore'

import LoadingSpin from '@/components/LoadingSpin.vue'

const router = useRouter()
const store = usePortfoliosStore()

const portfolioName = ref('')
const currentSection = computed(() => router.currentRoute.value.params.slug)

const isLoading = ref(true)

const { getPortfolio: portfolio } = storeToRefs(store)

onMounted(() => {
    portfolioName.value = router.currentRoute.value.params.name
    currentSection.value = router.currentRoute.value.params.slug
    document.title = portfolioName.value

    if (Object.keys(portfolio.value).length || portfolio.name != portfolioName.value) {
        store.fetchPortfolio(portfolioName.value)
            .then(() => {
                isLoading.value = false
            })
            .catch(() => {
                router.push({ name: 'not-found' })
            })
    }
    else isLoading.value = false
})

</script>

<template>
    <div v-if="!isLoading"
         class="w-[72rem] flex flex-col bg-white mx-auto mt-6 mb-6 p-6 rounded-lg drop-shadow-md shadow-black h-fit justify-between gap-6">
        <div class="flex flex-col justify-center items-center gap-2">
            <div class="relative rounded-lg overflow-hidden z-0 aspect-square">
                <RouterLink :to="'/' + portfolioName">
                    <img :src="portfolio.icon"
                         class="h-24 w-24 aspect-square object-top" />
                </RouterLink>
            </div>
            <div>
                <span class="font-semibold">{{ portfolio.name }}</span>
            </div>
        </div>
        <div class="flex flex-col justify-center items-center">
            <ul class="flex gap-6 px-8 py-4 font-bold">
                <RouterLink v-for="section in portfolio.sections"
                            :to="
                            section.slug == portfolio.home ?
                            '/' + portfolioName : 
                            '/' + portfolioName + '/' + section.slug"
                            :class="{
                                'text-gray-700': true,
                                'text-blue-700': section.slug == currentSection ||
                                (currentSection == undefined && section.slug == portfolio.home)
                            }">
                    {{ section.name }}
                </RouterLink>
            </ul>

            <RouterView />
        </div>
    </div>
    <div class="grow"
         v-else>
        <LoadingSpin />
    </div>
</template>

