<script setup>
import { HomeIcon } from '@heroicons/vue/24/solid'
const props = defineProps(['index', 'current'])
</script>

<template>
    <li class="page-item">
        <button :class="{
            'page-link relative block rounded border-0 outline-none transition-all duration-300 focus:shadow-none h-10 w-10': true,
            'bg-blue-700 text-white'
                : index == current,
            'hover:bg-blue-500': index == current && index != current,
            'bg-gray-100 text-gray-700 hover:bg-gray-300 '
                : index != current
        }"
                type="button"
                :disabled="index == current">
            <div v-if="index == 1"
                 class="flex items-center justify-center h-full w-full ">
                <HomeIcon class="h-6 w-6" />
            </div>
            <span v-else>{{ index }}</span>
        </button>
    </li>
</template>

