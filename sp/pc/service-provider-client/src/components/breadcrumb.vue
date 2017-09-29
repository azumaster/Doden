<template>
    <div class="layout-breadcrumb">
        <Breadcrumb>
            <Breadcrumb-item v-for="(h, i) in history" :key="i" :href="h.href">{{ h.name }}</Breadcrumb-item>
        </Breadcrumb>
    </div>
</template>

<script>
    export default {
        name: 'breadcrumb',
        props: ['history'],
        data: ()=>{
            return {
                currentBreadcrumb:{}
            };
        }
    };
</script>