<script setup>
import { ref, reactive, computed } from 'vue'

import { LockClosedIcon } from '@heroicons/vue/24/solid'
import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router'
import Input from '@/components/FormInput.vue'
import Submit from '@/components/FormSubmit.vue'
import Toast from '@/components/FormToast.vue'
import axios from '@/axiosConfig.js'
import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { parseFailMsg } from '@/compostables/parseFailMsg.js'
import { clearErrorsMsg } from '@/compostables/clearErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'

const user = reactive({
    password: 'AdubuD4b$',
})

let oldUser = ''

const msg = reactive({
    password: [],
})

const isDisabled = computed(() => invalidForm(user, msg))

const loading = ref(false)

const store = useUserStore()
const router = useRouter()

const toast = reactive({})

function clearInputOnBlur(event) {
    return clearErrorsMsg(event, msg, user, oldUser)
}

function deleteAccount() {
    loading.value = true

    var username = store.getUser.username

    axios.post('auth/confirm-password', user)
        .then(function (response) {
            let token = response.data.data.token
            axios.delete('v1/users/' + username, {
                headers: {
                    'Authorization': ' Bearer ' + token
                }
            }).then(function () {
                localStorage.removeItem('user_token')
                localStorage.removeItem('remember_me')
                localStorage.removeItem('session_expires_at')
                router.go({ name: 'home' })
            }).catch((error) => {
                deleteAccountParseErrors(error)
            })
        }).catch((error) => {
            deleteAccountParseErrors(error)
        })
}

function deleteAccountParseErrors(error) {
    loading.value = false
    oldUser = parseErrorsMsg(error.response, msg, user)
    Object.assign(toast, parseFailMsg(error.response))
}

</script>

<template>
    <div class="mb-8 z-0">
        <Toast v-if="toast"
               :msg="toast.msg"
               :status="toast.status" />
        <h1 class="text-gray-800 font-bold text-2xl mb-2">
            Delete your account
        </h1>
        <p>To continue, please re-enter your password</p>
    </div>
    <form @submit.prevent="deleteAccount"
          class="space-y-6">
        <Input v-model="user.password"
               :blur="clearInputOnBlur"
               :type="'password'"
               :name="'password'"
               :id="'password'"
               :placeholder="'Password'"
               :title="'Enter your password'"
               :required="true"
               :msg="msg.password">
        <LockClosedIcon class="h-6 w-6 text-gray-400 mr-4" />
        </Input>

        <div>
            <Submit :submitStatus="isDisabled"
                    :loading="loading"
                    class="bg-red-600 hover:bg-red-400">Delete account</Submit>
        </div>
    </form>
</template>