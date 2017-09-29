<template>
    <Menu mode="horizontal" :active-name="active" @on-select="toTab">
            <Menu-item v-for="(tab,i) in tabs" :key="i" :name="tab.key" @click="toTab">{{ tab.name }}</Menu-item>
        </Menu>

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