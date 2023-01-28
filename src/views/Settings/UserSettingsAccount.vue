<script setup>
import { ref, reactive, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/UserStore'

import { AtSymbolIcon, EnvelopeIcon } from '@heroicons/vue/24/solid'

import axios from '@/axiosConfig.js'

import Input from '@/components/FormInput.vue'
import Submit from '@/components/FormSubmit.vue'
import Toast from '@/components/FormToast.vue'

import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'

const store = useUserStore()

const { getUser: currentUser } = storeToRefs(store)

const user = reactive({
    username: currentUser.value.username,
    email: currentUser.value.email
})

const msg = reactive({
    username: [],
    email: []
})

const loading = ref(false)

const isDisabled = computed(() => {
    var username = currentUser.value.username
    var email = currentUser.value.email

    return invalidForm(user, msg) ||
        (email == user.email && username == user.username)
})

const updateResponse = ref('')

function availableUsername() {
    var username = user.username

    if (username == currentUser.value.username || !username) {
        return ''
    }

    axios.get('auth/username', {
        params: {
            username: username,
        }
    }).then(function (response) {
        msg.username = []
    }).catch((error) => {
        parseErrorsMsg(error.response, msg, user)
    })
}

function availableEmail() {
    var email = user.email

    if (email == currentUser.value.email || !email) {
        return ''
    }

    axios.get('auth/email', {
        params: {
            email: email,
        }
    }).then(function () {
        msg.email = []
    }).catch((error) => {
        parseErrorsMsg(error.response, msg, user)
    })
}

function updateAccount() {
    loading.value = true

    store.updateAccount(user)
        .then((message) => {
            updateResponse.value = message
            loading.value = false
        })
        .catch((error) => {
            loading.value = false
            parseErrorsMsg(error.response, msg, user.value)
        })
}

</script>

<template>
    <div class="mb-8 z-0">
        <Toast :msg="updateResponse" status="success"/>
        <h1 class="text-gray-800 font-bold text-2xl mb-2">
            Account
        </h1>
        <p>Update your username and email</p>
    </div>
    <form @submit.prevent="updateAccount"
          class="space-y-6">
        <Input v-model="user.username"
               :blur="availableUsername"
               :type="'text'"
               :name="'username'"
               :id="'username'"
               :placeholder="'Username'"
               :title="'Enter your username'"
               :required="true"
               :msg="msg.username">
        <AtSymbolIcon class="h-6 w-6 text-gray-400 mr-4" />
        </Input>

        <Input v-model="user.email"
               :blur="availableEmail"
               :type="'email'"
               :name="'email'"
               :id="'email'"
               :placeholder="'Email'"
               :title="'Enter your email'"
               :required="true"
               :msg="msg.email">
        <EnvelopeIcon class="h-6 w-6 text-gray-400 mr-4" />
        </Input>
        <div>
            <Submit :submitStatus="isDisabled"
                    :loading="loading">Save changes</Submit>
        </div>
    </form>
</template>

