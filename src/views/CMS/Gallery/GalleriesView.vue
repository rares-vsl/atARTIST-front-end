<script setup>
import { onMounted, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCMSStore } from '@/stores/CMSStore'
import { useRouter } from 'vue-router'

import { ArchiveBoxArrowDownIcon, PencilIcon, TrashIcon }
    from '@heroicons/vue/24/outline'

import { ArchiveBoxXMarkIcon }
    from '@heroicons/vue/24/solid'

import Table from '@/components/Table.vue'
import TableRow from '@/components/TableRow.vue'
import TableData from '@/components/TableData.vue'
import LoadingSpin from '@/components/LoadingSpin.vue'
import Button from '@/components/Button.vue'

const store = useCMSStore()
const router = useRouter()
const { getGalleries: galleries } = storeToRefs(store)

const currentRoute = computed(() => router.currentRoute)

const isLoading = ref(true)

onMounted(() => {
    if (galleries.value.length == 0) {
        store.fetchGalleries()
            .then(() => isLoading.value = false)
    } else isLoading.value = false
})

function editGalleryArchiveStatus(gallery) {
    store.editGalleryArchiveStatus(gallery)
}

function deleteGallery(gallery) {
    store.deleteGallery(gallery)
}

</script>

<template>
    <div v-if="!isLoading"
         class="flex flex-col grow">
        <div
             class="md:w-[72rem] flex flex-col bg-white mx-auto mt-6 p-6 rounded-lg drop-shadow-md shadow-black h-fit justify-between">
            <div class="flex justify-between mb-5 ">
                <h1 class="text-3xl font-semibold text-blue-700"> Your galleries</h1>
                <Button action="create"
                        @click="router.push({ name: 'galleries-add' })">Add gallery</Button>
            </div>
            <div class="rounded-lg w-full overflow-x-auto border border-gray-200"
                 v-if="galleries.length > 0">
                <Table :headers="['Index', 'Name', 'URL', 'Posts', '', '', '']">
                    <TableRow v-for="gallery in galleries"
                              :class="{
                                  'bg-gray-100': gallery.archived
                              }">
                        <TableData class="w-1">
                            <span :class="{
                                'text-gray-600': gallery.archived,
                                'text-gray-800': !gallery.archived
                            }">
                                {{ gallery.index }}
                            </span>
                        </TableData>
                        <TableData class="w-1/6">
                            <RouterLink class="cursor-pointer text-blue-700"
                                        :to="{
                                            name: 'galleries-view',
                                            params: { slug: gallery.slug }
                                        }">
                                {{ gallery.name }}
                            </RouterLink>

                        </TableData>
                        <TableData class="w-1/4">
                            /{{ gallery.slug }}
                        </TableData>
                        <TableData>
                            {{ gallery.posts_count == 0 ? 'This gallery is still empty' : gallery.posts_count }}
                        </TableData>
                        <TableData class="w-1">
                            <button @click="() => editGalleryArchiveStatus(gallery)"
                                    class="text-gray-600 block"
                                    type="button">
                                <ArchiveBoxXMarkIcon v-if="gallery.archived"
                                                     class="h-6 w-6" />
                                <ArchiveBoxArrowDownIcon v-else
                                                         class="h-6 w-6" />

                            </button>
                        </TableData>
                        <TableData class="w-1">
                            <div class="cursor-pointer text-green-600"
                                 @click="router.push({
                                     name: 'galleries-edit',
                                     params: { slug: gallery.slug }
                                 })">
                                <PencilIcon class="h-6 w-6" />
                            </div>
                        </TableData>
                        <TableData class="w-1">
                            <button @click="() => deleteGallery(gallery)"
                                    class="cursor-pointer text-red-600 block">
                                <TrashIcon class="h-6 w-6" />
                            </button>
                        </TableData>
                    </TableRow>
                </Table>
            </div>
            <div v-else
                 class="text-xl text-center py-4">
                <p>Your portfolio has no galleries yet</p>
            </div>
        </div>
    </div>

    <div class="grow"
         v-if="isLoading">
        <LoadingSpin />
    </div>
</template>