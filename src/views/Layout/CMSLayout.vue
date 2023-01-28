<script setup>
import { ref, onMounted, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCMSStore } from '@/stores/CMSStore'

import SideBar from '@/views/NavBar/SideBar.vue'
import LoadingSpin from '@/components/LoadingSpin.vue'

const router = useRouter()

const CMSStore = useCMSStore()

const { getPortfolio: portfolio } = storeToRefs(CMSStore)

const isLoading = ref(true)

onMounted(() => {
    if (Object.keys(portfolio.value).length == 0) {
        CMSStore.fetchPortfolio().then(() => {
            if (!portfolio.value.active)
                router.push({ name: 'portfolio-restore' })
                isLoading.value = false
        }).catch((error) => {
            router.push({ name: 'portfolio-create' })
            isLoading.value = false
        })
    } else isLoading.value = false
})

onUpdated(() => {
    if (!portfolio.value.active)
                router.push({ name: 'portfolio-restore' })
})
</script>

<template>
    <div class="flex h-[calc(100vh-58px)]">
        <SideBar :loading="isLoading" />

        <RouterView v-if="!isLoading" />

        <div class="grow"
             v-if="isLoading">
            <LoadingSpin />
        </div>
    </div>
</template>
