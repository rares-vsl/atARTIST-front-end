<script setup>
defineProps(['path', 'current_path', 'name'])
</script>

<template>
    <li>
        <RouterLink :to="path"
                    :class="{
                        'dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap my-2': true,
                        'bg-blue-700 text-white hover:bg-blue-500 '
                            : current_path == name,
                        'text-gray-700 hover:bg-gray-100 '
                            : current_path != name
                    }">
            <slot></slot>
        </RouterLink>
    </li>
</template>