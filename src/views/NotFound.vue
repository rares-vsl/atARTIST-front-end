<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

import { useUserStore } from '@/stores/UserStore'

defineProps(['msg'])

const store = useUserStore()
const user = ref(null)
user.value = store.getUser


</script>

<template>
    <div class="md:w-[72rem] w-full bg-white mx-auto mt-6 p-6 rounded-lg drop-shadow-md shadow-black space-y-10 text-center font-bold text-2xl">
        <p>404 - Not Found</p>
    </div>
</template>