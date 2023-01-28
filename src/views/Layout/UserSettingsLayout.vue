<script setup>
import { computed } from 'vue'

import { useRouter } from 'vue-router'
import MenuItem from '@/components/SettingsMenuItem.vue'

const router = useRouter()
const currentRoute = computed(() => router.currentRoute.value.meta.active)
</script>

<template>
    <div class="md:w-[72rem] min-h-[60%] bg-white mx-auto mt-6 rounded-lg drop-shadow-md shadow-black h-fit flex">
        <!-- Side bar -->
        <div class="flex flex-col w-1/5 border-r-2 text-gray-600 pt-6 pb-3 justify-between">
            <ul class="relative px-8 space-y-6">
                <MenuItem path="/settings"
                          :current_path="currentRoute"
                          name="account">
                Account
                </MenuItem>
                <MenuItem path="/settings/profile"
                          :current_path="currentRoute"
                          name="profile">
                Profile
                </MenuItem>
                <MenuItem :path="'/settings/password'"
                          :current_path="currentRoute"
                          name="password">
                Password
                </MenuItem>
            </ul>
            <div class="border-t-2 px-8 text-red-600 pt-3">
                <RouterLink to="/settings/delete-account" :class="{
                    'font-bold' : currentRoute == 'delete-account'
                }">
                    Delete account
                </RouterLink>
            </div>
        </div>
        <div class="w-1/2 px-6 py-6 mx-auto">
            <RouterView />
        </div>
    </div>
</template>