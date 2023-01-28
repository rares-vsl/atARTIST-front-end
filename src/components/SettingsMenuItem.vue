<script setup>
defineProps(['path', 'current_path', 'name'])
</script>

<template>
    <li>
        <RouterLink :to="path"
                    :class="{
                        'text-gray-700 hover:text-gray-900 font-bold'
                            : current_path == name,
                        'text-gray-600 hover:text-blue-900 '
                            : current_path != name
                    }">
            <slot></slot>
        </RouterLink>
    </li>
</template>