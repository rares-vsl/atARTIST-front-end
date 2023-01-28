<script setup>
import { onMounted, reactive, computed, ref } from 'vue'

import { useCMSStore } from '@/stores/CMSStore'
import { useRouter } from 'vue-router'

import Input from '@/components/FormInput.vue'
import TextArea from '@/components/FormTextArea.vue'
import Submit from '@/components/FormSubmit.vue'

import BreadCrumbs from '@/components/BreadCrumbs.vue'
import Toast from '@/components/FormToast.vue'

import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'
import { clearErrorsMsg } from '@/compostables/clearErrorsMsg.js'
import { parseFailMsg } from '@/compostables/parseFailMsg.js'

const store = useCMSStore()
const router = useRouter()

const gallery = reactive({
    name: 'test',
    description: 'questo e  un test'})

let oldGallery = ''

const msg = reactive({
    name: '',
    description: ''
})

const previous = [
    {
        path: 'Galleries',
        url: '/portfolio/galleries'
    },
]

const loading = ref(false)
const isDisabled = computed(() => invalidForm(gallery, msg))


const toast = reactive({})

function clearInputOnBlur(event) {
    return clearErrorsMsg(event, msg, gallery, oldGallery)
}

function createGallery() {
    loading.value = true

    store.createGallery(gallery)
        .then((newGallery) => {
            router.push({
                    name: 'galleries-view',
                    params: { slug: newGallery.slug }
                })
        })
        .catch((error) => {
            loading.value = false
            oldGallery = parseErrorsMsg(error.response, msg, gallery)
            Object.assign(toast, parseFailMsg(error.response))
        })
}

</script>

<template>
    <div class="flex flex-col grow">
        <div class="w-1/2 bg-white mx-auto mt-6 p-6 rounded-lg drop-shadow-md shadow-black space-y-10 h-fit">
            <BreadCrumbs :previous="previous"
                         :current="'New gallery'" />

            <div>
                <Toast v-if="toast"
                       :msg="toast.msg"
                       :status="toast.status" />
                <h1 class="text-gray-800 font-bold text-2xl">
                    New gallery
                </h1>
            </div>
            <form @submit.prevent="createGallery"
                  class="space-y-6">
                <Input v-model="gallery.name"
                       :blur="clearInputOnBlur"
                       :type="'text'"
                       :name="'name'"
                       :id="'name'"
                       :placeholder="'Gallery name'"
                       :title="'Enter the gallery\'s name'"
                       :required="true"
                       :msg="msg.name" />

                <TextArea v-model="gallery.description"
                          :blur="clearInputOnBlur"
                          :name="'description'"
                          :id="'description'"
                          :placeholder="'Gallery description'"
                          :title="'Enter the gallery\'s description'"
                          :required="true"
                          :msg="msg.description" />
                <div>
                    <Submit :submitStatus="isDisabled"
                            :loading="loading">Create gallery</Submit>
                </div>
            </form>
        </div>
    </div>

</template>