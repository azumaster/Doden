<template>
    <Tabs  mode="horizontal" :active-name="active" @on-click="toTab">
            <TabPane  v-for="(tab,i) in tabs" :key="i" :label="tab.name" :name="tab.key"></TabPane >
        </Tabs >

</template>
<script>
    export default {
        data () {
            return { active: this.tabs[0].key };
        },
        props: ['tabs'],
        methods: {
            toTab(e){
                window.location.href = '#/'+e;
            }
        }
    };
</script>