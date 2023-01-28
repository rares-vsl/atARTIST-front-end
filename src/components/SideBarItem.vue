<script setup>
import { computed } from 'vue'
const props = defineProps(['path', 'current_path', 'name'])

const currentPath = computed(() => {
    return props.current_path.split('-')[0]
})
</script>

<template>
    <li class="relative">
        <RouterLink :to="path"
                    :class="{
                        'flex items-center text-base py-3 px-6 text-ellipsis whitespace-nowrap rounded mx-2 transition duration-300 ease-in-out': true,
                        'bg-blue-700 text-white hover:bg-blue-500'
                            : currentPath == name,
                        'text-gray-700 hover:bg-gray-300 '
                            : currentPath != name
                    }">
            <slot></slot>

        </RouterLink>
    </li>
    <slot name="header"
          v-if="currentPath == name"></slot>
</template>
