<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import {
  EnvelopeIcon, LockClosedIcon, ArrowUturnRightIcon,
  EyeIcon, EyeSlashIcon
}
  from '@heroicons/vue/24/solid'

import axios from '@/axiosConfig.js'

import Input from '@/components/FormInput.vue'
import Submit from '@/components/FormSubmit.vue'

import { useRouter } from 'vue-router'

import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { clearErrorsMsg } from '@/compostables/clearErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'
import { setToast } from '@/compostables/setToast.js'

const user = reactive({
  email: 'ta@test.com',
  password: 'AdubuD4b$',
  password_confirmation: 'AdubuD4b$',
})

let oldUser = {}

const router = useRouter()

const msg = reactive({
  email: [],
  password: [],
  password_confirmation: [],
})

const loading = ref(false)
const pswShow = ref(false)

const isDisabled = computed(() => invalidForm(user, msg))

onMounted(() => {
  if (router.currentRoute.value.query.token == null)
    router.push({ name: 'sign-in' })
})

function clearInputOnBlur(event) {
  return clearErrorsMsg(event, msg, user, oldUser)
}

function showPassword() {
  pswShow.value = !pswShow.value
}

const passwordType = computed(() => {
  if (pswShow.value)
    return 'text'
  return 'password'
})

function resetPassword() {
  user.token = router.currentRoute.value.query.token

  axios.post('auth/reset-password', user)
    .then(function (response) {
      setToast('sign-in', response.data.data.message, 'success')

      router.push({
        name: 'sign-in',
      });
    })
    .catch((error) => {
      if (error.response.data.status == 'fail') {
        setToast('sign-in', error.response.data.data.message, 'fail')

        router.push({
          name: 'sign-in',
        });
      }
      oldUser = parseErrorsMsg(error.response, msg, user)
      loading.value = false
    })
}

</script>

<template>
  <div class="mb-8 text-center z-0">
    <h1 class="text-gray-800 font-bold text-3xl mb-2 text-center">
      Reset password
    </h1>

    <p>Already have account? <RouterLink :to="{ name: 'sign-in' }"
                  class="text-blue-700">
        Sign In
      </RouterLink>
    </p>
  </div>

  <form @submit.prevent="resetPassword"
        class="space-y-6">
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
              :loading="loading">Reset password</Submit>
    </div>
  </form>

</template>