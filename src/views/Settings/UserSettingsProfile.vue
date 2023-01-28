<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/UserStore'

import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'
import { clearErrorsMsg } from '@/compostables/clearErrorsMsg.js'

import Input from '@/components/FormInput.vue'
import Submit from '@/components/FormSubmit.vue'
import Toast from '@/components/FormToast.vue'

import { UserIcon } from '@heroicons/vue/24/solid'
import axios from '@/axiosConfig.js'

const store = useUserStore()
const { getUser: currentUser } = storeToRefs(store)

const user = reactive({
    name: currentUser.value.name
})

const msg = reactive({
    name: []
})

let oldUser = ''

const updateResponse = ref('')

const propic = ref(currentUser.value.propic)
const newPropic = ref(null)
const isPropicNew = ref(false)
const isNewPropicLoading = ref(false)
const updateNameLoading = ref(false)

const removePropic = ref()

const isDisabled = computed(() => {
    var name = currentUser.value.name

    return invalidForm(user, msg) || name == user.name
})

onMounted(() => {
    axios.get('v1/users/' + currentUser.value.username + '/propic')
        .then(function (response) {
            removePropic.value = response.data.data.has_propic
        }).catch()
})

function previewNewPropic(e) {
    const file = e.target.files[0]
    newPropic.value = file
    propic.value = URL.createObjectURL(file)
    isPropicNew.value = true
}

function deletePropic() {
    var seed = Math.random()
    axios.delete('v1/users/' + currentUser.value.username + '/propic').then(function (response) {
        updateResponse.value = response.data.data.message
        propic.value = response.data.data.user.propic + '?' + seed
        currentUser.value.propic = response.data.data.user.propic + '?' + seed
        removePropic.value = false
    }).catch((error) => { })
}

function updatePropic() {
    isNewPropicLoading.value = true

    var seed = Math.random()


    axios.post('v1/users/' + currentUser.value.username + '/propic', {
        propic: newPropic.value
    }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(function (response) {
        updateResponse.value = response.data.data.message
        propic.value = response.data.data.user.propic + '?' + seed
        currentUser.value.propic = response.data.data.user.propic + '?' + seed
        isPropicNew.value = false
        isNewPropicLoading.value = false
        removePropic.value = true
    }).catch(() => { isNewPropicLoading.value = false })
}

function clearInputOnBlur(event) {
  return clearErrorsMsg(event, msg, user, oldUser)
}

function updateName() {
    updateNameLoading.value = true

    store.updateName(user.name)
        .then((message) => {
            updateResponse.value = message
            updateNameLoading.value = false
        })
        .catch((error) => {
            updateNameLoading.value = false
            oldUser = parseErrorsMsg(error.response, msg, user.value)
        })

}
</script>

<template>
    <div class="mb-8 z-0">
        <Toast :msg="updateResponse"
               status="success" />
        <h1 class="text-gray-800 font-bold text-2xl mb-2">
            Profile
        </h1>
        <p>Update your name and profile picture</p>
    </div>
    <form @submit.prevent="updatePropic"
          enctype="multipart/form-data"
          class="flex gap-4">
        <label for="file-input"
               class="cursor-pointer relative rounded-full overflow-hidden z-0 aspect-auto">
            <img :src="propic"
                 :alt="currentUser.name"
                 class="w-12 h-12 object-top aspect-square"
                 v-if="!isNewPropicLoading">
            <div v-else
                 class="rounded-full bg-gray-300 h-12 w-12 animate-pulse"></div>

        </label>
        <div>
            <p class="font-bold">{{ currentUser.username }}</p>
            <div class="flex gap-4">
                <button type="submit"
                        :disabled="!isPropicNew"
                        class="font-bold text-blue-700 disabled:text-gray-400">
                    Change profile picture
                </button>
                <button class="text-red-500 font-bold"
                        type="button"
                        v-if="removePropic"
                        @click="deletePropic">Delete</button>
            </div>
        </div>
        <input id="file-input"
               type="file"
               @change="previewNewPropic"
               accept="image/png, image/jpeg"
               class="hidden" />
    </form>
    <div class="border-t-2 border-gray-200 my-10"></div>
    <form @submit.prevent="updateName"
          class="space-y-6">
        <Input v-model="user.name"
               :blur="clearInputOnBlur"
               :type="'name'"
               :name="'name'"
               :id="'name'"
               :placeholder="'Name'"
               :title="'Enter your name'"
               :required="true"
               :msg="msg.name">
        <UserIcon class="h-6 w-6 text-gray-400 mr-4"
                  title="So nice to see you!" />
        </Input>

        <div>
            <Submit :submitStatus="isDisabled"
                    :loading="updateNameLoading">Save changes</Submit>
        </div>
    </form>
</template>

