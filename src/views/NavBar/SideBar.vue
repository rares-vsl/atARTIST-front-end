<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useCMSStore } from '@/stores/CMSStore'
import SideBarItem from '@/components/SideBarItem.vue'
import SideBarNestedItem from '@/components/SideBarNestedItem.vue'

defineProps(['loading'])

const store = useCMSStore()
const router = useRouter()
const currentRoute = computed(() => router.currentRoute.value.name)

const { getPortfolio: portfolio } = storeToRefs(store)
</script>

<template>
    <div class="flex flex-col justify-between w-80 pt-6 border-r-2 bg-gray-50 h-full">
        <div class="flex flex-col gap-8">
            <div class="flex flex-col justify-center items-center gap-2 animate-pulse"
                 v-if="loading">
                <div class="rounded-lg bg-gray-300 h-24 w-24">
                </div>
                <div class="h-2 bg-gray-300 rounded w-[calc(100%/2)]">
                </div>
            </div>
            <div class="flex flex-col justify-center items-center gap-2"
                 v-else>
                <div class="relative rounded-lg overflow-hidden z-0 aspect-square">
                    <RouterLink :to="{ name: 'public-portfolio-home', params: {name: portfolio.name}}">
                        <img :src="portfolio.icon"
                             class="h-24 w-24 aspect-square object-top" />
                    </RouterLink>
                </div>
                <div>
                    <span class="font-semibold">{{ portfolio.name }}</span>
                </div>
            </div>

            <ul class="relative space-y-2">
                <SideBarItem :path="'/portfolio'"
                             :current_path="currentRoute"
                             name="home">
                    Home
                </SideBarItem>
                <SideBarItem :path="'/portfolio/galleries'"
                             :current_path="currentRoute"
                             :name="'galleries'">
                    Galleries
                    <template v-slot:header>
                        <SideBarNestedItem :path="'/portfolio/galleries'"
                                           :current_path="currentRoute"
                                           :name="'all'">
                            All
                        </SideBarNestedItem>

                        <SideBarNestedItem :path="'/portfolio/deleted-galleries'"
                                           :current_path="currentRoute"
                                           :name="'deleted'">
                            Trash
                        </SideBarNestedItem>
                    </template>
                </SideBarItem>


                <SideBarItem :path="'/portfolio/about-me'"
                             :current_path="currentRoute"
                             :name="'about'">
                    About me
                </SideBarItem>
            </ul>
        </div>
        <div :class="{
            'text-center border-t-2 w-full py-2': true,
            'bg-blue-700 text-white' : currentRoute.split('-')[0] == 'settings'
        }">
            <RouterLink to="/portfolio/settings"
                        class="py-2 text-lg">Settings</RouterLink>
        </div>
    </div>
    <!-- text-gray-700 -->
</template>