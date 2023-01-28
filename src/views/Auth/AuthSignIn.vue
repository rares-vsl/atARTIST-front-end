<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/solid'

import { useUserStore } from '@/stores/UserStore'
import { useRouter } from 'vue-router'

import Input from '@/components/FormInput.vue'
import Submit from '@/components/FormSubmit.vue'

import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { parseFailMsg } from '@/compostables/parseFailMsg.js'
import { clearErrorsMsg } from '@/compostables/clearErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'
import Toast from '@/components/FormToast.vue'

const user = reactive({
  email: 'kamelie@mail.com',
  password: '12345678Ab$',
  remember_me: true,
})

let oldUser = ''

const msg = reactive({
  username: [],
  name: [],
  email: [],
  password: [],
  password_confirmation: [],
})

const loading = ref(false)

const toast = reactive({})

onMounted(() => {
  var storedToast = JSON.parse(localStorage.getItem('toast'))

  if (storedToast && storedToast.location == 'sign-in')
  {
    Object.assign(toast, storedToast)
    localStorage.removeItem('toast')
  }
})

const store = useUserStore()
const router = useRouter()

const isDisabled = computed(() => invalidForm(user, msg))

function clearInputOnBlur(event) {
  return clearErrorsMsg(event, msg, user, oldUser)
}

function signIn() {
  loading.value = true

  store.signIn(user)
    .then(() => {
      router.push({ name: 'home' })
    })
    .catch((error) => {
      loading.value = false
      oldUser = parseErrorsMsg(error.response, msg, user)
      Object.assign(toast, parseFailMsg(error.response))
    })
}
</script>

<template>
  <div class="mb-8 text-center z-0">
    <Toast v-if="toast"
           :msg="toast.msg"
           :status="toast.status" />

    <h1 class="text-gray-800 font-bold text-3xl mb-2 text-center">
      Welcome back
    </h1>

    <p>Don't have an account?<RouterLink :to="{ name: 'sign-up' }"
                  class="text-blue-700">
        Sign up
      </RouterLink>
    </p>
  </div>

  <form @submit.prevent="signIn"
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

    <div class="flex justify-between ml-10 flex-col space-y-5
    md:flex-row md:space-y-0">
      <div class="flex items-center">
        <input type="checkbox"
               value="remember_me"
               id="remember"
               v-model="user.remember_me"
               class="
               w-6 h-6 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer">
        <label for="remember"
               class="text-gray-800 text-lg">Remember me</label>
      </div>
      <RouterLink :to="{ name: 'forgot-password' }"
                  class="text-blue-700 text-lg">
        Forgot password?
      </RouterLink>
    </div>
    <div>
      <Submit :submitStatus="isDisabled"
              :loading="loading">Sign In</Submit>
    </div>
  </form>
</template>