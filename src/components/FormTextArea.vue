<script setup>
import Error from '@/components/FormError.vue'
const props = defineProps({
    'modelValue': String,
    'blur': Function,
    'change': Function,
    'keyup': Function,
    'name': String,
    'id': String,
    'placeholder': String,
    'title': String,
    'required': {
        default: false,
        type: Boolean
    },
    'msg': {
        default: [],
        type: Array
    }
})
defineEmits(['update:modelValue'])
</script>

<template>
    <div class="flex flex-col">
        <textarea :value="modelValue"
                  @input="$emit('update:modelValue', $event.target.value)"
                  @blur="blur"
                  @change="change"
                  @keyup="keyup"
                  :name="name"
                  :id="id"
                  :placeholder="placeholder"
                  :title="title"
                  :class="[
                    'overflow-hidden resize-none rounded-md form-control block w-full h-52 px-3 py-1.5 text-xl font-normal bg-white bg-clip-padding border border-solid transition ease-in-out m-0 focus:bg-white focus:border-blue-600 focus:outline-none',
                    msg.length ? 'border-red-600 bg-red-100' : 'border-gray-300'

                  ]"></textarea>
        <Error v-if="msg.length"
               class="mt-3 ml-10"
               :msg="msg" />
    </div>
</template>
