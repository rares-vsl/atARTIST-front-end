<script setup>
import { computed, ref, onMounted, onUpdated } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import axios from '@/axiosConfig.js'
import { useUserStore } from '@/stores/UserStore'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'

import MenuItem from '@/components/NavbarMenuItem.vue'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'

const store = useUserStore()
const router = useRouter()

const currentRoute = computed(() => router.currentRoute.value.meta.base)
const isMenuVisible = ref(false)
const verificationLinkSent = ref(false)


const { getUser: user } = storeToRefs(store)

const isEmailVerified = computed(() => {
    return user.value.verified_email
});

onMounted(() => {
    if (user.value.active == false)
        router.push({ name: 'restore-account' })
})


onUpdated(() => {
    if (user.value.active == false)
        router.push({ name: 'restore-account' })
})

function showMenu() {
    isMenuVisible.value = !isMenuVisible.value
}

function resendVerificationLink() {
    axios.post('auth/email/verification-notification')
        .then(function () {
            verificationLinkSent.value = true
        })
        .catch((error) => { })
}
function signOut() {
    store.signOut().then(() => {
        router.go({ name: 'home' })
    }).catch(() => { })
}
</script>

<template>
    <div class="dropdown relative">
        <a @click="showMenu"
           class="dropdown-toggle flex items-center hidden-arrow"
           role="button"
           data-bs-toggle="dropdown"
           aria-expanded="false">
            <div class="cursor-pointer relative rounded-full overflow-hidden z-0 aspect-auto">
                <img :src="user.propic"
                     :alt="user.name"
                     class="w-8 h-8">
            </div>
            <ChevronDownIcon class="h-5 w-5 text-gray-600 ml-2 "
                             v-if="isMenuVisible" />
            <ChevronUpIcon class="h-5 w-5 text-gray-600 ml-2 "
                           v-else="isMenuVisible" />
        </a>
        <ul
            class="dropdown-menu min-w-max absolute hidden bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg shadow mt-1 m-0 bg-clip-padding border-none">

            <!-- Accoun Info -->
            <li>
                <div class="w-80 p-4 border-b-2 flex gap-3">
                    <div class="relative rounded-full overflow-hidden z-0 w-10 h-10">
                        <img :src="user.propic"
                             :alt="user.name"
                             class="w-10 h-10">
                    </div>
                    <div class="flex flex-col">
                        <p class="text-gray-500">{{ user.name }}</p>
                        <p class="text-gray-500 text-sm font-normal">@{{ user.username }}</p>
                    </div>
                </div>


            </li>
            <div class="bg-yellow-100 py-3 dropdown-menu text-center font-bold text-yellow-700 border-b-2 border-gray-200 space-y-3"
                 v-if="!isEmailVerified">
                <span class="flex justify-center text-sm">
                    <ExclamationCircleIcon class="h-5 w-5 mr-2 text-yellow-700" />
                    <p>Your email is unconfirmed </p>
                </span>
                <button type="button"
                        @click="resendVerificationLink">
                    <span v-if="!verificationLinkSent"
                          class="text-sm text-yellow-600">
                        Resend link at <span class="font-normal">{{ user.email }}</span>
                    </span>
                    <span v-else
                          class="text-sm text-green-600">
                        Resend link sent
                    </span>
                </button>
            </div>
            <!-- Impostazioni -->
            <MenuItem :path="'/settings'"
                      :current_path="currentRoute"
                      :name="'settings'">
            Settings
            </MenuItem>

            <MenuItem :path="'/portfolio'"
                      :current_path="currentRoute"
                      :name="'portfolio'"
                      v-if="isEmailVerified">
            Manage your Portfolio
            </MenuItem>
            <li v-else
                class="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap my-2 text-gray-500 ">
                Confirm your email to create a portfolio
            </li>

            <li class="border-t-2 ">
                <button type="button"
                        @click="signOut"
                        class="dropdown-item text-sm py-2 px-4 font-normal block w-full mt-2 whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100 text-left">
                    Sign out
                </button>
            </li>
        </ul>
    </div>
</template>