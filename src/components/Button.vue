<template>
    <button type="button"
            :class="{
                'inline-block px-4 py-2 font-bold text-xs leading-tight uppercase rounded-md shadow-mdhover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out': true,
                'bg-green-500 text-white focus:bg-green-600 hover:bg-green-600 active:bg-green-700': action == 'edit',
                'bg-blue-600 text-white focus:bg-blue-700 hover:bg-blue-700 active:bg-blue-800': action == 'create'
            }">
        <slot></slot>
    </button>
</template>
<script setup>
defineProps(['action'])
</script>