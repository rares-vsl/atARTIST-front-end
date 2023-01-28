<script setup>
import { onMounted, reactive, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useCMSStore } from '@/stores/CMSStore'

import Input from '@/components/FormInput.vue'
import TextArea from '@/components/FormTextArea.vue'
import Submit from '@/components/FormSubmit.vue'

import LoadingSpin from '@/components/LoadingSpin.vue'
import Toast from '@/components/FormToast.vue'

import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'
import { clearErrorsMsg } from '@/compostables/clearErrorsMsg.js'
import { parseFailMsg } from '@/compostables/parseFailMsg.js'
import { parseSuccessMsg } from '@/compostables/parseSuccessMsg.js'


const store = useCMSStore()

const { getAboutMe: currentAboutMe } = storeToRefs(store)

const aboutMe = reactive({})

let oldAboutMe = ''

const msg = reactive({
    contact: [],
    biography: []
})

const toastEditAboutMe = reactive({})

const isDisabled = computed(() => {
    var contact = currentAboutMe.value.contact
    var bio = currentAboutMe.value.biography

    return invalidForm(aboutMe, msg) || (
        contact == aboutMe.contact && bio == aboutMe.biography
    )
})

const isLoading = computed(() => {
    return !Object.keys(currentAboutMe.value).length
})

const loading = ref(false)

function clearInputOnBlur(event) {
    return clearErrorsMsg(event, msg, aboutMe, oldAboutMe)
}

onMounted(() => {
    if (Object.keys(currentAboutMe.value).length == 0) {
        store.fetchAboutMe().then(() => {
            Object.assign(aboutMe, currentAboutMe.value)
        })
    } else{
        Object.assign(aboutMe, currentAboutMe.value)
    }
})


function editAboutMe() {
    loading.value = true

    store.editAboutMe(aboutMe)
        .then((response) => {
            Object.assign(toastEditAboutMe, parseSuccessMsg(response))
            loading.value = false
        })
        .catch((error) => {
            loading.value = false
            oldAboutMe = parseErrorsMsg(error.response, msg, aboutMe)
            Object.assign(toastEditAboutMe, parseFailMsg(error.response))
        })
}

</script>

<template>
    <div class="flex flex-col grow"
         v-if="!isLoading">
        <div
             class="w-1/2 flex flex-col bg-white mx-auto mt-6 p-6 rounded-lg drop-shadow-md shadow-black h-fit justify-between gap-6">

            <div>
                <Toast v-if="toastEditAboutMe"
                       :msg="toastEditAboutMe.msg"
                       :status="toastEditAboutMe.status" />
                <h1 class="text-gray-800 font-bold text-2xl">
                    About me
                </h1>
            </div>
            <form @submit.prevent="editAboutMe"
                  class="space-y-6">
                <Input v-model="aboutMe.contact"
                       :blur="clearInputOnBlur"
                       :type="'email'"
                       :name="'email'"
                       :id="'email'"
                       :placeholder="'Contact email'"
                       :required="true"
                       :msg="msg.contact" />

                <TextArea v-model="aboutMe.biography"
                          :blur="clearInputOnBlur"
                          :name="'bio'"
                          :id="'bio'"
                          :placeholder="'Type your bio'"
                          :title="'Enter your bio'"
                          :required="true"
                          :msg="msg.biography" />
                <div>
                    <Submit :submitStatus="isDisabled"
                            :loading="loading">Edit</Submit>
                </div>
            </form>
        </div>
    </div>
    <div class="grow"
         v-else>
        <LoadingSpin />
    </div>
</template>
