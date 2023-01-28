<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const router = useRoute()

const bannerSrc = computed(() => {
    let baseURL = '/images/auth/'
    return router.name == 'sign-up' ? baseURL + 'sign-up.jpg' : baseURL + 'sign-in.jpg'
})

</script>

<template>
    <!-- Logo -->
    <RouterLink to="/">
        <div href="/"
             class="hidden xl:flex items-center
        absolute top-10 left-10 z-10 p-0.5 rounded-full opacity-80 gap-2">
            <img :src="'/images/logo.svg'"
                 class="w-6 h-6" />
            <span class="font-kalam font-light  text-3xl text-white h-7">ARTIST</span>
        </div>
    </RouterLink>

    <div class="md:flex w-full overflow-hidden h-screen">
        <!-- Side Info -->
        <div
             class="relative overflow-hidden hidden xl:flex w-[32rem] pt-[8.5rem] space-y-16 px-12 flex-col justify-top items-center text-white bg-gradient-to-tr from-indigo-500 via-blue-700 to-blue-500 z-1">
            <div class="space-y-8 w-full">
                <h1 class="font-bold text-5xl font-sans leading-tight">Showcase your work!</h1>
                <p class="font-light text-xl font-sans w-[20rem]">
                    With atARTIST you can create and manage your personal portfolio
                </p>
            </div>

            <div class="flex flex-col">
                <div class="relative rounded-lg overflow-hidden z-0 aspect-square">
                    <img :src="bannerSrc"
                         class="aspect-square object-top">
                </div>
            </div>
        </div>

        <!-- Form -->
        <div class="grow flex flex-col justify-start items-center bg-white  py-[7%] h-full overflow-y-auto">
            <div class="flex flex-col p-12 md:w-[42rem] w-full">
                <RouterView />
            </div>
        </div>
    </div>
</template>

