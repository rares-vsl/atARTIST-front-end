<script setup>
import Prevuious from '@/components/BreadCrumbsPrevuious.vue'
defineProps(['previous', 'current'])
</script>

<template>
    <nav class="rounded-md w-full">
        <ol class="list-reset flex text-xl">
            <Prevuious v-for="item in previous" :path="item.path" :url="item.url" />
            <li class="text-gray-500">{{ current }}</li>
        </ol>
    </nav>
</template>