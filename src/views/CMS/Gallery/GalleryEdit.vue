<script setup>
import { onMounted, reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useCMSStore } from '@/stores/CMSStore'

import Input from '@/components/FormInput.vue'
import TextArea from '@/components/FormTextArea.vue'
import Submit from '@/components/FormSubmit.vue'

import LoadingSpin from '@/components/LoadingSpin.vue'
import BreadCrumbs from '@/components/BreadCrumbs.vue'
import Index from '@/components/Index.vue'
import Toast from '@/components/FormToast.vue'

import { parseErrorsMsg } from '@/compostables/parseErrorsMsg.js'
import { invalidForm } from '@/compostables/invalidForm.js'
import { clearErrorsMsg } from '@/compostables/clearErrorsMsg.js'
import { parseFailMsg } from '@/compostables/parseFailMsg.js'
import { parseSuccessMsg } from '@/compostables/parseSuccessMsg.js'


const store = useCMSStore()
const router = useRouter()

const slug = ref('')

const currentGallery = reactive({})

const gallery = reactive({})

let oldGallery = ''

const msg = reactive({
    name: '',
    description: ''
})

const galleries_count = computed(() => store.getPortfolio.galleries_count)

const toastEditGallery = reactive({})
const toastEditIndex= reactive({})

const isDisabled = computed(() => {
    var name = currentGallery.name
    var description = currentGallery.description

    return invalidForm(gallery, msg) || (
        name == gallery.name && description == gallery.description
    )
})

const isLoading = computed(() => {
    return !Object.keys(gallery).length
})

const previous = computed(() => {
    return [
        {
            path: 'Galleries',
            url: '/portfolio/galleries'
        },
        {
            path: currentGallery.name,
            url: '/portfolio/galleries/' + currentGallery.slug
        }
    ]
})

const loading = ref(false)

function clearInputOnBlur(event) {
  return clearErrorsMsg(event, msg, gallery, oldGallery)
}

onMounted(() => {
    slug.value = router.currentRoute.value.params.slug

    Object.assign(gallery, store.getGallery(slug.value))

    if (!Object.keys(gallery).length) {
        store.fetchGallery(slug.value)
            .then((responseGallery) => {
                Object.assign(gallery, responseGallery)
                Object.assign(currentGallery, responseGallery)

            }).catch(() => {
                router.push({ name: 'not-found' })
            })
    } else Object.assign(currentGallery, gallery)
})


function editGallery() {
    loading.value = true

    store.editGallery(gallery)
        .then((response) => {
            var updatedGallery = response.data.data.gallery
            Object.assign(currentGallery, updatedGallery)
            Object.assign(toastEditGallery, parseSuccessMsg(response))

            router.replace('/portfolio/galleries/' + updatedGallery.slug + '/edit')
            loading.value = false
        })
        .catch((error) => {
            loading.value = false
            oldGallery = parseErrorsMsg(error.response, msg, gallery)
            Object.assign(toastEditGallery, parseFailMsg(error.response))
        })
}

function editGalleryIndex() {
    store.editGalleryIndex(gallery)
        .then((response) => {
            Object.assign(toastEditIndex, parseSuccessMsg(response))
            currentGallery.index = gallery.index
        })
        .catch((error) => {
            oldGallery = parseErrorsMsg(error.response, msg, gallery)
            Object.assign(toastEditIndex, parseFailMsg(error.response))
        })
}

</script>

<template>
    <div class="flex flex-col grow"
         v-if="!isLoading">
        <div
             class="w-1/2 flex flex-col bg-white mx-auto mt-6 p-6 rounded-lg drop-shadow-md shadow-black h-fit justify-between gap-6">
            <BreadCrumbs :previous="previous"
                         :current="'edit'" />

            <div>
                <Toast v-if="toastEditGallery"
                       :msg="toastEditGallery.msg"
                       :status="toastEditGallery.status" />
                <h1 class="text-gray-800 font-bold text-2xl">
                    Edit gallery
                </h1>
            </div>
            <form @submit.prevent="editGallery"
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
                            :loading="loading">Edit</Submit>
                </div>
            </form>
        </div>
        <div v-if="!gallery.archived"
             class="w-1/2 flex flex-col bg-white mx-auto mt-6 p-6 rounded-lg drop-shadow-md shadow-black h-fit justify-between gap-6">

             <div>
                <Toast v-if="toastEditIndex"
                       :msg="toastEditIndex.msg"
                       :status="toastEditIndex.status" />
                <h1 class="text-gray-800 font-bold text-2xl">
                    Change index
                </h1>
            </div>
            <Index :index="galleries_count"
                   :click="editGalleryIndex"
                   v-model="gallery.index" />
        </div>
    </div>
    <div class="grow"
         v-else>
        <LoadingSpin />
    </div>
</template>
