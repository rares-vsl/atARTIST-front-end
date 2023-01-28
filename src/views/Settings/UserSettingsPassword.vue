<script setup>
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/UserStore'
import axios from '@/axiosConfig.js'
import {
    LockClosedIcon, ArrowUturnRightIcon,
    EyeIcon, EyeSlashIcon
} from '@heroicons/vue/24/solid'

import Input from '@/components/FormInput.vue'
import Submit from '@/components/FormSubmit.vue'
import Toast from '@/components/FormToast.vue'

import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { clearErrorsMsg } from '@/compostables/clearErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'

const store = useUserStore()

const { getUser: currentUser } = storeToRefs(store)

const user = reactive({
    old_password: 'a2345678Ab$',
    password: '12345678Ab$',
    password_confirmation: '12345678Ab$'
})
let oldUser = ''
const updateResponse = ref('')
const msg = reactive({
    old_password: [],
    password: [],
    password_confirmation: [],
})

const pswShow = ref(false)

const passwordType = computed(() => {
    if (pswShow.value)
        return 'text'
    return 'password'
})
const loading = ref(false)
const isDisabled = computed(() => invalidForm(user, msg))

function clearInputOnBlur(event) {
    return clearErrorsMsg(event, msg, user, oldUser)
}

function showPassword() {
    pswShow.value = !pswShow.value
}

function updatePassword() {
    loading.value = true

    axios.post('v1/users/' + currentUser.value.username + '/password', user)
        .then((response) => {
            updateResponse.value = response.data.message
            loading.value = false
        })
        .catch((error) => {
            loading.value = false
            oldUser = parseErrorsMsg(error.response, msg, user.value)
        })
}
</script>

<template>
    <div class="mb-8 z-0">
        <Toast :msg="updateResponse"
               status="success" />
        <h1 class="text-gray-800 font-bold text-2xl mb-2">
            Change your password
        </h1>
        <p>Before setting a new password, type the old one </p>
    </div>
    <form @submit.prevent="updatePassword"
          class="space-y-6">
        <p class="font-bold">Old password</p>
        <div class="ml-10">
            <Input v-model="user.old_password"
                   :blur="clearInputOnBlur"
                   :type="'password'"
                   :name="'password'"
                   :id="'password'"
                   :placeholder="'Old password'"
                   :title="'Enter your old password'"
                   :required="true"
                   :msg="msg.password">
            </Input>
        </div>

        <p class="font-bold">New password</p>
        <div class="flex relative">
            <Input class="grow"
                   v-model="user.password"
                   :blur="clearInputOnBlur"
                   :type="passwordType"
                   :name="'password'"
                   :id="'password'"
                   :placeholder="'Password'"
                   :title="'Enter your password'"
                   :required="true"
                   :msg="msg.password">
            <LockClosedIcon class="h-6 w-6 text-gray-400 mr-4" />
            </Input>
            <a @click="showPassword"
               tpye="password"
               class="absolute right-4 top-6 transform -translate-y-1/2 cursor-pointer">
                <EyeSlashIcon v-if="pswShow"
                              class="h-6 w-6 text-gray-400" />
                <EyeIcon v-else
                         class="h-6 w-6 text-gray-400" />
            </a>
        </div>
        <Input v-model="user.password_confirmation"
               :blur="clearInputOnBlur"
               :type="'password'"
               :name="'password_confirmation'"
               :id="'password_confirmation'"
               :placeholder="'Confirm password'"
               :title="'Re-enter your password'"
               :required="true"
               :msg="msg.password_confirmation">
        <ArrowUturnRightIcon class="h-6 w-6 text-gray-400 mr-4" />
        </Input>
        <div>
            <Submit :submitStatus="isDisabled"
                    :loading="loading">Change password</Submit>
        </div>
    </form>
</template>

