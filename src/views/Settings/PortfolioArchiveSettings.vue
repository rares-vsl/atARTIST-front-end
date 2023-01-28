

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCMSStore } from '@/stores/CMSStore'

import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'
import { clearErrorsMsg } from '@/compostables/clearErrorsMsg.js'

import Input from '@/components/FormInput.vue'
import Submit from '@/components/FormSubmit.vue'
import Toast from '@/components/FormToast.vue'

import { WindowIcon } from '@heroicons/vue/24/solid'
import axios from '@/axiosConfig.js'

const store = useCMSStore()

const { getPortfolio: portfolio } = storeToRefs(store)


const isArchived = computed(() => {
    return portfolio.value.archived
})

function archive() {
    store.archivePortfolio()
}
</script>


<template>
    <div class="mb-8 z-0">
        <Toast :msg="updateResponse"
               status="success" />
        <h1 class="text-gray-800 font-bold text-2xl mb-2">
            Portfolio
        </h1>
        <p v-if="isArchived">Unarchive your portfolio</p>
        <p v-else>Archive your portfolio</p>
    </div>
    <Submit class="bg-gray-400 hover:bg-gray-800"
            @click="archive">
        <span v-if="isArchived">Unarchive</span>
        <span v-else>Archive</span>
    </Submit>
</template>