<script setup>
import { ref, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/UserStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

import Navbar from '@/views/NavBar/NavBar.vue'
import LoadingSpin from '@/components/LoadingSpin.vue'

const store = useUserStore()
const router = useRouter()

const isAuth = ref('')

const { getUser: user } = storeToRefs(store)

const isLoading = ref(true)

onMounted(() => {
    isAuth.value = store.setToken()

    if (isAuth.value != '' && Object.keys(user.value).length == 0) {
         store.fetchUser().then(() => {
            isLoading.value = false
         }).catch((error) => { })
    }
    else{
        isLoading.value = false
    }
})

watch(isLoading, ()=>{
    if(user.value.status != null){
        router.push({name: 'restore-account'})
    }

})


</script>

<template>
    <Navbar :auth="isAuth"
            :loading="isLoading" />

    <div class="absolute bg-gray-50 h-fit w-full min-h-[calc(100%-58px)]">
        <RouterView v-if="!isLoading" />
    </div>
    <div v-if="isLoading">
        <LoadingSpin />
    </div>
</template>