<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
import { useCMSStore } from '@/stores/CMSStore'
import axios from '@/axiosConfig.js'
import LoadingSpin from '@/components/LoadingSpin.vue'

import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'

import { WindowIcon } from '@heroicons/vue/24/solid'

import Input from '@/components/FormInput.vue'
import Submit from '@/components/FormSubmit.vue'


const router = useRouter()

const userStore = useUserStore()
const CMSStore = useCMSStore()

const portfolio = reactive({
    name: ''
})

const msg = reactive({
    name: ''
})

const loading = ref(false)
const loadingPage = ref(true)

const isDisabled = computed(() => invalidForm(portfolio, msg))

onMounted(() => {
    let user = userStore.getUser

    if (Object.keys(user).length > 0) {

        CMSStore.fetchPortfolio().then(() => {
            router.push({ name: 'home-cms' })
        }).catch(() => {
            loadingPage.value = false
        })
    } else router.push({ name: 'home' })

})

function availablePortfolioName() {
    if (!portfolio.name) {
        return ''
    }

    axios.get('v1/cms/portfolios/name', {
        params: {
            name: portfolio.name,
        }
    }).then(function (response) {
        msg.name = []
    }).catch((error) => {
        parseErrorsMsg(error.response, msg, portfolio)
    })
}

function createPortfolio() {
    loading.value = true

    CMSStore.createPortfolio(portfolio).then(() => {
        router.push({ name: 'cms-home' })
    }).catch((error) => {
        loading.value = false
        parseErrorsMsg(error.response, msg, portfolio)
    })

}
</script>

<template>
    <div v-if="!loadingPage"
         class="flex flex-col justify-start items-center h-full py-[10%]">
        <div class="flex flex-col p-12 md:w-[42rem] w-full bg-white rounded-lg drop-shadow-md shadow-black">
            <div class="mb-8 text-center z-0">
                <h1 class="text-gray-800 font-bold text-3xl mb-2 text-center">
                    Open a portfolion now!
                </h1>
            </div>

            <form @submit.prevent="createPortfolio"
                  class="space-y-6">

                <Input v-model="portfolio.name"
                       :blur="availablePortfolioName"
                       :type="'text'"
                       :name="'name'"
                       :id="'name'"
                       :placeholder="'Portfolio name'"
                       :title="'Enter your portfolio\'s name'"
                       :required="true"
                       :msg="msg.name">
                <WindowIcon class="h-6 w-6 text-gray-400 mr-4" />
                </Input>

                <div>
                    <Submit :submitStatus="isDisabled"
                            :loading="loading">Open</Submit>
                </div>
            </form>
        </div>
    </div>
    <div class="grow"
         v-else>
        <LoadingSpin />
    </div>
</template>
