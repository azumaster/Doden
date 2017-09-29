<template>
    <Select v-model="select" style="width:200px" :placeholder="placeholder">
        <Option v-for="(option, key) in options" :value="option.divide_id" :key="key">{{ option.dividename }}</Option>
    </Select>
</template>

<script>
    export default {
        name: 'select',
        props: ['options', 'placeholder'],
        data: function () {
            return {
                select: ''
            };
        }
    };
</script>