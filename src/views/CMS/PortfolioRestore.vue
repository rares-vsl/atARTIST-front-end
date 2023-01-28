<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCMSStore } from '@/stores/CMSStore'
import { storeToRefs } from 'pinia'

import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'

import Submit from '@/components/FormSubmit.vue'


const router = useRouter()

const CMSStore = useCMSStore()

const { getPortfolio: portfolio } = storeToRefs(CMSStore)

const msg = reactive({
    name: ''
})

const loading = ref(false)
const loadingPage = ref(true)

const isDisabled = computed(() => invalidForm(portfolio, msg))

onMounted(() => {
    if (portfolio.value.active)
        router.push({ name: 'home-cms' })
})

function restorePortfolio() {
    loading.value = true

    CMSStore.restorePortfolio(portfolio).then(() => {
        router.push({ name: 'cms-home' })
    }).catch((error) => {
        loading.value = false
        parseErrorsMsg(error.response, msg, portfolio)
    })

}

function deletePortfolio() {
    loading.value = true

    CMSStore.deletePortfolio(portfolio).then(() => {
        router.push({ name: 'home' })
    }).catch((error) => {
        loading.value = false
        parseErrorsMsg(error.response, msg, portfolio)
    })

}
</script>

<template>
    <div class="grow flex flex-col justify-start items-center bg-white h-full py-[10%]">
        <div class="flex flex-col p-12 md:w-[42rem] w-full">
            <div class="text-center z-0 space-y-8">
                <h1 class="text-gray-800 font-bold text-3xl mb-2 text-center">
                    Restore your portfolio
                </h1>
                <p>Click the restore button to restore your portfolio</p>
            </div>

            <div class="flex gap-6">
                <Submit :loading="loading"
                        @click="restorePortfolio">Restore</Submit>
                <Submit :loading="loading"
                        class="bg-red-600 hover:bg-red-800"
                        @click="restorePortfolio">Delete forever</Submit>
            </div>
        </div>
    </div>
</template>
