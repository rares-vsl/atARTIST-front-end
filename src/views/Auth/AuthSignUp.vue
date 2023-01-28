<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axiosConfig.js'
import { useUserStore } from '@/stores/UserStore'
import {
  AtSymbolIcon, EnvelopeIcon, UserIcon, LockClosedIcon, ArrowUturnRightIcon,
  EyeIcon, EyeSlashIcon
}
  from '@heroicons/vue/24/solid'
import Input from '@/components/FormInput.vue'
import Submit from '@/components/FormSubmit.vue'
import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { clearErrorsMsg } from '@/compostables/clearErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'

const user = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
})

let oldUser = {}

const msg = reactive({
  name: [],
  username: [],
  email: [],
  password: [],
  password_confirmation: [],
})

const loading = ref(false)
const pswShow = ref(false)

const store = useUserStore()
const router = useRouter()

const isDisabled = computed(() => invalidForm(user, msg))

const passwordType = computed(() => {
  if (pswShow.value)
    return 'text'
  return 'password'
})

function clearInputOnBlur(event) {
  return clearErrorsMsg(event, msg, user, oldUser)
}

function availableUsername() {
  if (!user.username) {
    return ''
  }

  axios.get('auth/username', {
    params: {
      username: user.username,
    }
  })
    .then(function () {
      msg.username = []
    })
    .catch((error) => {
      parseErrorsMsg(error.response, msg, user)
    })
}

function availableEmail() {
  if (!user.email) {
    return ''
  }

  axios.get('auth/email', {
    params: {
      email: user.email,
    }
  })
    .then(function () {
      msg.email = []
    })
    .catch((error) => {
      parseErrorsMsg(error.response, msg, user)
    })
}

function showPassword() {
  pswShow.value = !pswShow.value
}

function signUp() {
  loading.value = true

  store.signUp(user)
    .then(() => {
      router.push({ name: 'home' })
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
      Create an account
    </h1>

    <p>Already have account? <RouterLink :to="{ name: 'sign-in' }"
                  class="text-blue-700">
        Sign In
      </RouterLink>
    </p>
  </div>

  <form @submit.prevent="signUp"
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
              :loading="loading">Sign Up</Submit>
    </div>
  </form>

</template>