<script setup>
import { ref } from 'vue'
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
defineProps(['msg', 'status'])

const showToast = ref(true)

function close() {
    showToast.value = false
}
</script>

<template>
    <div v-if="msg && showToast"
         :class="{
             'relative flex p-4 mb-8 w-full  rounded-md shadow border-l-8 gap-4': true,
             'border-green-400 bg-white': status == 'success',
             'border-red-600 bg-white': status == 'fail',
         }">
        <CheckCircleIcon class="h-10 w-10 text-green-400"
                         v-if="status == 'success'" />
        <ExclamationCircleIcon class="h-10 w-10 text-red-600"
                               v-else="status == 'fail'" />
        <div class="text-left">
            <p class="font-bold capitalize">{{ status }}</p>
            <p class="text-gray-600">{{ msg }}</p>
        </div>
        <div class="absolute right-2 top-2">
            <button type="button"
                    @click="close">
                <XMarkIcon class="h-6 w-6 text-gray-800" />
            </button>
        </div>
    </div>
</template>