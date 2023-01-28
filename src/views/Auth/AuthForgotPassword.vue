<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { EnvelopeIcon } from '@heroicons/vue/24/solid'
import axios from '@/axiosConfig.js'

import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { clearErrorsMsg } from '@/compostables/clearErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'
import { setToast } from '@/compostables/setToast.js'

import Input from '@/components/FormInput.vue'
import Submit from '@/components/FormSubmit.vue'

const router = useRouter()

const user = reactive({
  email: 'johndoe@email.com',
})

let oldUser = {}

const msg = reactive({
  email: []
})

const loading = ref(false)

const isDisabled = computed(() => invalidForm(user, msg))

function clearInputOnBlur(event) {
  return clearErrorsMsg(event, msg, user, oldUser)
}

function sendLink() {
  loading.value = true
  axios.post('auth/forgot-password', user)
    .then(function (response) {
      setToast('sign-in', response.data.data.message, 'success')

      router.push({
        name: 'sign-in',
      })
    })
    .catch((error) => {
      loading.value = false
      oldUser = parseErrorsMsg(error.response, msg, user)
    })
}

</script>

<template>
  <div class="mb-8 text-center z-0">
    <h1 class="text-gray-800 font-bold text-3xl mb-2 text-center">
      Forgot Password?
    </h1>

    <p>Already have account? <RouterLink :to="{ name: 'sign-in' }"
                  class="text-blue-700">
        Sign In
      </RouterLink>
    </p>
  </div>

  <form @submit.prevent="sendLink"
        class="space-y-6">

    <p class="text-center">Enter the email address you used when you joined and we'll send you password reset
      instructions</p>
    <Input v-model="user.email"
           :blur="clearInputOnBlur"
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
              :loading="loading">Send reset link</Submit>
    </div>
  </form>
</template>