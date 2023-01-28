

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
const { getPortfolio: currentPortfolio } = storeToRefs(store)

const portfolio = reactive({
    name: currentPortfolio.value.name
})

const msg = reactive({
    name: []
})

let oldPortfolio = ''

const updateResponse = ref('')

const icon = ref(currentPortfolio.value.icon)
const newIcon = ref(null)
const isIconNew = ref(false)
const isNewIconLoading = ref(false)
const updateNameLoading = ref(false)

const removeIcon = ref()

const isDisabled = computed(() => {
    var name = currentPortfolio.value.name

    return invalidForm(portfolio, msg) || name == portfolio.name
})

onMounted(() => {
    axios.get('v1/cms/portfolios/' + currentPortfolio.value.name + '/icon')
        .then(function (response) {
            removeIcon.value = response.data.data.has_icon
        }).catch()
})

function previewNewIcon(e) {
    const file = e.target.files[0]
    newIcon.value = file
    icon.value = URL.createObjectURL(file)
    isIconNew.value = true
}

function deleteIcon() {
    var seed = Math.random()
    axios.delete('v1/cms/portfolios/' + currentPortfolio.value.name + '/icon')
        .then(function (response) {
            updateResponse.value = response.data.data.message
            icon.value = response.data.data.portfolio.icon + '?' + seed
            currentPortfolio.value.icon = response.data.data.portfolio.icon + '?' + seed
            removeIcon.value = false
        }).catch((error) => { })
}

function updateIcon() {
    isNewIconLoading.value = true

    var seed = Math.random()


    axios.post('v1/cms/portfolios/' + currentPortfolio.value.name + '/icon', {
        icon: newIcon.value
    }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(function (response) {
        updateResponse.value = response.data.data.message
        icon.value = response.data.data.portfolio.icon + '?' + seed
        currentPortfolio.value.icon = response.data.data.portfolio.icon + '?' + seed
        isIconNew.value = false
        isNewIconLoading.value = false
        removeIcon.value = true
    }).catch(() => { isNewIconLoading.value = false })
}

function clearInputOnBlur(event) {
    return clearErrorsMsg(event, msg, portfolio, oldPortfolio)
}

function updateName() {
    updateNameLoading.value = true

    store.updatePortfolio(portfolio.name)
        .then((message) => {
            updateResponse.value = message
            updateNameLoading.value = false
        })
        .catch((error) => {
            updateNameLoading.value = false
            oldPortfolio = parseErrorsMsg(error.response, msg, portfolio.value)
        })

}
</script>


<template>
    <div class="mb-8 z-0">
        <Toast :msg="updateResponse"
               status="success" />
        <h1 class="text-gray-800 font-bold text-2xl mb-2">
            Portfolio
        </h1>
        <p>Update your portfolio name and icon</p>
    </div>
    <form @submit.prevent="updateIcon"
          enctype="multipart/form-data"
          class="flex gap-4">
        <label for="file-input"
               class="cursor-pointer relative rounded-full overflow-hidden z-0 aspect-auto">
            <img :src="icon"
                 :alt="currentPortfolio.name"
                 class="w-12 h-12 object-top aspect-square"
                 v-if="!isNewIconLoading">
            <div v-else
                 class="rounded-full bg-gray-300 h-12 w-12 animate-pulse"></div>

        </label>
        <div>
            <p class="font-bold">{{ currentPortfolio.name }}</p>
            <div class="flex gap-4">
                <button type="submit"
                        :disabled="!isIconNew"
                        class="font-bold text-blue-700 disabled:text-gray-400">
                    Change portfolio icon
                </button>
                <button class="text-red-500 font-bold"
                        type="button"
                        v-if="removeIcon"
                        @click="deleteIcon">Delete</button>
            </div>
        </div>
        <input id="file-input"
               type="file"
               @change="previewNewIcon"
               accept="image/png, image/jpeg"
               class="hidden" />
    </form>
    <div class="border-t-2 border-gray-200 my-10"></div>
    <form @submit.prevent="updateName"
          class="space-y-6">
        <Input v-model="portfolio.name"
               :blur="clearInputOnBlur"
               :type="'name'"
               :name="'name'"
               :id="'name'"
               :placeholder="'Name'"
               :title="'Enter your name'"
               :required="true"
               :msg="msg.name">
        <WindowIcon class="h-6 w-6 text-gray-400 mr-4"
                    title="So nice to see you!" />
        </Input>

        <div>
            <Submit :submitStatus="isDisabled"
                    :loading="updateNameLoading">Save changes</Submit>
        </div>
    </form>
</template>