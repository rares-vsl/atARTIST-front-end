

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCMSStore } from '@/stores/CMSStore'

import { useRouter } from 'vue-router'

import Submit from '@/components/FormSubmit.vue'


const store = useCMSStore()

const { getPortfolio: portfolio } = storeToRefs(store)


const router = useRouter()
function deletePortfolio() {
    store.deletePortfolio().then(()=>router.push({ name: 'portfolio-restore' }))
}
</script>


<template>
    <div class="mb-8 z-0">
        <Toast :msg="updateResponse"
               status="success" />
        <h1 class="text-gray-800 font-bold text-2xl mb-2">
            Portfolio
        </h1>
        <p >Close your portfolio </p>
    </div>
    <Submit class="bg-red-600 hover:bg-red-800"
            @click="deletePortfolio">Close
    </Submit>
</template>