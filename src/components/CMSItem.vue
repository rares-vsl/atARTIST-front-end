<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
const prosp = defineProps(['name', 'slug', 'posts_count', 'type'])

const router = useRouter()
const URL = computed(() => {
    return prosp.slug ? prosp.slug : ''
})
</script>

<template>
    <div class="border-b-2 py-4 w-full space-y-3">
        <div class="flex bg-reds-400 gap-6 items-end ">
            <div class="flex items-center">
                <RouterLink class="h-8 w-8 cursor-pointer"
                            :to="{
                                name: type + '-view',
                                params: { slug: URL }
                            }">
                    <slot></slot>
                </RouterLink>
                <RouterLink class="text-3xl font-bold ml-6 cursor-pointer"
                            :to="{
                                name: type + '-view',
                                params: { slug: URL }
                            }">
                    {{ name }}
                </RouterLink>
            </div>
            <span class="text-lg font-light text-gray-600"
                  v-if="posts_count != null">
                {{ posts_count }} posts
            </span>
        </div>
        <div class="flex flex-col gap-3 w-full">
            <div class="flex justify-between w-full">
                <span class="text-lg bg-blue-200 w-fit px-2 py-1 rounded-md  ml-14">/{{ slug }}</span>
                <Button action="edit"
                        @click="router.push({
                            name: type + '-edit',
                            params: { slug: URL }
                        })">
                    Edit
                </Button>
            </div>
        </div>
    </div>
</template>