<script setup>
defineProps(['headers'])
</script>

<template>
    <table class="table-auto w-full">
        <thead class="border-b bg-gray-50 ">
            <tr>
                <th v-for="header in headers"
                    scope="col"
                    class="text-lg font-bold text-slate-800 px-6 py-4 text-left rounded-full">
                    {{ header }}
                </th>
            </tr>
        </thead>
        <tbody>
            <slot></slot>
            <!-- <tr class="bg-white border-b">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2</td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    Jacob
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    Thornton
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    @fat
                </td>
            </tr>
            <tr class="bg-white border-b">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3</td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    Larry
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    Wild
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    @twitter
                </td>
            </tr> -->
        </tbody>
    </table>
</template>

