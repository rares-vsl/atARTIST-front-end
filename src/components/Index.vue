<script setup>
import { ref, watch } from 'vue'

import IndexItem from '@/components/IndexItem.vue'
const props = defineProps(['index', 'modelValue', 'click'])
const emit =defineEmits(['update:modelValue'])

function updateIndex(i){
    emit('update:modelValue', i)
    props.click()
}
</script>

<template>
    <div class="flex justify-center">
        <nav aria-label="Page navigation example">
            <ul class="flex list-style-none gap-4">
                <!-- <button @click="asd">PREMI</button> -->
                <IndexItem v-for="i in Array.from({length: index}, (_, i) => i + 1)"
                           :index="i"
                           :current="modelValue"
                           @click="() => updateIndex(i)"
                           />
            </ul>
        </nav>
    </div>
</template>

