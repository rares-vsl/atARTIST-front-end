<script setup>
defineProps(['path', 'url'])
</script>

<template>
    <li>
        <RouterLink :to="url"
                    class="text-blue-600 hover:text-blue-700">
            {{ path }}
        </RouterLink>
    </li>
    <li>
        <span class="text-gray-500 mx-2">/</span>
    </li>
</template>