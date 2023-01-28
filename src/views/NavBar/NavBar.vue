<script setup>

import NavbarMenu from '@/views/NavBar/NavBarMenu.vue'

defineProps(['auth', 'loading'])
</script>

<template>
    <nav class="bg-white border-b-2 border-gray-200 px-12 py-3">
        <div class="flex justify-between items-center mx-auto text-blue-600 font-semibold ">
            <RouterLink to="/">
                <div class="flex items-center gap-2">
                    <img :src="'/images/logo.svg'"
                         class="w-8 h-8" />
                </div>
            </RouterLink>

            <div class="w-auto">
                <ul v-if="!auth"
                    class="flex gap-12">
                    <li class="hover:text-blue-800">
                        <RouterLink to="/auth/sign-in">
                            Sign in
                        </RouterLink>
                    </li>
                    <li class="hover:text-blue-800">
                        <RouterLink to="/auth/sign-up">
                            Sign up
                        </RouterLink>
                    </li>
                </ul>

                <div v-else>
                    <div v-if="!loading">
                        <NavbarMenu />
                    </div>
                    <div v-else
                         class="rounded-full bg-gray-300 h-8 w-8 animate-pulse"></div>
                </div>
            </div>
        </div>
    </nav>
</template>
