<script setup>
defineProps(['content'])

</script>

<template>
    <div class="mt-4 py-4 px-8 bg-gray-100 rounded-lg w-full text-lg">
        {{ content.biography }}
    </div>

    <div class="mt-4 py-4 px-8 bg-gray-100 rounded-lg w-full">
        <h1>
            <span class="font-bold text-lg">Contact me: </span>
            <span  class="text-lg">{{ content.contact }}</span>
        </h1>
    </div>
</template>