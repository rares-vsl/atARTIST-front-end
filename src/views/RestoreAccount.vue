<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'

import Submit from '@/components/FormSubmit.vue'


const router = useRouter()

const store = useUserStore()

const loading = ref(false)

onMounted(() => {
    let user = store.getUser
    
    if (Object.keys(user).length == 0 || user.active)
        router.push({ name: 'home' })
})

function restoreAccount() {
    store.restoreAccount()
        .then(() => {
            router.push({ name: 'home' })
        })
        .catch((error) => {
        })

}
</script>

<template>
    <div class="grow flex flex-col justify-start items-center bg-white h-full py-[10%]">
        <div class="flex flex-col p-12 md:w-[42rem] w-full">
            <div class="text-center z-0 space-y-8">
                <h1 class="text-gray-800 font-bold text-3xl mb-2 text-center">
                    Restore your account
                </h1>
                <p>Click the restore button to restore your account</p>
            </div>

            <div>
                <Submit :loading="loading"
                        @click="restoreAccount">Restore</Submit>
            </div>
        </div>
    </div>
</template>
