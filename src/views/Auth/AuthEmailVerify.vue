<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/UserStore'
import LoadingSpin from '@/components/LoadingSpin.vue'

const router = useRouter()
const store = useUserStore()

onMounted(() => {
  var id = router.currentRoute.value.query.id
  var hash = router.currentRoute.value.query.hash
  var expires = router.currentRoute.value.query.expires
  var signature = router.currentRoute.value.query.signature

  if (id == null || hash == null || expires == null || signature == null)
    router.push({ name: 'home' })

  store.verifyEmail(id, hash, expires, signature).then(() => {
    router.push({ name: 'home' })
  })
    .catch(() => {
      router.push({ name: 'not-found' })
    })

})
</script>

<template>
  <div class="w-full text-2xl pt-8 flex justify-center align-middle gap-5 font-bold">
    <p>Verifying your email</p>
    <div class="w-18 h-18">
      <LoadingSpin class="mt-1" />
    </div>
  </div>
</template>