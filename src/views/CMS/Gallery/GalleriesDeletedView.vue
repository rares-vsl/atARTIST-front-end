<script setup>
import { onMounted, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCMSStore } from '@/stores/CMSStore'
import { useRouter } from 'vue-router'

import Table from '@/components/Table.vue'
import TableRow from '@/components/TableRow.vue'
import TableData from '@/components/TableData.vue'
import LoadingSpin from '@/components/LoadingSpin.vue'
import Button from '@/components/Button.vue'

const store = useCMSStore()
const router = useRouter()
const { getDeletedGalleries: galleries } = storeToRefs(store)

const currentRoute = computed(() => router.currentRoute)


const isLoading = ref(true)

onMounted(() => {
    if (galleries.value.length == 0) {
        store.fetchDeletedGalleries()
        .then(() => isLoading.value = false)
    } else isLoading.value = false
})

function restoreGallery(gallery) {
    store.restoreGallery(gallery)
}

function confirmDeletionGallery(gallery) {
    store.confirmDeletionGallery(gallery)
}

</script>

<template>
    <div v-if="!isLoading"
         class="flex flex-col grow">
        <div
             class="md:w-[72rem] flex flex-col bg-white mx-auto mt-6 p-6 rounded-lg drop-shadow-md shadow-black h-fit justify-between">
            <div class="flex justify-between mb-5 ">
                <h1 class="text-3xl font-semibold text-blue-700"> Your deleted galleries</h1>
            </div>
            <div class="rounded-lg w-full overflow-x-auto border border-gray-200"
                 v-if="galleries.length > 0">
                <Table :headers="['Name', 'URL', 'Posts', '', '']">
                    <TableRow v-for="gallery in galleries">
                        <TableData class="w-1/6">
                            {{ gallery.name }}
                        </TableData>
                        <TableData class="w-1/4">
                            /{{ gallery.slug }}
                        </TableData>
                        <TableData>
                            {{ gallery.posts_count == 0 ? 'This gallery is still empty' : gallery.posts_count }}
                        </TableData>
                        <TableData class="w-1">
                            <button @click="() => restoreGallery(gallery)"
                                    class="text-green-600 block"
                                    type="button">
                                Restore
                            </button>
                        </TableData>
                        <TableData class="w-1">
                            <button @click="()=>confirmDeletionGallery(gallery)"
                                    class="cursor-pointer text-red-600 block">
                                Delete
                            </button>
                        </TableData>
                    </TableRow>
                </Table>
            </div>
            <div v-else
                 class="text-xl text-center py-4">
                <p>Your portfolio has no deleted galleries</p>
            </div>
        </div>
    </div>

    <div class="grow"
         v-if="isLoading">
        <LoadingSpin />
    </div>
</template>